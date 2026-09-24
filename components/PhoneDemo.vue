<script setup lang="ts">
// Animated replica of the Android remote terminal as it ships today:
// top bar (back · session pill · new/screen capsule), the terminal in the
// app's light palette, and the rounded bottom panel with the command input
// and the TUI key row. A Codex session on the desktop asks for approval; the
// user types "y" from the phone, tests pass, the task completes.
// Icon paths are copied from the Android app's drawables.

const { locale } = useDocusI18n()
const isZh = computed(() => locale.value !== 'en')

const copy = computed(() => isZh.value ? {
  label: 'BotHub 安卓端演示：在手机上用远程终端继续电脑上的 Codex 任务，并批准它运行测试',
  placeholder: '输入命令后回车发送…',
  task: '修复结账页的支付回调',
  lines: ['读取 app/checkout/callback.ts', '编辑 2 个文件 (+18 −6)'],
  ask: '允许运行 npm test？',
  askHint: '[y] 允许   [n] 拒绝',
  approved: '已允许',
  result: ['npm test  42 passed', '任务完成，等你验收'],
} : {
  label: 'BotHub Android demo: continuing a Codex task on the desktop from the phone terminal and approving a test run',
  placeholder: 'Type command, press enter to send…',
  task: 'Fix the checkout payment callback',
  lines: ['Read app/checkout/callback.ts', 'Edited 2 files (+18 −6)'],
  ask: 'Allow running npm test?',
  askHint: '[y] allow   [n] deny',
  approved: 'Allowed',
  result: ['npm test  42 passed', 'Done, ready for review'],
})

const KEYS = ['Esc', 'Tab', 'Ctrl', '^C', '←', '↑', '↓', '→', '|', '-']

const state = reactive({ lines: 0, ask: false, typed: false, sent: false, result: 0 })

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

