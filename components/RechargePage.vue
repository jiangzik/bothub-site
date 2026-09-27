<script setup lang="ts">
import QRCode from 'qrcode'
import { BothubApiError } from '~/composables/useBothubAccount'

/**
 * 官网充值：登录 → 选余额档位 / Pro 套餐 → 选付款方式 → 付款 → 等到账。
 *
 * 商品、付款方式、每类设备上拿到哪种付款动作全由服务端决定（`GET /v1/app/config` 的 billing.checkout），
 * 这里只执行两种动作：电脑上扫码（qr），手机上跳转收银台（redirect）。
 * alipay_sdk 只有 App 能调，网页上不列出只能走它的付款方式。
 */

type CheckoutMethod = 'alipay' | 'wechat'
type OrderKind = 'credit' | 'pro'
type Device = 'mobile' | 'desktop'

interface CheckoutMethodConfig {
  method: CheckoutMethod
  channel: string
  actions: { mobile: string | null; desktop: string | null }
}

interface CreditProduct {
  productId: string
  amountFen: number
  creditFen: number
  bonusFen: number
  title: string
  formattedPrice: string
  benefitLabel: string
}

interface ProProduct {
  productId: string
  amountFen: number
  proDays: number
  title: string
  formattedPrice: string
}

interface CheckoutConfig {
  methods: CheckoutMethodConfig[]
  creditProducts: CreditProduct[]
  proProducts: ProProduct[]
}

interface ProductItem {
  kind: OrderKind
  productId: string
  title: string
  subtitle: string | null
  priceLabel: string
}

type CheckoutAction =
  | { type: 'qr'; content: string; url: string | null }
  | { type: 'redirect'; url: string; qrContent: string | null }
  | { type: 'alipay_sdk'; orderString: string }

interface CheckoutOrder {
  outTradeNo: string
  status: string
  action: CheckoutAction
}

interface Entitlements {
  plan: string
  planExpiresAt: string | null
  creditBalance: { balanceFen: number }
}

/** 跳去收银台之前记下来，付完回到这个页面时接着等到账。 */
interface PendingRedirectOrder {
  outTradeNo: string
  kind: OrderKind
  title: string
  priceLabel: string
  method: CheckoutMethod
  url: string
  qrContent: string | null
  createdAt: number
}

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'zh' })

const PENDING_ORDER_KEY = 'bothub.web.pendingOrder'
/** 跳走之后超过这么久才回来，就不再自动接着等（订单不作废，付了照样到账）。 */
const PENDING_ORDER_MAX_AGE_MS = 30 * 60 * 1000
const POLL_INTERVAL_MS = 3_000
/** 约 10 分钟：扫码可能在另一台手机上慢慢付。 */
const POLL_MAX_ATTEMPTS = 200

const account = useBothubAccount()
const user = account.user

