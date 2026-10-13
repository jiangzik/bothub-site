<script setup lang="ts">
import { BothubApiError } from '~/composables/useBothubAccount'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en', showTitle?: boolean }>(), { lang: 'zh', showTitle: true })
const authMode = defineModel<'login' | 'register' | 'reset'>('mode', { default: 'login' })
const account = useBothubAccount()
const zh = computed(() => props.lang !== 'en')
const copy = computed(() => zh.value
  ? {
      loginTitle: '登录 BotHub', registerTitle: '注册 BotHub', resetTitle: '设置新密码',
      loginHint: '与 App 共用同一个 BotHub 账号。',
      registerHint: '验证邮箱并设置密码，注册后自动登录。',
      resetHint: '通过 Google 或 Apple 登录的账号也可以在这里设置密码，之后就能用邮箱登录。',
      orEmail: '或使用邮箱登录', email: '邮箱', password: '密码', login: '登录', loggingIn: '登录中…',
      forgot: '忘记密码 / 还没设置过密码', register: '邮箱注册', registering: '注册中…',
      noAccount: '还没有账号？', googleHint: '首次使用 Google 登录将创建 BotHub 账号。',
      code: '验证码', sendCode: '发送验证码', resendIn: (s: number) => `${s} 秒后可重发`,
      registerCodeSent: '注册验证码已发送，请查收邮箱。', resetCodeSent: '如果这个邮箱已注册，验证码会发到邮箱里。',
      newPassword: '设置密码（8–128 位）', confirmPassword: '确认密码', invitationCode: '邀请码（选填）',
      resetSubmit: '设置并登录', backToLogin: '已有账号？返回登录',
      errInvalidEmail: '请输入有效的邮箱地址。', errPassword: '请输入密码。', errCode: '请输入 6 位验证码。',
      errNewPassword: '密码长度须为 8–128 位。', errConfirmPassword: '两次输入的密码不一致。', errInvitationCode: '邀请码长度须为 4–80 位。',
    }
  : {
      loginTitle: 'Sign in to BotHub', registerTitle: 'Create a BotHub account', resetTitle: 'Set a new password',
      loginHint: 'Use the same BotHub account as the app.',
      registerHint: 'Verify your email and set a password. You will be signed in after registration.',
      resetHint: 'Accounts that sign in with Google or Apple can set a password here to sign in with email.',
      orEmail: 'Or sign in with email', email: 'Email', password: 'Password', login: 'Sign in', loggingIn: 'Signing in…',
      forgot: 'Forgot password / never set one', register: 'Sign up with email', registering: 'Creating account…',
      noAccount: 'No account yet?', googleHint: 'Signing in with Google for the first time creates a BotHub account.',
      code: 'Verification code', sendCode: 'Send code', resendIn: (s: number) => `Resend in ${s}s`,
      registerCodeSent: 'Registration code sent. Check your email.', resetCodeSent: 'If this email is registered, a code has been sent.',
      newPassword: 'Set password (8–128 characters)', confirmPassword: 'Confirm password', invitationCode: 'Invitation code (optional)',
      resetSubmit: 'Set password and sign in', backToLogin: 'Already have an account? Sign in',
      errInvalidEmail: 'Please enter a valid email address.', errPassword: 'Please enter your password.', errCode: 'Please enter the 6-digit code.',
      errNewPassword: 'Password must be 8–128 characters.', errConfirmPassword: 'Passwords do not match.', errInvitationCode: 'Invitation code must be 4–80 characters.',
    })

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const describeError = useBothubErrorMessage(zh)
const title = computed(() => authMode.value === 'login' ? copy.value.loginTitle : authMode.value === 'register' ? copy.value.registerTitle : copy.value.resetTitle)
const email = ref('')
const password = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const invitationCode = ref('')
const authBusy = ref(false)
const authMessage = ref('')
const authMessageTone = ref<'error' | 'info'>('error')
// Server codes and resend limits are scoped to the recipient AND purpose.
const codePurpose = computed(() => authMode.value === 'register' ? 'register' : 'reset_password')
const codeDeadlines = ref<Record<string, number>>({})
const clock = ref(Date.now())
const codeKey = (recipient: string, purpose: string) => `${purpose}:${recipient}`
const cooldown = computed(() => Math.max(0, Math.ceil(((codeDeadlines.value[codeKey(email.value.trim().toLowerCase(), codePurpose.value)] ?? 0) - clock.value) / 1000)))
let cooldownTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => { cooldownTimer = setInterval(() => { clock.value = Date.now() }, 1000) })
onBeforeUnmount(() => { clearInterval(cooldownTimer) })

