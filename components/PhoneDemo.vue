<script setup lang="ts">
// Animated replica of a desktop conversation opened on the Android app:
// the chat streams in live from the computer, a tool call stops for
// approval (RemoteRunApprovalBar above the composer), the user taps
// "允许" on the phone and the run continues. Strings mirror the Android
// string resources; colors follow AppNeutralPalette (light canvas #EFEFEF).

const { locale } = useDocusI18n()
const runtimeConfig = useRuntimeConfig()
const isZh = computed(() => locale.value !== 'en')

const baseURL = runtimeConfig.app.baseURL || '/'
const logoSrc = `${baseURL.endsWith('/') ? baseURL : `${baseURL}/`}logo.png`

const copy = computed(() => isZh.value ? {
  label: 'BotHub 安卓端演示：在手机上查看电脑上正在进行的对话，并批准它运行测试',
  bot: '工作助理',
  prompt: '把 shop 项目里支付回调的 bug 修好，测试跑通再告诉我',
  firstSummary: '读取了 3 个文件、编辑了 2 个文件 · 48秒',
  firstReply: '问题出在回调没有校验时间戳，旧请求会被重复入账。已经改好了，接下来跑一遍测试。',
  approvalTitle: '电脑上的任务在等你批准',
  deny: '拒绝',
  allow: '允许',
  running: '正在运行命令…',
  runningTitle: '· 跑一遍测试',
  secondSummary: '运行了 1 条命令 · 8秒',
  secondReply: '42 个测试全部通过，改动在 2 个文件里，回到电脑前就能验收。',
  placeholder: '输入消息…',
} : {
  label: 'BotHub Android demo: following a conversation running on the desktop and approving a test run from the phone',
  bot: 'Work Assistant',
  prompt: 'Fix the payment callback bug in the shop project and tell me when tests pass',
  firstSummary: 'Read 3 files, edited 2 files · 48s',
  firstReply: 'The callback never checked the timestamp, so replayed requests were booked twice. Fixed. Running the tests next.',
  approvalTitle: 'A task on your computer needs approval',
  deny: 'Deny',
  allow: 'Allow',
  running: 'Running commands…',
  runningTitle: '· Run the test suite',
  secondSummary: 'Ran 1 command · 8s',
  secondReply: 'All 42 tests pass. The fix touches 2 files and is ready for review when you\'re back.',
  placeholder: 'Ask anything',
})

const ARGS = ['command: npm test', 'cwd: ~/shop']

const initialState = () => ({ first: 0, ask: false, pressed: false, run: false, done: false, second: 0 })
const state = reactive(initialState())

const firstLength = computed(() => Array.from(copy.value.firstReply).length)
const secondLength = computed(() => Array.from(copy.value.secondReply).length)
const firstText = computed(() => Array.from(copy.value.firstReply).slice(0, state.first).join(''))
const secondText = computed(() => Array.from(copy.value.secondReply).slice(0, state.second).join(''))
const busy = computed(() => (state.first < firstLength.value) || state.ask || (state.run && state.second < secondLength.value))

const root = ref<HTMLElement | null>(null)
let alive = false
let visible = true
let timer: ReturnType<typeof setTimeout> | undefined
let resume: (() => void) | undefined
const CANCEL = Symbol('cancel')

const wait = async (ms: number) => {
  if (!alive) throw CANCEL
  await new Promise<void>((resolve) => {
    timer = setTimeout(resolve, ms)
  })
  while (alive && !visible) {
    await new Promise<void>((resolve) => {
      resume = resolve
    })
  }
  if (!alive) throw CANCEL
}

const stream = async (key: 'first' | 'second', length: number) => {
  while (state[key] < length) {
    state[key] = Math.min(length, state[key] + (isZh.value ? 1 : 3))
    await wait(38)
  }
}

const play = async () => {
  try {
    while (alive) {
      Object.assign(state, initialState())
      await wait(900)
      await stream('first', firstLength.value)
      await wait(700)
      state.ask = true
      await wait(2300)
      state.pressed = true
      await wait(260)
      state.ask = false
      state.pressed = false
      state.run = true
      await wait(2200)
      state.done = true
      await wait(350)
      await stream('second', secondLength.value)
      await wait(3800)
    }
  }
  catch (error) {
    if (error !== CANCEL) throw error
  }
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Object.assign(state, { first: firstLength.value, run: true, done: true, second: secondLength.value })
    return
  }
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible) resume?.()
  })
  if (root.value) observer.observe(root.value)
  alive = true
  void play()
})

onBeforeUnmount(() => {
  alive = false
  clearTimeout(timer)
  resume?.()
  observer?.disconnect()
})

watch(locale, () => {
  if (!alive) Object.assign(state, { first: firstLength.value, run: true, done: true, second: secondLength.value })
})
</script>