const zh = computed(() => props.lang !== 'en')
const copy = computed(() => zh.value
  ? {
      title: '充值',
      subtitle: '为你的 BotHub 账号充值 AI 余额或开通 Pro，付款后立即到账，所有设备通用。',
      loginTitle: '登录 BotHub 账号',
      loginHint: '使用在 App 里注册的邮箱和密码登录。',
      email: '邮箱',
      password: '密码',
      login: '登录',
      loggingIn: '登录中…',
      forgot: '忘记密码 / 还没设置过密码',
      noAccount: '还没有账号？先下载 BotHub 注册，再回来充值。',
      download: '下载 BotHub',
      resetTitle: '设置新密码',
      resetHint: '通过 Google 或 Apple 登录的账号也可以在这里设置密码，之后就能用邮箱登录。',
      code: '验证码',
      sendCode: '发送验证码',
      sending: '发送中…',
      resendIn: (s: number) => `${s} 秒后可重发`,
      codeSent: '如果这个邮箱已注册，验证码会发到邮箱里。',
      newPassword: '新密码（至少 8 位）',
      resetSubmit: '设置并登录',
      backToLogin: '返回登录',
      signedInAs: '当前账号',
      logout: '退出登录',
      balance: 'AI 余额',
      plan: '套餐',
      planPro: (date: string | null) => date ? `Pro · ${date} 到期` : 'Pro',
      planFree: '免费版',
      tabCredit: 'AI 余额',
      tabPro: 'Pro 会员',
      creditHint: '余额用于 BotHub 内置 AI 模型，按实际用量扣费。',
      proHint: 'Pro 开放云备份、远程控制等高级功能。',
      bonus: (yuan: string) => `含赠送 ¥${yuan}`,
      proDays: (d: number) => `${d} 天`,
      unavailable: '暂未开放在线充值，请在 App 内购买或联系客服。',
      loadFailed: '充值信息加载失败，请刷新重试。',
      confirmTitle: '确认订单',
      product: '商品',
      amount: '金额',
      payMethod: '付款方式',
      alipay: '支付宝',
      wechat: '微信支付',
      pay: '去付款',
      creating: '正在下单…',
      cancel: '取消',
      scanTitle: (m: string) => `请用${m}扫码付款`,
      scanHint: '付款完成后会自动到账，请不要关闭此窗口。',
      openCashier: '在浏览器中打开收银台',
      checkPaid: '我已付款',
      checking: '查询中…',
      notYet: '还没收到付款。如果已经付过，请稍等片刻再点一次。',
      waitTitle: '等待付款结果',
      waitHint: '在支付页面完成付款后回到这里，会自动确认到账。',
      reopen: '重新打开付款页面',
      scanInstead: '付款页面打不开？用另一台手机扫下面的码：',
      paidTitle: '付款成功',
      paidCredit: '余额已到账。',
      paidPro: 'Pro 已开通。',
      done: '完成',
      closedHint: '订单没有作废：如果之后完成了付款，会自动到账。',
      wechatBrowser: '微信内置浏览器无法打开支付宝，请点右上角「…」选择「在浏览器打开」。',
      appOnly: '当前付款方式只能在 App 内使用。',
      errInvalidEmail: '请输入有效的邮箱地址。',
      errPassword: '请输入密码。',
      errCredentials: '邮箱或密码不正确。',
      errCode: '请输入 6 位验证码。',
      errNewPassword: '新密码至少 8 位。',
      errRateLimit: '操作太频繁，请稍后再试。',
      errDisabled: (reason: string | null) => reason ? `账号已被停用：${reason}` : '账号已被停用。',
      errGeneric: '请求失败，请稍后重试。',
      errSession: '登录已过期，请重新登录。',
    }
  : {
      title: 'Top up',
      subtitle: 'Add AI credits or get Pro for your BotHub account. Credited instantly and shared across all your devices.',
      loginTitle: 'Sign in to BotHub',
      loginHint: 'Use the email and password you registered in the app.',
      email: 'Email',
      password: 'Password',
      login: 'Sign in',
      loggingIn: 'Signing in…',
      forgot: 'Forgot password / never set one',
      noAccount: 'No account yet? Download BotHub to sign up, then come back.',
      download: 'Download BotHub',
      resetTitle: 'Set a new password',
      resetHint: 'Accounts that sign in with Google or Apple can set a password here to sign in with email.',
      code: 'Verification code',
      sendCode: 'Send code',
      sending: 'Sending…',
      resendIn: (s: number) => `Resend in ${s}s`,
      codeSent: 'If this email is registered, a code has been sent.',
      newPassword: 'New password (8+ characters)',
      resetSubmit: 'Set password and sign in',
      backToLogin: 'Back to sign in',
      signedInAs: 'Signed in as',
      logout: 'Sign out',
      balance: 'AI credits',
      plan: 'Plan',
      planPro: (date: string | null) => date ? `Pro · until ${date}` : 'Pro',
      planFree: 'Free',
      tabCredit: 'AI credits',
      tabPro: 'Pro',
      creditHint: 'Credits pay for BotHub built-in AI models, billed by actual usage.',
      proHint: 'Pro unlocks cloud backup, remote control and more.',
      bonus: (yuan: string) => `Includes ¥${yuan} bonus`,
      proDays: (d: number) => `${d} days`,
      unavailable: 'Online top-up is not available right now. Please purchase in the app.',
      loadFailed: 'Failed to load top-up options. Please refresh.',
      confirmTitle: 'Confirm order',
      product: 'Item',
      amount: 'Amount',
      payMethod: 'Pay with',
      alipay: 'Alipay',
      wechat: 'WeChat Pay',
      pay: 'Pay',
      creating: 'Creating order…',
      cancel: 'Cancel',
      scanTitle: (m: string) => `Scan with ${m}`,
      scanHint: 'Your account is credited automatically once paid. Keep this window open.',
      openCashier: 'Open checkout in browser',
      checkPaid: 'I have paid',
      checking: 'Checking…',
      notYet: 'Payment not received yet. If you have paid, wait a moment and try again.',
      waitTitle: 'Waiting for payment',
      waitHint: 'Finish paying on the payment page and come back here — we will confirm automatically.',
      reopen: 'Reopen payment page',
      scanInstead: 'Payment page won’t open? Scan this with another phone:',
      paidTitle: 'Payment received',
      paidCredit: 'Credits have been added.',
      paidPro: 'Pro is now active.',
      done: 'Done',
      closedHint: 'The order is still valid: if you finish paying later, it will be credited automatically.',
      wechatBrowser: 'WeChat’s built-in browser can’t open Alipay. Tap “…” and choose “Open in browser”.',
      appOnly: 'This payment method is only available in the app.',
      errInvalidEmail: 'Please enter a valid email address.',
      errPassword: 'Please enter your password.',
      errCredentials: 'Incorrect email or password.',
      errCode: 'Please enter the 6-digit code.',
      errNewPassword: 'Password must be at least 8 characters.',
      errRateLimit: 'Too many attempts. Please try again later.',
      errDisabled: (reason: string | null) => reason ? `Account disabled: ${reason}` : 'Account disabled.',
      errGeneric: 'Request failed. Please try again later.',
      errSession: 'Your session expired. Please sign in again.',
    })

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ACCOUNT_DISABLED_PREFIX = 'Account disabled'