const play = async () => {
  try {
    while (alive) {
      Object.assign(state, { lines: 0, ask: false, typed: false, sent: false, result: 0 })
      await wait(800)
      state.lines = 1
      await wait(700)
      state.lines = 2
      await wait(700)
      state.ask = true
      await wait(1300)
      state.typed = true
      await wait(700)
      state.typed = false
      state.sent = true
      await wait(700)
      state.result = 1
      await wait(700)
      state.result = 2
      await wait(3600)
    }
  }
  catch (error) {
    if (error !== CANCEL) throw error
  }
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Object.assign(state, { lines: 2, ask: true, sent: true, result: 2 })
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
</script>

<template>
  <div ref="root" class="ph" role="img" :aria-label="copy.label">
    <div class="ph-device" aria-hidden="true">
      <div class="ph-status"><span>9:41</span><span class="ph-status-icons"><i /><i /></span></div>

      <!-- 顶栏：返回 · 会话胶囊 · 新建 / 切到屏幕 -->
      <div class="ph-topbar">
        <span class="ph-circle">
          <svg viewBox="0 0 960 960"><path fill="currentColor" d="m313,520 l224,224 -57,56 -320,-320 320,-320 57,56 -224,224h487v80L313,520Z" /></svg>
        </span>
        <span class="ph-session">
          <b />
          <strong>MacBook Pro</strong>
          <small>· 2</small>
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.59L12,13.17l4.59,-4.58L18,10l-6,6 -6,-6z" /></svg>
        </span>
        <span class="ph-segment">
          <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12,5v14M5,12h14" /></svg>
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M1,21v-2h22v2zM4,18q-0.825,0 -1.412,-0.587T2,16V5q0,-0.825 0.588,-1.412T4,3h16q0.825,0 1.413,0.588T22,5v11q0,0.825 -0.587,1.413T20,18zM4,16h16V5H4zM4,16V5z" /></svg>
        </span>
      </div>

      <!-- 终端 -->
      <div class="ph-term">
        <p><em>~/shop</em> $ codex</p>
        <p class="ph-prompt"><i>›</i> {{ copy.task }}</p>
        <p v-for="line in copy.lines.slice(0, state.lines)" :key="line" class="ph-muted">• {{ line }}</p>
        <div v-if="state.ask" class="ph-ask">
          <p>{{ copy.ask }}</p>
          <p v-if="!state.sent" class="ph-muted">{{ copy.askHint }}<span class="ph-caret" /></p>
          <p v-else class="ph-ok">y · ✓ {{ copy.approved }}</p>
        </div>
        <p v-for="line in copy.result.slice(0, state.result)" :key="line" class="ph-ok">✓ {{ line }}</p>
      </div>

      <!-- 底部面板：命令输入框 + 终端按键行 -->
      <div class="ph-panel">
        <div class="ph-input" :data-typed="state.typed || undefined">
          <span v-if="state.typed">y<span class="ph-caret" /></span>
          <span v-else class="ph-placeholder">{{ copy.placeholder }}</span>
        </div>
        <div class="ph-keys">
          <span v-for="key in KEYS" :key="key">{{ key }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ph {
  --ph-bg: #fbfbfa;
  --ph-control: #ffffff;
  --ph-key: #f1efed;
  --ph-text: #1d1a18;
  --ph-muted: #716e6c;
  --ph-line: #e7e4e1;
  --ph-accent: #795a47;
  --ph-ok: #1f7a4d;
  --ph-shadow: 0 1px 2px rgb(40 30 20 / 8%), 0 4px 12px -6px rgb(40 30 20 / 18%);

  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "PingFang SC", "Microsoft YaHei", sans-serif !important;
}

.ph * {
  font-family: inherit !important;
}

:global(.dark .ph) {
  --ph-bg: #201f1e;
  --ph-control: #2d2b2a;
  --ph-key: #34322f;
  --ph-text: #e6e4e2;
  --ph-muted: #9a9591;
  --ph-line: #393734;
  --ph-accent: #cca87f;
  --ph-ok: #72c093;
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
  background: var(--ph-bg);
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

/* 顶栏：44dp 圆钮 + 同高胶囊，白色控件表面 */
.ph-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 10px;
}

.ph-circle,
.ph-session,
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

.ph-circle svg,
.ph-segment svg {
  width: 18px;
  height: 18px;
}

.ph-session {
  min-width: 0;
  flex: 1;
  gap: 5px;
  padding: 0 6px 0 11px;
  font-size: 13px;
  white-space: nowrap;
}

.ph-session b {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--ph-ok);
}

.ph-session strong {
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ph-session small {
  flex: none;
  color: var(--ph-muted);
  font-size: 13px;
}

.ph-session svg {
  flex: none;
  width: 17px;
  height: 17px;
  margin-left: auto;
  color: var(--ph-muted);
}

.ph-segment {
  flex: none;
  gap: 2px;
  padding: 0 8px;
}

/* 终端：跟随 App 浅色主题 */
.ph-term {
  flex: 1;
  overflow: hidden;
  padding: 6px 16px;
  font-size: 11.5px;
  line-height: 1.7;
}

.ph-term,
.ph-term * {
  font-family: ui-monospace, "SF Mono", Menlo, "PingFang SC", monospace !important;
}

.ph-term p {
  margin: 0 !important;
  color: var(--ph-text) !important;
  font-size: inherit !important;
  line-height: inherit !important;
  animation: ph-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ph-term em {
  color: var(--ph-accent);
  font-style: normal;
}

.ph-prompt i {
  color: var(--ph-accent);
  font-style: normal;
}

.ph-term p.ph-muted {
  color: var(--ph-muted) !important;
}

.ph-term p.ph-ok {
  color: var(--ph-ok) !important;
}

.ph-ask {
  margin: 6px 0;
  padding: 6px 10px;
  border-left: 2px solid var(--ph-accent);
  background: color-mix(in srgb, var(--ph-accent) 7%, transparent);
  animation: ph-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ph-caret {
  display: inline-block;
  width: 1.5px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.2em;
  background: var(--ph-text);
  animation: ph-blink 1s steps(2, start) infinite;
}

/* 底部面板：顶部 24dp 圆角，输入框 + 按键行 */
.ph-panel {
  display: grid;
  gap: 6px;
  padding: 8px 8px 16px;
  border-radius: 22px 22px 0 0;
  background: var(--ph-control);
  box-shadow: 0 -6px 18px -12px rgb(40 30 20 / 25%);
}

.ph-input {
  display: flex;
  height: 36px;
  align-items: center;
  padding: 0 14px;
  border-radius: 18px;
  background: var(--ph-key);
  font-size: 13px;
  transition: box-shadow 200ms ease;
}

.ph-input[data-typed] {
  box-shadow: inset 0 0 0 1.5px var(--ph-accent);
}

.ph-placeholder {
  color: var(--ph-muted);
}

.ph-keys {
  display: flex;
  gap: 6px;
  overflow: hidden;
  mask-image: linear-gradient(to right, #000 85%, transparent);
}

.ph-keys span {
  display: grid;
  min-width: 34px;
  height: 30px;
  flex: none;
  place-items: center;
  padding: 0 9px;
  border-radius: 9px;
  background: var(--ph-key);
  font-size: 12px;
  font-weight: 500;
}

@keyframes ph-in {
  from { opacity: 0; transform: translateY(4px); }
}

@keyframes ph-blink {
  50% { opacity: 0; }
}

@media (max-width: 420px) {
  .ph-device {
    width: 280px;
    height: 570px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ph-term p,
  .ph-ask,
  .ph-caret {
    animation: none;
  }
}
</style>