<template>
  <div ref="root" class="ph" role="img" :aria-label="copy.label">
    <div class="ph-device" aria-hidden="true">
      <div class="ph-status"><span>9:41</span><span class="ph-status-icons"><i /><i /></span></div>

      <!-- 顶栏：返回 · Bot 胶囊 · 上下文环 + 更多 -->
      <div class="ph-topbar">
        <span class="ph-circle">
          <svg viewBox="0 0 960 960"><path fill="currentColor" d="m313,520 l224,224 -57,56 -320,-320 320,-320 57,56 -224,224h487v80L313,520Z" /></svg>
        </span>
        <span class="ph-bot">
          <img :src="logoSrc" alt="">
          <strong>{{ copy.bot }}</strong>
        </span>
        <span class="ph-segment">
          <svg viewBox="0 0 20 20" class="ph-ring"><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="7" /></svg>
          <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8" fill="currentColor" /><circle cx="12" cy="12" r="1.8" fill="currentColor" /><circle cx="19" cy="12" r="1.8" fill="currentColor" /></svg>
        </span>
      </div>

      <!-- 对话：从电脑实时同步过来 -->
      <div class="ph-thread">
        <div class="ph-column">
          <div class="ph-user">{{ copy.prompt }}</div>
          <p class="ph-activity">{{ copy.firstSummary }}<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" /></svg></p>
          <p v-if="state.first > 0" class="ph-reply">{{ firstText }}</p>
          <p v-if="state.run && !state.done" class="ph-activity"><span class="ph-shimmer">{{ copy.running }}</span><small>{{ copy.runningTitle }}</small></p>
          <p v-else-if="state.done" class="ph-activity">{{ copy.secondSummary }}<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" /></svg></p>
          <p v-if="state.second > 0" class="ph-reply">{{ secondText }}</p>
        </div>
      </div>

      <!-- 输入框上方的审批卡 -->
      <div class="ph-approval" :data-show="state.ask || undefined">
        <div class="ph-approval-card">
          <p class="ph-approval-head"><strong>{{ copy.approvalTitle }}</strong><code>shell</code></p>
          <div class="ph-args"><code v-for="arg in ARGS" :key="arg">{{ arg }}</code></div>
          <div class="ph-actions">
            <span class="ph-deny">{{ copy.deny }}</span>
            <span class="ph-allow" :data-pressed="state.pressed || undefined">{{ copy.allow }}</span>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="ph-composer">
        <p>{{ copy.placeholder }}</p>
        <div class="ph-tools">
          <span class="ph-plus"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg></span>
          <span class="ph-spacer" />
          <span class="ph-model">gpt-5.5</span>
          <span class="ph-send" :data-busy="busy || undefined">
            <svg v-if="busy" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>
            <svg v-else viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ph {
  --ph-canvas: #efefef;
  --ph-control: #ffffff;
  --ph-raised: #e4e4e4;
  --ph-text: #0d0d0d;
  --ph-user-text: #2e2e2e;
  --ph-muted: #555555;
  --ph-outline: #dcdcdc;
  --ph-primary: #0d0d0d;
  --ph-on-primary: #ffffff;
  --ph-shadow: 0 1px 2px rgb(0 0 0 / 8%), 0 4px 12px -6px rgb(0 0 0 / 18%);

  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "PingFang SC", "Microsoft YaHei", sans-serif !important;
}

.ph * {
  font-family: inherit !important;
}

:global(.dark .ph) {
  --ph-canvas: #161616;
  --ph-control: #262626;
  --ph-raised: #2e2e2e;
  --ph-text: #ececec;
  --ph-user-text: #e5e5e5;
  --ph-muted: #a0a0a0;
  --ph-outline: #3a3a3a;
  --ph-primary: #ececec;
  --ph-on-primary: #111111;
  --ph-shadow: none;
}

.ph-device {
  position: relative;
  display: flex;
  width: 310px;
  height: 600px;
  flex-direction: column;
  overflow: hidden;
  padding: 10px 0 0;
  border: 9px solid #111;
  border-radius: 46px;
  background: var(--ph-canvas);
  box-shadow: 0 50px 90px -40px rgb(40 30 20 / 45%), 0 18px 36px -18px rgb(40 30 20 / 25%);
  color: var(--ph-text);
}

.ph-status {
  display: flex;
  justify-content: space-between;
  padding: 2px 24px 4px;
  font-size: 12px;
  font-weight: 600;
}

.ph-status-icons {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.ph-status-icons i {
  width: 14px;
  height: 9px;
  border-radius: 2px;
  background: var(--ph-text);
}

.ph-status-icons i:first-child {
  width: 12px;
  border-radius: 1px 1px 6px 6px;
  opacity: 0.8;
}

/* 顶栏：44dp 白色控件 + 阴影 */
.ph-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px 10px;
}

.ph-circle,
.ph-bot,
.ph-segment {
  display: inline-flex;
  height: 36px;
  align-items: center;
  border-radius: 18px;
  background: var(--ph-control);
  box-shadow: var(--ph-shadow);
}

.ph-circle {
  width: 36px;
  flex: none;
  justify-content: center;
}

.ph-circle svg {
  width: 18px;
  height: 18px;
}

.ph-bot {
  min-width: 0;
  gap: 7px;
  padding: 0 13px 0 5px;
}