function describeError(error: unknown, context: 'login' | 'other' = 'other'): string {
  if (error instanceof BothubApiError) {
    if (error.status === 429) return copy.value.errRateLimit
    if (error.status === 403 && error.message.startsWith(ACCOUNT_DISABLED_PREFIX)) {
      const reason = error.message.slice(ACCOUNT_DISABLED_PREFIX.length).replace(/^:\s*/, '').trim()
      return copy.value.errDisabled(reason || null)
    }
    if (error.status === 401) return context === 'login' ? copy.value.errCredentials : copy.value.errSession
    if (error.status < 500 && error.message) return error.message
    return copy.value.errGeneric
  }
  return copy.value.errGeneric
}

// ─── 设备 ──────────────────────────────────────────────

const device = ref<Device>('desktop')
const inWechat = ref(false)

function detectDevice(): void {
  const ua = navigator.userAgent
  const isIpadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  device.value = /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(ua) || isIpadOs ? 'mobile' : 'desktop'
  inWechat.value = /MicroMessenger/i.test(ua)
}

// ─── 商品与付款方式 ──────────────────────────────────────

const checkout = ref<CheckoutConfig | null>(null)
const configError = ref('')
const activeTab = ref<OrderKind>('credit')

const WEB_ACTIONS = ['qr', 'redirect']

const methods = computed(() => (checkout.value?.methods ?? [])
  .filter(item => WEB_ACTIONS.includes(item.actions[device.value] ?? '')))

const creditItems = computed<ProductItem[]>(() => (checkout.value?.creditProducts ?? []).map(product => ({
  kind: 'credit',
  productId: product.productId,
  title: product.benefitLabel || product.title,
  subtitle: product.bonusFen > 0 ? copy.value.bonus((product.bonusFen / 100).toFixed(2)) : null,
  priceLabel: product.formattedPrice,
})))

const proItems = computed<ProductItem[]>(() => (checkout.value?.proProducts ?? []).map(product => ({
  kind: 'pro',
  productId: product.productId,
  title: copy.value.proDays(product.proDays),
  subtitle: null,
  priceLabel: product.formattedPrice,
})))

const visibleItems = computed(() => activeTab.value === 'credit' ? creditItems.value : proItems.value)
const hasAnything = computed(() => methods.value.length > 0 && (creditItems.value.length > 0 || proItems.value.length > 0))

async function loadCheckoutConfig(): Promise<void> {
  configError.value = ''
  try {
    const data = await account.request('/v1/app/config') as { billing?: { checkout?: CheckoutConfig } }
    checkout.value = data.billing?.checkout ?? { methods: [], creditProducts: [], proProducts: [] }
    if (creditItems.value.length === 0 && proItems.value.length > 0) activeTab.value = 'pro'
  }
  catch (error) {
    console.error('[bothub] load checkout config failed', error)
    configError.value = copy.value.loadFailed
  }
}

// ─── 账号 ──────────────────────────────────────────────

const entitlements = ref<Entitlements | null>(null)

const balanceLabel = computed(() => {
  const fen = entitlements.value?.creditBalance.balanceFen
  return fen == null ? '—' : `¥${(fen / 100).toFixed(2)}`
})

const planLabel = computed(() => {
  const value = entitlements.value
  if (!value) return '—'
  if (value.plan !== 'pro') return copy.value.planFree
  const date = value.planExpiresAt ? new Date(value.planExpiresAt).toLocaleDateString(zh.value ? 'zh-CN' : 'en-US') : null
  return copy.value.planPro(date)
})