function normalizedEmail(): string | null {
  const value = email.value.trim().toLowerCase()
  return EMAIL_REGEX.test(value) ? value : null
}
function setAuthMessage(text: string, tone: 'error' | 'info' = 'error'): void {
  authMessage.value = text
  authMessageTone.value = tone
}
function setMode(mode: 'login' | 'register' | 'reset'): void {
  if (!authBusy.value) authMode.value = mode
}
watch(authMode, () => {
  password.value = newPassword.value = confirmPassword.value = verificationCode.value = ''
  setAuthMessage('')
}, { flush: 'sync' })
watch(email, () => { verificationCode.value = ''; setAuthMessage('') })

async function handleLogin(): Promise<void> {
  if (authBusy.value) return
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!password.value) return setAuthMessage(copy.value.errPassword)
  authBusy.value = true
  setAuthMessage('')
  try { await account.login(value, password.value); password.value = '' }
  catch (error) { setAuthMessage(describeError(error, 'login')) }
  finally { authBusy.value = false }
}
async function handleGoogleLogin(idToken: string, nonce: string): Promise<void> {
  if (authBusy.value) return
  authBusy.value = true
  setAuthMessage('')
  try { await account.loginWithGoogle(idToken, nonce); password.value = '' }
  catch (error) { setAuthMessage(describeError(error, 'google')) }
  finally { authBusy.value = false }
}
function normalizedInvitation(): string | undefined {
  return authMode.value === 'register' ? invitationCode.value.trim() || undefined : undefined
}
function validInvitation(): boolean {
  const code = normalizedInvitation()
  return !code || (code.length >= 4 && code.length <= 80)
}
function startCooldown(recipient: string, purpose: string, seconds: number): void {
  clock.value = Date.now()
  codeDeadlines.value[codeKey(recipient, purpose)] = clock.value + seconds * 1000
}
async function handleSendCode(): Promise<void> {
  if (authBusy.value || cooldown.value > 0) return
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!validInvitation()) return setAuthMessage(copy.value.errInvitationCode)
  const purpose = codePurpose.value
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.sendEmailCode(value, purpose, normalizedInvitation())
    startCooldown(value, purpose, 60)
    setAuthMessage(purpose === 'register' ? copy.value.registerCodeSent : copy.value.resetCodeSent, 'info')
  }
  catch (error) {
    if (error instanceof BothubApiError && error.status === 429) {
      const seconds = (error.detail as { retryAfterSec?: unknown } | undefined)?.retryAfterSec
      if (typeof seconds === 'number' && Number.isFinite(seconds) && seconds > 0) startCooldown(value, purpose, seconds)
    }
    setAuthMessage(describeError(error))
  }
  finally { authBusy.value = false }
}
async function handleEmailVerification(): Promise<void> {
  if (authBusy.value) return
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!/^\d{6}$/.test(verificationCode.value.trim())) return setAuthMessage(copy.value.errCode)
  if (newPassword.value.length < 8 || newPassword.value.length > 128) return setAuthMessage(copy.value.errNewPassword)
  if (authMode.value === 'register' && newPassword.value !== confirmPassword.value) return setAuthMessage(copy.value.errConfirmPassword)
  if (!validInvitation()) return setAuthMessage(copy.value.errInvitationCode)
  authBusy.value = true
  setAuthMessage('')
  try {
    if (authMode.value === 'register') await account.register(value, newPassword.value, verificationCode.value.trim(), normalizedInvitation())
    else await account.resetPassword(value, verificationCode.value.trim(), newPassword.value)
    verificationCode.value = newPassword.value = confirmPassword.value = ''
  }
  catch (error) { setAuthMessage(describeError(error, authMode.value === 'register' ? 'register' : 'other')) }
  finally { authBusy.value = false }
}
</script>