.ph-bot img {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
}

.ph-bot strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ph-segment {
  flex: none;
  gap: 8px;
  padding: 0 10px;
}

.ph-segment svg {
  width: 17px;
  height: 17px;
}

.ph-ring {
  fill: none;
  stroke-width: 2.4;
  transform: rotate(-90deg);
}

.ph-ring circle:first-child {
  stroke: color-mix(in srgb, var(--ph-text) 16%, transparent);
}

.ph-ring circle:last-child {
  stroke: var(--ph-muted);
  stroke-dasharray: 44;
  stroke-dashoffset: 27;
  stroke-linecap: butt;
}

/* 对话 */
.ph-thread {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  padding: 0 16px 8px;
}

.ph-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ph-user {
  align-self: flex-end;
  max-width: 86%;
  padding: 8px 13px;
  border-radius: 18px 5px 18px 18px;
  background: var(--ph-raised);
  color: var(--ph-user-text);
  font-size: 13px;
  line-height: 1.55;
}

.ph-activity {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  margin: 0 !important;
  color: var(--ph-muted) !important;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  animation: ph-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ph-activity small {
  overflow: hidden;
  color: var(--ph-muted);
  font-size: 12.5px;
  font-weight: 400;
  opacity: 0.75;
  text-overflow: ellipsis;
}

.ph-activity svg {
  width: 14px;
  height: 14px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  opacity: 0.6;
}

.ph-shimmer {
  background: linear-gradient(90deg, var(--ph-muted) 0%, var(--ph-muted) 35%, var(--ph-text) 50%, var(--ph-muted) 65%, var(--ph-muted) 100%);
  background-size: 250% 100%;
  background-clip: text;
  color: transparent;
  animation: ph-shimmer 1.4s linear infinite;
}

.ph-reply {
  margin: 0 !important;
  color: var(--ph-text) !important;
  font-size: 13px;
  line-height: 1.65;
}

/* 审批卡：白底、12dp 圆角、1dp 描边 */
.ph-approval {
  display: grid;
  grid-template-rows: 0fr;
  padding: 0 10px;
  opacity: 0;
  transform: translateY(10px);
  transition: grid-template-rows 360ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 260ms ease, transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ph-approval[data-show] {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: none;
}

.ph-approval-card {
  display: grid;
  min-height: 0;
  gap: 8px;
  overflow: hidden;
  margin: 0 0 6px;
  padding: 11px 12px 10px;
  border: 1px solid var(--ph-outline);
  border-radius: 12px;
  background: var(--ph-control);
}

.ph-approval:not([data-show]) .ph-approval-card {
  padding-block: 0;
  margin: 0;
  border-width: 0;
}

.ph-approval-head {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin: 0 !important;
  white-space: nowrap;
}

.ph-approval-head strong {
  color: var(--ph-primary);
  font-size: 13px;
  font-weight: 600;
}

.ph-approval code,
.ph-args code {
  padding: 0 !important;
  border: 0 !important;
  background: none !important;
  font-family: ui-monospace, "SF Mono", Menlo, monospace !important;
}

.ph-approval-head code {
  color: var(--ph-muted) !important;
  font-size: 12px;
}

.ph-args {
  display: grid;
  gap: 2px;
  padding: 7px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ph-text) 4%, transparent);
}

.ph-args code {
  color: var(--ph-text) !important;
  font-size: 11.5px;
}

.ph-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.ph-deny,
.ph-allow {
  display: inline-grid;
  height: 30px;
  place-items: center;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
}

.ph-allow {
  padding: 0 16px;
  background: var(--ph-primary);
  color: var(--ph-on-primary);
  font-weight: 600;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.ph-allow[data-pressed] {
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--ph-primary) 16%, transparent);
  transform: scale(0.94);
}

/* 输入框：白色、24dp 圆角 */
.ph-composer {
  display: grid;
  gap: 10px;
  margin: 0 10px 14px;
  padding: 12px 10px 8px 14px;
  border-radius: 22px;
  background: var(--ph-control);
  box-shadow: var(--ph-shadow);
}

.ph-composer p {
  margin: 0 !important;
  color: var(--ph-muted) !important;
  font-size: 13px;
}

.ph-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ph-spacer {
  flex: 1;
}

.ph-plus,
.ph-send {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
}

.ph-plus {
  margin-left: -4px;
  color: var(--ph-muted);
}

.ph-plus svg,
.ph-send svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.ph-model {
  padding: 0 6px;
  font-size: 12.5px;
  font-weight: 500;
}

.ph-send {
  background: var(--ph-primary);
  color: var(--ph-on-primary);
}

.ph-send[data-busy] svg {
  width: 13px;
  height: 13px;
  fill: currentColor;
  stroke: none;
}

@keyframes ph-in {
  from { opacity: 0; transform: translateY(4px); }
}

@keyframes ph-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -150% 0; }
}

@media (max-width: 420px) {
  .ph-device {
    width: 280px;
    height: 570px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ph-activity,
  .ph-shimmer {
    animation: none;
  }
}
</style>