async function loadEntitlements(): Promise<void> {
  if (!user.value) return
  try {
    entitlements.value = await account.authed<Entitlements>('/v1/me/entitlements')
  }
  catch (error) {
    console.warn('[bothub] load entitlements failed', error)
    if (error instanceof BothubApiError && error.status === 401) {
      await account.logout()
      authMessage.value = copy.value.errSession
    }
  }
}

const authMode = ref<'login' | 'reset'>('login')
const email = ref('')
const password = ref('')
const resetCode = ref('')
const newPassword = ref('')
const authBusy = ref(false)
const authMessage = ref('')
const authMessageTone = ref<'error' | 'info'>('error')
const cooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function normalizedEmail(): string | null {
  const value = email.value.trim().toLowerCase()
  return EMAIL_REGEX.test(value) ? value : null
}

function setAuthMessage(text: string, tone: 'error' | 'info' = 'error'): void {
  authMessage.value = text
  authMessageTone.value = tone
}

async function handleLogin(): Promise<void> {
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!password.value) return setAuthMessage(copy.value.errPassword)
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.login(value, password.value)
    password.value = ''
    await afterSignedIn()
  }
  catch (error) {
    setAuthMessage(describeError(error, 'login'))
  }
  finally {
    authBusy.value = false
  }
}