<template>
  <div class="account-auth-form">
    <h2 v-if="props.showTitle">{{ title }}</h2>
    <template v-if="authMode === 'login'">
      <p class="muted">{{ copy.loginHint }}</p>
      <ClientOnly><GoogleSignInButton :lang="zh ? 'zh' : 'en'" :disabled="authBusy" @credential="handleGoogleLogin" /></ClientOnly>
      <div class="auth-divider">{{ copy.orEmail }}</div>
      <form class="form" @submit.prevent="handleLogin">
        <label class="field">
          <span>{{ copy.email }}</span>
          <input v-model="email" :disabled="authBusy" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com">
        </label>
        <label class="field">
          <span>{{ copy.password }}</span>
          <input v-model="password" :disabled="authBusy" type="password" autocomplete="current-password" maxlength="128">
        </label>
        <button class="btn btn-primary" type="submit" :disabled="authBusy">{{ authBusy ? copy.loggingIn : copy.login }}</button>
      </form>
      <div class="auth-links">
        <span>{{ copy.noAccount }} <button type="button" class="link" :disabled="authBusy" @click="setMode('register')">{{ copy.register }}</button></span>
        <button type="button" class="link" :disabled="authBusy" @click="setMode('reset')">{{ copy.forgot }}</button>
        <p class="muted">{{ copy.googleHint }}</p>
      </div>
    </template>
    <template v-else>
      <p class="muted">{{ authMode === 'register' ? copy.registerHint : copy.resetHint }}</p>
      <form class="form" @submit.prevent="handleEmailVerification">
        <label class="field">
          <span>{{ copy.email }}</span>
          <input v-model="email" :disabled="authBusy" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com">
        </label>
        <div class="field-row">
          <label class="field">
            <span>{{ copy.code }}</span>
            <input v-model="verificationCode" :disabled="authBusy" type="text" maxlength="6" inputmode="numeric" autocomplete="one-time-code">
          </label>
          <button type="button" class="btn btn-secondary" :disabled="authBusy || cooldown > 0" @click="handleSendCode">{{ cooldown > 0 ? copy.resendIn(cooldown) : copy.sendCode }}</button>
        </div>
        <label class="field">
          <span>{{ copy.newPassword }}</span>
          <input v-model="newPassword" :disabled="authBusy" type="password" autocomplete="new-password" maxlength="128">
        </label>
        <template v-if="authMode === 'register'">
          <label class="field">
            <span>{{ copy.confirmPassword }}</span>
            <input v-model="confirmPassword" :disabled="authBusy" type="password" autocomplete="new-password" maxlength="128">
          </label>
          <label class="field">
            <span>{{ copy.invitationCode }}</span>
            <input v-model="invitationCode" :disabled="authBusy" type="text" autocomplete="off" maxlength="80">
          </label>
        </template>
        <button class="btn btn-primary" type="submit" :disabled="authBusy">{{ authMode === 'register' ? (authBusy ? copy.registering : copy.register) : copy.resetSubmit }}</button>
      </form>
      <div class="auth-links"><button type="button" class="link" :disabled="authBusy" @click="setMode('login')">{{ copy.backToLogin }}</button></div>
    </template>
    <p v-if="authMessage" role="alert" class="message" :data-tone="authMessageTone">{{ authMessage }}</p>
  </div>
</template>
<style scoped>
.account-auth-form { --r-error: #c0362c; --r-success: #2f7d4f; color: var(--text-primary); }
:global(.dark) .account-auth-form { --r-error: #ff8a80; --r-success: #7fd4a0; }
h2 { margin: 0; font-size: 20px; font-weight: 650; }
.muted {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}
.auth-divider { display: flex; align-items: center; gap: 12px; margin-top: 20px; color: var(--text-secondary); font-size: 12px; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
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
.actions .btn {
    flex: 1;
  }
</style>