function startCooldown(seconds: number): void {
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldown.value = seconds
  cooldownTimer = setInterval(() => {
    cooldown.value = Math.max(0, cooldown.value - 1)
    if (cooldown.value === 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

async function handleSendCode(): Promise<void> {
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (cooldown.value > 0) return
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.sendResetCode(value)
    startCooldown(60)
    setAuthMessage(copy.value.codeSent, 'info')
  }
  catch (error) {
    setAuthMessage(describeError(error))
  }
  finally {
    authBusy.value = false
  }
}

async function handleReset(): Promise<void> {
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!/^\d{6}$/.test(resetCode.value.trim())) return setAuthMessage(copy.value.errCode)
  if (newPassword.value.length < 8) return setAuthMessage(copy.value.errNewPassword)
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.resetPassword(value, resetCode.value.trim(), newPassword.value)
    resetCode.value = ''
    newPassword.value = ''
    authMode.value = 'login'
    await afterSignedIn()
  }
  catch (error) {
    setAuthMessage(describeError(error))
  }
  finally {
    authBusy.value = false
  }
}

async function handleLogout(): Promise<void> {
  closeDialog()
  clearPendingOrder()
  entitlements.value = null
  await account.logout()
}

async function afterSignedIn(): Promise<void> {
  await loadEntitlements()
  resumePendingOrder()
}

// ─── 下单与等待到账 ──────────────────────────────────────

type Stage = 'confirm' | 'creating' | 'qr' | 'waiting' | 'paid'

const selected = ref<ProductItem | null>(null)
const chosenMethod = ref<CheckoutMethod | null>(null)
const stage = ref<Stage>('confirm')
const qrSvg = ref('')
const cashierUrl = ref<string | null>(null)
const fallbackQrSvg = ref('')
const dialogError = ref('')
const checking = ref(false)
const notYet = ref(false)
const closedHint = ref('')
let currentOutTradeNo: string | null = null
let pollTimer: ReturnType<typeof setTimeout> | null = null
let pollAttempts = 0
/** 每次打开 / 关闭对话框都换一代：关掉之后晚到的请求结果一律丢弃。 */
let generation = 0

function methodLabel(method: CheckoutMethod | null): string {
  return method === 'wechat' ? copy.value.wechat : copy.value.alipay
}

function openCheckout(product: ProductItem): void {
  generation += 1
  stopPolling()
  selected.value = product
  chosenMethod.value = methods.value[0]?.method ?? null
  stage.value = 'confirm'
  qrSvg.value = ''
  fallbackQrSvg.value = ''
  cashierUrl.value = null
  dialogError.value = ''
  notYet.value = false
  closedHint.value = ''
  currentOutTradeNo = null
}

function closeDialog(): void {
  if (stage.value === 'creating') return
  const wasWaiting = stage.value === 'qr' || stage.value === 'waiting'
  generation += 1
  stopPolling()
  selected.value = null
  currentOutTradeNo = null
  if (wasWaiting) {
    closedHint.value = copy.value.closedHint
    void loadEntitlements()
  }
  if (stage.value === 'paid' || stage.value === 'waiting') clearPendingOrder()
}

function renderQr(content: string): Promise<string> {
  return QRCode.toString(content, { type: 'svg', margin: 1, width: 220, errorCorrectionLevel: 'M' })
}

async function createOrder(): Promise<void> {
  const product = selected.value
  const method = chosenMethod.value
  if (!product || !method || stage.value === 'creating') return
  const myGeneration = generation
  stage.value = 'creating'
  dialogError.value = ''
  try {
    const order = await account.authed<CheckoutOrder>('/v1/billing/checkout/orders', {
      body: {
        kind: product.kind,
        productId: product.productId,
        method,
        device: device.value,
        supportedActions: device.value === 'mobile' ? ['redirect', 'qr'] : ['qr'],
        idempotencyKey: crypto.randomUUID(),
      },
    })
    if (myGeneration !== generation) return
    currentOutTradeNo = order.outTradeNo
    const action = order.action
    if (action.type === 'qr') {
      qrSvg.value = await renderQr(action.content)
      cashierUrl.value = action.url
      stage.value = 'qr'
      startPolling(myGeneration)
      return
    }
    if (action.type === 'redirect') {
      savePendingOrder({
        outTradeNo: order.outTradeNo,
        kind: product.kind,
        title: product.title,
        priceLabel: product.priceLabel,
        method,
        url: action.url,
        qrContent: action.qrContent,
        createdAt: Date.now(),
      })
      window.location.href = action.url
      return
    }
    stage.value = 'confirm'
    dialogError.value = copy.value.appOnly
  }
  catch (error) {
    if (myGeneration !== generation) return
    stage.value = 'confirm'
    dialogError.value = describeError(error)
    if (error instanceof BothubApiError && error.status === 401) await handleLogout()
  }
}

function stopPolling(): void {
  if (pollTimer) clearTimeout(pollTimer)
  pollTimer = null
  pollAttempts = 0
}

function startPolling(myGeneration: number): void {
  stopPolling()
  const tick = async () => {
    if (myGeneration !== generation) return
    pollAttempts += 1
    const paid = await queryPaid(myGeneration)
    if (paid || myGeneration !== generation) return
    if (pollAttempts >= POLL_MAX_ATTEMPTS) {
      notYet.value = true
      return
    }
    pollTimer = setTimeout(tick, POLL_INTERVAL_MS)
  }
  pollTimer = setTimeout(tick, POLL_INTERVAL_MS)
}

/** 查一次订单状态；服务端在订单未付时会顺带去渠道主动查单，通知丢了也能到账。 */
async function queryPaid(myGeneration: number): Promise<boolean> {
  const outTradeNo = currentOutTradeNo
  if (!outTradeNo) return false
  try {
    const status = await account.authed<{ status: string }>(`/v1/billing/checkout/orders/${encodeURIComponent(outTradeNo)}`)
    if (myGeneration !== generation) return false
    if (status.status === 'paid') {
      stopPolling()
      clearPendingOrder()
      stage.value = 'paid'
      void loadEntitlements()
      return true
    }
    return false
  }
  catch (error) {
    // 单次查询失败不打断等待：下一轮再查。
    console.warn('[bothub] query order status failed', error)
    return false
  }
}

async function checkNow(): Promise<void> {
  if (checking.value) return
  checking.value = true
  notYet.value = false
  const myGeneration = generation
  try {
    const paid = await queryPaid(myGeneration)
    if (!paid && myGeneration === generation) {
      notYet.value = true
      if (!pollTimer) startPolling(myGeneration)
    }
  }
  finally {
    checking.value = false
  }
}

function reopenCashier(): void {
  if (cashierUrl.value) window.location.href = cashierUrl.value
}

function savePendingOrder(order: PendingRedirectOrder): void {
  try {
    localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order))
  }
  catch {
    // 存不下：回来时不会自动接着等，但订单照常，付了就会到账。
  }
}

function clearPendingOrder(): void {
  try {
    localStorage.removeItem(PENDING_ORDER_KEY)
  }
  catch {
    // 忽略：读的时候也会按有效期丢弃。
  }
}

function readPendingOrder(): PendingRedirectOrder | null {
  try {
    const raw = localStorage.getItem(PENDING_ORDER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingRedirectOrder
    if (!parsed.outTradeNo || Date.now() - parsed.createdAt > PENDING_ORDER_MAX_AGE_MS) {
      clearPendingOrder()
      return null
    }
    return parsed
  }
  catch {
    return null
  }
}

/** 从收银台回来：接着等这笔订单到账。 */
function resumePendingOrder(): void {
  const pending = readPendingOrder()
  if (!pending || !user.value) return
  generation += 1
  const myGeneration = generation
  selected.value = {
    kind: pending.kind === 'pro' ? 'pro' : 'credit',
    productId: pending.outTradeNo,
    title: pending.title,
    subtitle: null,
    priceLabel: pending.priceLabel,
  }
  chosenMethod.value = pending.method
  currentOutTradeNo = pending.outTradeNo
  cashierUrl.value = pending.url
  stage.value = 'waiting'
  dialogError.value = ''
  notYet.value = false
  fallbackQrSvg.value = ''
  if (pending.qrContent) {
    void renderQr(pending.qrContent).then((svg) => {
      if (myGeneration === generation) fallbackQrSvg.value = svg
    })
  }
  void queryPaid(myGeneration).then((paid) => {
    if (!paid && myGeneration === generation) startPolling(myGeneration)
  })
}

const paidKind = computed<OrderKind>(() => selected.value?.kind ?? 'credit')

function onVisibilityChange(): void {
  // 手机上从支付宝切回浏览器时，页面往往没有重新加载，只是重新可见。
  if (document.visibilityState !== 'visible' || !user.value) return
  if (stage.value === 'waiting' && selected.value) {
    void queryPaid(generation)
    return
  }
  if (!selected.value) resumePendingOrder()
}

onMounted(() => {
  detectDevice()
  account.restore()
  void loadCheckoutConfig()
  if (user.value) {
    email.value = user.value.email
    void afterSignedIn()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stopPolling()
  if (cooldownTimer) clearInterval(cooldownTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

const { localePath } = useDocusI18n()
</script>

<template>
  <div class="recharge" :class="{ 'recharge--auth': !user }">
    <header class="recharge-head">
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.subtitle }}</p>
    </header>

    <ClientOnly>
      <!-- 未登录 -->
      <section v-if="!user" class="card auth-card">
        <template v-if="authMode === 'login'">
          <h2>{{ copy.loginTitle }}</h2>
          <p class="muted">{{ copy.loginHint }}</p>
          <form class="form" @submit.prevent="handleLogin">
            <label class="field">
              <span>{{ copy.email }}</span>
              <input v-model="email" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com">
            </label>
            <label class="field">
              <span>{{ copy.password }}</span>
              <input v-model="password" type="password" autocomplete="current-password">
            </label>
            <button class="btn btn-primary" type="submit" :disabled="authBusy">
              {{ authBusy ? copy.loggingIn : copy.login }}
            </button>
          </form>
          <p v-if="authMessage" class="message" :data-tone="authMessageTone">{{ authMessage }}</p>
          <div class="auth-links">
            <button type="button" class="link" @click="authMode = 'reset'; setAuthMessage('')">{{ copy.forgot }}</button>
            <span class="muted">
              {{ copy.noAccount }}
              <NuxtLink :to="`${localePath('/')}#download`">{{ copy.download }}</NuxtLink>
            </span>
          </div>
        </template>

        <template v-else>
          <h2>{{ copy.resetTitle }}</h2>
          <p class="muted">{{ copy.resetHint }}</p>
          <form class="form" @submit.prevent="handleReset">
            <label class="field">
              <span>{{ copy.email }}</span>
              <input v-model="email" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com">
            </label>
            <div class="field-row">
              <label class="field">
                <span>{{ copy.code }}</span>
                <input v-model="resetCode" type="text" maxlength="6" inputmode="numeric" autocomplete="one-time-code">
              </label>
              <button type="button" class="btn btn-secondary" :disabled="authBusy || cooldown > 0" @click="handleSendCode">
                {{ cooldown > 0 ? copy.resendIn(cooldown) : copy.sendCode }}
              </button>
            </div>
            <label class="field">
              <span>{{ copy.newPassword }}</span>
              <input v-model="newPassword" type="password" autocomplete="new-password">
            </label>
            <button class="btn btn-primary" type="submit" :disabled="authBusy">{{ copy.resetSubmit }}</button>
          </form>
          <p v-if="authMessage" class="message" :data-tone="authMessageTone">{{ authMessage }}</p>
          <div class="auth-links">
            <button type="button" class="link" @click="authMode = 'login'; setAuthMessage('')">{{ copy.backToLogin }}</button>
          </div>
        </template>
      </section>

      <!-- 已登录 -->
      <template v-else>
        <section class="card account-card">
          <div class="account-row">
            <div>
              <span class="label">{{ copy.signedInAs }}</span>
              <strong class="account-email">{{ user.email }}</strong>
            </div>
            <button type="button" class="link" @click="handleLogout">{{ copy.logout }}</button>
          </div>
          <div class="stats">
            <div>
              <span class="label">{{ copy.balance }}</span>
              <strong class="stat">{{ balanceLabel }}</strong>
            </div>
            <div>
              <span class="label">{{ copy.plan }}</span>
              <strong class="stat">{{ planLabel }}</strong>
            </div>
          </div>
        </section>

        <p v-if="closedHint" class="message" data-tone="info">{{ closedHint }}</p>
        <p v-if="inWechat" class="message" data-tone="error">{{ copy.wechatBrowser }}</p>

        <p v-if="configError" class="message" data-tone="error">{{ configError }}</p>
        <p v-else-if="checkout && !hasAnything" class="message" data-tone="info">{{ copy.unavailable }}</p>

        <section v-if="hasAnything" class="products">
          <div class="tabs" role="tablist">
            <button
              v-if="creditItems.length > 0"
              type="button"
              role="tab"
              class="tab"
              :aria-selected="activeTab === 'credit'"
              @click="activeTab = 'credit'"
            >
              {{ copy.tabCredit }}
            </button>
            <button
              v-if="proItems.length > 0"
              type="button"
              role="tab"
              class="tab"
              :aria-selected="activeTab === 'pro'"
              @click="activeTab = 'pro'"
            >
              {{ copy.tabPro }}
            </button>
          </div>
          <p class="muted">{{ activeTab === 'credit' ? copy.creditHint : copy.proHint }}</p>
          <div class="grid">
            <button
              v-for="item in visibleItems"
              :key="item.productId"
              type="button"
              class="product"
              @click="openCheckout(item)"
            >
              <span class="product-title">{{ item.title }}</span>
              <span v-if="item.subtitle" class="product-subtitle">{{ item.subtitle }}</span>
              <strong class="product-price">{{ item.priceLabel }}</strong>
            </button>
          </div>
        </section>
      </template>

      <!-- 付款对话框 -->
      <div v-if="selected" class="overlay" @click.self="closeDialog">
        <div class="dialog" role="dialog" aria-modal="true">
          <template v-if="stage === 'confirm' || stage === 'creating'">
            <h2>{{ copy.confirmTitle }}</h2>
            <dl class="detail">
              <div><dt>{{ copy.product }}</dt><dd>{{ selected.title }}</dd></div>
              <div><dt>{{ copy.amount }}</dt><dd class="amount">{{ selected.priceLabel }}</dd></div>
            </dl>
            <div v-if="methods.length > 1" class="methods" role="radiogroup" :aria-label="copy.payMethod">
              <button
                v-for="item in methods"
                :key="item.method"
                type="button"
                role="radio"
                class="method"
                :aria-checked="chosenMethod === item.method"
                @click="chosenMethod = item.method"
              >
                {{ methodLabel(item.method) }}
              </button>
            </div>
            <p v-else class="muted">{{ copy.payMethod }}：{{ methodLabel(chosenMethod) }}</p>
            <p v-if="dialogError" class="message" data-tone="error">{{ dialogError }}</p>
            <div class="actions">
              <button type="button" class="btn btn-secondary" :disabled="stage === 'creating'" @click="closeDialog">{{ copy.cancel }}</button>
              <button type="button" class="btn btn-primary" :disabled="stage === 'creating' || !chosenMethod" @click="createOrder">
                {{ stage === 'creating' ? copy.creating : copy.pay }}
              </button>
            </div>
          </template>

          <template v-else-if="stage === 'qr'">
            <h2>{{ copy.scanTitle(methodLabel(chosenMethod)) }}</h2>
            <div class="qr" v-html="qrSvg" />
            <p class="amount center">{{ selected.priceLabel }}</p>
            <p class="muted center">{{ notYet ? copy.notYet : copy.scanHint }}</p>
            <div class="actions">
              <a v-if="cashierUrl" class="btn btn-secondary" :href="cashierUrl" target="_blank" rel="noopener">{{ copy.openCashier }}</a>
              <button type="button" class="btn btn-primary" :disabled="checking" @click="checkNow">
                {{ checking ? copy.checking : copy.checkPaid }}
              </button>
            </div>
          </template>

          <template v-else-if="stage === 'waiting'">
            <h2>{{ copy.waitTitle }}</h2>
            <dl class="detail">
              <div><dt>{{ copy.product }}</dt><dd>{{ selected.title }}</dd></div>
              <div><dt>{{ copy.amount }}</dt><dd class="amount">{{ selected.priceLabel }}</dd></div>
            </dl>
            <p class="muted">{{ notYet ? copy.notYet : copy.waitHint }}</p>
            <template v-if="fallbackQrSvg">
              <p class="muted small">{{ copy.scanInstead }}</p>
              <div class="qr qr-small" v-html="fallbackQrSvg" />
            </template>
            <div class="actions">
              <button v-if="cashierUrl" type="button" class="btn btn-secondary" @click="reopenCashier">{{ copy.reopen }}</button>
              <button type="button" class="btn btn-primary" :disabled="checking" @click="checkNow">
                {{ checking ? copy.checking : copy.checkPaid }}
              </button>
            </div>
          </template>

          <template v-else-if="stage === 'paid'">
            <h2>{{ copy.paidTitle }}</h2>
            <p class="muted">{{ paidKind === 'pro' ? copy.paidPro : copy.paidCredit }}</p>
            <div class="actions">
              <button type="button" class="btn btn-primary" @click="closeDialog">{{ copy.done }}</button>
            </div>
          </template>

          <button v-if="stage !== 'creating'" type="button" class="close" :aria-label="copy.cancel" @click="closeDialog">×</button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.recharge {
  --r-error: #c0362c;
  --r-success: #2f7d4f;
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 16px 96px;
  color: var(--text-primary);
  font-family: var(--font-sans);
}

:global(.dark) .recharge {
  --r-error: #ff8a80;
  --r-success: #7fd4a0;
}

.recharge-head h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.recharge-head p {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.7;
}

.card {
  margin-top: 28px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--cream-light);
  padding: 24px;
}

.card h2,
.dialog h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 650;
}

.muted {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.small {
  font-size: 13px;
}

.center {
  text-align: center;
}

.auth-card {
  max-width: 440px;
}

/* 未登录时页面只有一张登录卡片：标题与卡片一起居中。 */
.recharge--auth .recharge-head {
  text-align: center;
}

.recharge--auth .auth-card {
  margin-left: auto;
  margin-right: auto;
}

.form {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.field span {
  color: var(--text-secondary);
  font-size: 13px;
}

.field input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-size: 15px;
  padding: 10px 12px;
  outline: none;
}

.field input:focus-visible {
  border-color: var(--ink);
}

.field-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--ink);
  color: var(--cream-light);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-secondary {
  background: transparent;
  color: var(--ink);
  border-color: var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--sand);
}

.link {
  border: none;
  background: none;
  padding: 0;
  color: var(--ink);
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.auth-links {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.auth-links a {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.message {
  margin: 14px 0 0;
  font-size: 14px;
  line-height: 1.6;
}

.message[data-tone='error'] {
  color: var(--r-error);
}

.message[data-tone='info'] {
  color: var(--text-secondary);
}

.account-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.label {
  display: block;
  color: var(--text-muted);
  font-size: 13px;
}

.account-email {
  display: block;
  margin-top: 4px;
  font-size: 15px;
  word-break: break-all;
}

.stats {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  border-top: 1px solid var(--border);
  padding-top: 18px;
}

.stat {
  display: block;
  margin-top: 4px;
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.products {
  margin-top: 36px;
}

.tabs {
  display: inline-flex;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
  background: var(--cream-light);
}

.tab {
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
}

.tab[aria-selected='true'] {
  background: var(--ink);
  color: var(--cream-light);
}

.grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.product {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--cream-light);
  color: var(--text-primary);
  padding: 20px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.product:hover {
  border-color: var(--ink);
  transform: translateY(-1px);
}

.product-title {
  font-size: 20px;
  font-weight: 700;
}

.product-subtitle {
  color: var(--r-success);
  font-size: 13px;
  font-weight: 600;
}

.product-price {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 600;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.45);
}

.dialog {
  position: relative;
  width: 100%;
  max-width: 400px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  border-radius: 14px;
  background: var(--cream-light);
  color: var(--text-primary);
  padding: 24px;
}

.close {
  position: absolute;
  top: 12px;
  right: 14px;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.detail {
  margin: 18px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.detail dt {
  color: var(--text-secondary);
  font-size: 14px;
}

.detail dd {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}

.amount {
  font-size: 20px !important;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.methods {
  margin-top: 18px;
  display: flex;
  gap: 10px;
}

.method {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  cursor: pointer;
}

.method[aria-checked='true'] {
  border-color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--ink);
}

.qr {
  margin: 18px auto 0;
  width: 220px;
  padding: 10px;
  border-radius: 10px;
  background: #fff;
}

.qr-small {
  width: 180px;
}

.qr :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.actions {
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .recharge {
    padding-top: 32px;
  }

  .recharge-head h1 {
    font-size: 28px;
  }

  .card {
    padding: 18px;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .product {
    padding: 16px;
  }

  .product-title {
    font-size: 17px;
  }

  .actions .btn {
    flex: 1;
  }
}
</style>
