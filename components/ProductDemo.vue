<script setup lang="ts">
// A hand-drawn, animated replica of the BotHub desktop chat window
// (sidebar, bot switcher, tool-call timeline, composer). No screenshots:
// every frame is HTML, so it stays crisp, themable and localized.

const { locale } = useDocusI18n()
const runtimeConfig = useRuntimeConfig()
const isZh = computed(() => locale.value !== 'en')

const baseURL = runtimeConfig.app.baseURL || '/'
const logoSrc = `${baseURL.endsWith('/') ? baseURL : `${baseURL}/`}logo.png`

const copy = computed(() => isZh.value ? {
  label: 'BotHub 桌面端演示：整理发票、生成表格并发送到飞书',
  nav: [
    { icon: 'i-lucide-search', label: '搜索' },
    { icon: 'i-lucide-star', label: '收藏' },
    { icon: 'i-lucide-folder', label: '工作区' },
    { icon: 'i-lucide-clock', label: '定时任务' },
  ],
  computer: '电脑',
  today: '今天',
  yesterday: '昨天',
  conversations: ['九月发票整理', '周报草稿', '竞品调研笔记'],
  older: ['翻译 README', '东京行程规划'],
  user: 'Jiang',
  bot: '工作助理',
  greeting: '今天能帮到你什么？',
  placeholder: '随便问点什么',
  prompt: '把「下载」里九月的发票整理成表格，发到飞书财务群',
  permission: '请求批准',
  running: '处理中',
  elapsed: '用时 14s',
  steps: [
    { icon: 'i-lucide-folder-search', title: '探索文件', detail: '~/Downloads · 找到 12 张发票' },
    { icon: 'i-lucide-file-text', title: '读取文件', detail: '发票_0903.pdf 等 12 个文件' },
    { icon: 'i-lucide-square-terminal', title: '运行命令', detail: 'python3 extract_invoices.py' },
    { icon: 'i-lucide-file-spreadsheet', title: '写入文件', detail: '~/Documents/九月发票汇总.xlsx' },
    { icon: 'i-lucide-send', title: '发送消息', detail: '飞书 · 财务群' },
  ],
  reply: '已整理 12 张发票，合计 ¥8,420.00，其中 3 张为增值税专票。汇总表已保存，并发到了飞书「财务群」。',
  file: { name: '九月发票汇总.xlsx', meta: '12 行 · 24 KB' },
  toastTag: '手机上收到',
  toastApp: '飞书 · 财务群',
  toastTime: '刚刚',
  toastBody: '工作助理：九月发票汇总.xlsx（12 张，合计 ¥8,420.00）',
} : {
  label: 'BotHub desktop demo: organizing invoices into a spreadsheet and sending it to Feishu',
  nav: [
    { icon: 'i-lucide-search', label: 'Search' },
    { icon: 'i-lucide-star', label: 'Starred' },
    { icon: 'i-lucide-folder', label: 'Workspaces' },
    { icon: 'i-lucide-clock', label: 'Schedules' },
  ],
  computer: 'Computer',
  today: 'Today',
  yesterday: 'Yesterday',
  conversations: ['September invoices', 'Weekly report', 'Competitor notes'],
  older: ['Translate README', 'Tokyo itinerary'],
  user: 'Jiang',
  bot: 'Work Assistant',
  greeting: 'How can I help today?',
  placeholder: 'Ask anything',
  prompt: 'Turn September invoices in Downloads into a sheet and send it to the finance group',
  permission: 'Ask first',
  running: 'Working',
  elapsed: 'Took 14s',
  steps: [
    { icon: 'i-lucide-folder-search', title: 'Explore files', detail: '~/Downloads · 12 invoices found' },
    { icon: 'i-lucide-file-text', title: 'Read files', detail: 'invoice_0903.pdf and 11 more' },
    { icon: 'i-lucide-square-terminal', title: 'Run command', detail: 'python3 extract_invoices.py' },
    { icon: 'i-lucide-file-spreadsheet', title: 'Write file', detail: '~/Documents/invoices-sep.xlsx' },
    { icon: 'i-lucide-send', title: 'Send message', detail: 'Feishu · Finance' },
  ],
  reply: 'Organized 12 invoices totaling ¥8,420.00, including 3 VAT special invoices. The sheet is saved and posted to the Finance group on Feishu.',
  file: { name: 'invoices-sep.xlsx', meta: '12 rows · 24 KB' },
  toastTag: 'On your phone',
  toastApp: 'Feishu · Finance',
  toastTime: 'now',
  toastBody: 'Work Assistant: invoices-sep.xlsx (12 invoices, ¥8,420.00 total)',
})

const state = reactive({
  typed: 0,
  sent: false,
  steps: 0,
  done: false,
  collapsed: false,
  reply: 0,
  file: false,
  toast: false,
  fading: false,
})

const running = computed(() => state.sent && !state.done)
const typedText = computed(() => Array.from(copy.value.prompt).slice(0, state.typed).join(''))
const replyText = computed(() => Array.from(copy.value.reply).slice(0, state.reply).join(''))

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

const reset = () => {
  Object.assign(state, { typed: 0, sent: false, steps: 0, done: false, collapsed: false, reply: 0, file: false, toast: false, fading: false })
}

const showFinalFrame = () => {
  Object.assign(state, {
    typed: 0,
    sent: true,
    steps: copy.value.steps.length,
    done: true,
    collapsed: true,
    reply: Array.from(copy.value.reply).length,
    file: true,
    toast: true,
    fading: false,
  })
}

const play = async () => {
  try {
    while (alive) {
      reset()
      await wait(900)
      const promptLength = Array.from(copy.value.prompt).length
      while (state.typed < promptLength) {
        state.typed += 1
        await wait(isZh.value ? 70 : 34)
      }
      await wait(450)
      state.sent = true
      state.typed = 0
      for (let i = 1; i <= copy.value.steps.length; i += 1) {
        await wait(i === 1 ? 500 : 780)
        state.steps = i
      }
      await wait(800)
      state.done = true
      await wait(450)
      state.collapsed = true
      await wait(350)
      const replyLength = Array.from(copy.value.reply).length
      while (state.reply < replyLength) {
        state.reply = Math.min(replyLength, state.reply + (isZh.value ? 1 : 3))
        await wait(32)
      }
      await wait(300)
      state.file = true
      await wait(700)
      state.toast = true
      await wait(4600)
      state.fading = true
      await wait(600)
    }
  }
  catch (error) {
    if (error !== CANCEL) throw error
  }
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFinalFrame()
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
  if (!alive) showFinalFrame()
})
</script>

<template>
  <div ref="root" class="pd" role="img" :aria-label="copy.label" :data-fading="state.fading || undefined">
    <div class="pd-window" aria-hidden="true">
      <div class="pd-titlebar">
        <span class="pd-lights"><i /><i /><i /></span>
        <span class="pd-title">BotHub</span>
      </div>

      <div class="pd-body">
        <aside class="pd-sidebar">
          <div class="pd-nav">
            <span v-for="item in copy.nav" :key="item.icon"><UIcon :name="item.icon" />{{ item.label }}</span>
          </div>
          <div class="pd-nav pd-nav-computer">
            <span><UIcon name="i-lucide-monitor" />{{ copy.computer }}<b /></span>
          </div>
          <p class="pd-group">{{ copy.today }}</p>
          <div class="pd-convs">
            <span v-for="(title, index) in copy.conversations" :key="title" :class="{ active: index === 0 }">
              <em>{{ title }}</em>
              <UIcon v-if="index === 0 && running" name="i-lucide-loader-circle" class="pd-spin" />
            </span>
          </div>
          <p class="pd-group">{{ copy.yesterday }}</p>
          <div class="pd-convs">
            <span v-for="title in copy.older" :key="title"><em>{{ title }}</em></span>
          </div>
          <div class="pd-account">
            <span class="pd-avatar">J</span>
            <strong>{{ copy.user }}</strong>
            <small>Pro</small>
            <UIcon name="i-lucide-chevron-up" />
          </div>
        </aside>

        <main class="pd-main">
          <div class="pd-topbar">
            <span class="pd-bot">
              <img :src="logoSrc" alt="">
              <strong>{{ copy.bot }}</strong>
              <UIcon name="i-lucide-chevron-down" />
            </span>
          </div>

          <div class="pd-thread">
            <p class="pd-greeting" :data-hidden="state.sent || undefined">{{ copy.greeting }}</p>

            <div v-if="state.sent" class="pd-column">
              <div class="pd-user">{{ copy.prompt }}</div>

              <div class="pd-work" :data-collapsed="state.collapsed || undefined">
                <p class="pd-work-head">
                  <span :class="{ 'pd-shimmer': running }">{{ state.done ? copy.elapsed : copy.running }}</span>
                  <UIcon name="i-lucide-chevron-down" />
                </p>
                <ol class="pd-steps">
                  <li v-for="(step, index) in copy.steps.slice(0, state.steps)" :key="step.icon">
                      <span class="pd-step-icon">
                        <UIcon v-if="!state.done && index === state.steps - 1" name="i-lucide-loader-circle" class="pd-spin" />
                        <UIcon v-else :name="step.icon" />
                      </span>
                      <strong>{{ step.title }}</strong>
                      <code>{{ step.detail }}</code>
                  </li>
                </ol>
              </div>

              <p v-if="state.reply > 0" class="pd-reply">{{ replyText }}<i v-if="state.reply < Array.from(copy.reply).length" class="pd-caret" /></p>

              <div v-if="state.file" class="pd-file">
                  <span class="pd-file-icon"><UIcon name="i-lucide-file-spreadsheet" /></span>
                  <span><strong>{{ copy.file.name }}</strong><small>{{ copy.file.meta }}</small></span>
                  <UIcon name="i-lucide-arrow-up-right" />
                </div>
            </div>
          </div>

          <div class="pd-composer">
            <p class="pd-input">
              <span v-if="state.typed > 0">{{ typedText }}<i class="pd-caret" /></span>
              <span v-else class="pd-placeholder">{{ copy.placeholder }}</span>
            </p>
            <div class="pd-tools">
              <span class="pd-icon-btn"><UIcon name="i-lucide-plus" /></span>
              <span class="pd-pill"><UIcon name="i-lucide-shield-check" />{{ copy.permission }}</span>
              <span class="pd-spacer" />
              <span class="pd-pill pd-model"><UIcon name="i-lucide-sparkles" />gpt-5.5<UIcon name="i-lucide-chevron-down" /></span>
              <span class="pd-send" :data-running="running || undefined">
                <UIcon :name="running ? 'i-lucide-square' : 'i-lucide-arrow-up'" />
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div class="pd-toast" :data-show="state.toast || undefined" aria-hidden="true">
      <p class="pd-toast-tag"><UIcon name="i-lucide-smartphone" />{{ copy.toastTag }}</p>
      <div class="pd-toast-card">
        <span class="pd-toast-app"><UIcon name="i-lucide-message-square" /></span>
        <div>
          <p><strong>{{ copy.toastApp }}</strong><small>{{ copy.toastTime }}</small></p>
          <span>{{ copy.toastBody }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pd {
  --pd-bg: #fbfbfa;
  --pd-surface: #fefdfd;
  --pd-gray: #f3f1f0;
  --pd-pill: #e9e7e6;
  --pd-text: #1d1a18;
  --pd-text2: #585553;
  --pd-text3: #7a7674;
  --pd-line: #e7e4e1;
  --pd-primary: #795a47;
  --pd-user: #e0d9d4;
  --pd-success: #276f49;
  --pd-shadow: 0 1px 0 rgb(40 30 20 / 3%), 0 40px 80px -32px rgb(40 30 20 / 32%), 0 16px 32px -20px rgb(40 30 20 / 20%);

  position: relative;
  container-type: inline-size;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
  transition: opacity 500ms ease;
}

.pd * {
  font-family: inherit !important;
}

.pd[data-fading] .pd-thread > *,
.pd[data-fading] .pd-toast {
  opacity: 0 !important;
  transition: opacity 500ms ease;
}

:global(.dark .pd) {
  --pd-bg: #201f1e;
  --pd-surface: #272625;
  --pd-gray: #2f2d2c;
  --pd-pill: #363432;
  --pd-text: #e6e4e2;
  --pd-text2: #b8b4b0;
  --pd-text3: #8f8b87;
  --pd-line: #393734;
  --pd-primary: #cca87f;
  --pd-user: #3d352e;
  --pd-success: #72c093;
  --pd-shadow: 0 40px 80px -32px rgb(0 0 0 / 70%);
}

.pd-window {
  overflow: hidden;
  border: 1px solid var(--pd-line);
  border-radius: 14px;
  background: var(--pd-bg);
  box-shadow: var(--pd-shadow);
  color: var(--pd-text);
  font-size: 12.5px;
  line-height: 1.5;
}

.pd-titlebar {
  position: relative;
  display: flex;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--pd-line);
}

.pd-lights {
  position: absolute;
  left: 14px;
  display: flex;
  gap: 7px;
}

.pd-lights i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ff5f57;
}

.pd-lights i:nth-child(2) { background: #febc2e; }
.pd-lights i:nth-child(3) { background: #28c840; }

.pd-title {
  color: var(--pd-text3);
  font-size: 12px;
  font-weight: 500;
}

.pd-body {
  display: grid;
  grid-template-columns: 172px minmax(0, 1fr);
  height: 452px;
}

/* Sidebar */
.pd-sidebar {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 10px 8px;
  border-right: 1px solid var(--pd-line);
}

.pd-nav {
  display: grid;
  gap: 1px;
}

.pd-nav span,
.pd-convs span {
  display: flex;
  min-height: 28px;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-radius: 7px;
  color: var(--pd-text);
  font-size: 12.5px;
}

.pd-nav :deep(svg),
.pd-nav :deep(.iconify) {
  width: 15px;
  height: 15px;
  color: var(--pd-text2);
}

.pd-nav-computer {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--pd-line);
}

.pd-nav-computer b {
  width: 6px;
  height: 6px;
  margin-left: auto;
  border-radius: 50%;
  background: var(--pd-success);
}

.pd-group {
  margin: 14px 8px 4px !important;
  color: var(--pd-text3);
  font-size: 11px;
  font-weight: 500;
}

.pd-convs {
  display: grid;
  gap: 1px;
}

.pd-convs span.active {
  background: var(--pd-gray);
}

.pd-convs em {
  overflow: hidden;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-convs .pd-spin {
  flex: none;
  width: 13px;
  height: 13px;
  margin-left: auto;
  color: var(--pd-text3);
}

.pd-account {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding: 8px 6px 2px;
  border-top: 1px solid var(--pd-line);
}

.pd-avatar {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: var(--pd-primary);
  color: var(--pd-bg);
  font-size: 11px;
  font-weight: 600;
}

.pd-account strong {
  font-size: 12.5px;
  font-weight: 500;
}

.pd-account small {
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--pd-pill);
  color: var(--pd-text2);
  font-size: 10px;
  font-weight: 600;
}

.pd-account > :last-child {
  width: 14px;
  height: 14px;
  margin-left: auto;
  color: var(--pd-text3);
}

/* Main column */
.pd-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  background: var(--pd-bg);
}

.pd-topbar {
  display: flex;
  height: 46px;
  flex: none;
  align-items: center;
  justify-content: center;
}

.pd-bot {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 5px;
  border-radius: 14px;
  background: var(--pd-gray);
}

.pd-bot img {
  width: 20px;
  height: 20px;
  border-radius: 6px;
}

.pd-bot strong {
  font-size: 12.5px;
  font-weight: 600;
}

.pd-bot > :last-child {
  width: 13px;
  height: 13px;
  color: var(--pd-text3);
}

.pd-thread {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  padding: 6px 22px 0;
}

.pd-greeting {
  position: absolute;
  inset: 0;
  display: grid;
  margin: 0 !important;
  place-items: center;
  color: var(--pd-text);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: opacity 250ms ease;
}

.pd-greeting[data-hidden] {
  opacity: 0;
}

.pd-column {
  display: flex;
  max-width: 460px;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
}

.pd-user {
  align-self: flex-end;
  max-width: 84%;
  padding: 7px 13px;
  border-radius: 16px;
  background: var(--pd-user);
  color: var(--pd-text);
  font-size: 12.5px;
  animation: pd-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pd-work-head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0 !important;
  color: var(--pd-text2);
  font-size: 12px;
}

.pd-work-head > :last-child {
  width: 13px;
  height: 13px;
  transition: transform 300ms ease;
}

.pd-work[data-collapsed] .pd-work-head > :last-child {
  transform: rotate(-90deg);
}

.pd-shimmer {
  background: linear-gradient(90deg, var(--pd-text3) 0%, var(--pd-text3) 35%, var(--pd-text) 50%, var(--pd-text3) 65%, var(--pd-text3) 100%);
  background-size: 250% 100%;
  background-clip: text;
  color: transparent;
  animation: pd-shimmer 1.6s linear infinite;
}

.pd-steps {
  position: relative;
  display: grid;
  max-height: 200px;
  margin: 8px 0 0 !important;
  padding: 0 !important;
  overflow: hidden;
  list-style: none;
  transition: max-height 420ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease, margin 300ms ease;
}

.pd-work[data-collapsed] .pd-steps {
  max-height: 0;
  margin-top: 0 !important;
  opacity: 0;
}

.pd-steps li {
  position: relative;
  display: grid;
  grid-template-columns: 20px auto minmax(0, 1fr);
  gap: 9px;
  align-items: center;
  min-height: 30px;
  margin: 0 !important;
  padding: 0 !important;
  animation: pd-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pd-steps li + li::before {
  position: absolute;
  top: -10px;
  left: 9.5px;
  width: 1px;
  height: 12px;
  background: var(--pd-line);
  content: "";
}

.pd-step-icon {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 6px;
  background: var(--pd-gray);
  color: var(--pd-text2);
}

.pd-step-icon :deep(svg),
.pd-step-icon :deep(.iconify) {
  width: 12px;
  height: 12px;
}

.pd-steps strong {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.pd-steps code {
  overflow: hidden;
  padding: 0 !important;
  border: 0 !important;
  background: none !important;
  color: var(--pd-text3) !important;
  font-family: ui-monospace, "SF Mono", Menlo, monospace !important;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-reply {
  margin: 0 !important;
  color: var(--pd-text) !important;
  font-size: 13px;
  line-height: 1.7;
}

.pd-file {
  display: flex;
  width: min(100%, 280px);
  align-items: center;
  gap: 10px;
  padding: 9px 12px 9px 9px;
  border: 1px solid var(--pd-line);
  border-radius: 12px;
  background: var(--pd-surface);
  animation: pd-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pd-file-icon {
  display: grid;
  width: 30px;
  height: 30px;
  flex: none;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--pd-success) 14%, transparent);
  color: var(--pd-success);
}

.pd-file > span:nth-child(2) {
  display: grid;
  min-width: 0;
}

.pd-file strong {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-file small {
  color: var(--pd-text3);
  font-size: 11px;
}

.pd-file > :last-child {
  width: 14px;
  height: 14px;
  margin-left: auto;
  color: var(--pd-text3);
}

/* Composer */
.pd-composer {
  display: grid;
  gap: 10px;
  margin: 10px 18px 16px;
  padding: 11px 12px 10px 14px;
  border: 1.5px solid var(--pd-line);
  border-radius: 20px;
  background: var(--pd-surface);
  box-shadow: 0 6px 20px -12px rgb(40 30 20 / 25%);
}

.pd-input {
  min-height: 21px;
  margin: 0 !important;
  overflow: hidden;
  color: var(--pd-text) !important;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-placeholder {
  color: var(--pd-text3);
}

.pd-caret {
  display: inline-block;
  width: 1.5px;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: -0.15em;
  background: var(--pd-primary);
  animation: pd-blink 1s steps(2, start) infinite;
}

.pd-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pd-spacer {
  flex: 1;
}

.pd-icon-btn,
.pd-pill {
  display: inline-flex;
  height: 26px;
  align-items: center;
  gap: 5px;
  border-radius: 13px;
  color: var(--pd-text2);
  font-size: 11.5px;
}

.pd-icon-btn {
  width: 26px;
  justify-content: center;
  border: 1px solid var(--pd-line);
}

.pd-pill {
  padding: 0 9px;
  background: var(--pd-gray);
}

.pd-tools :deep(svg),
.pd-tools :deep(.iconify) {
  width: 13px;
  height: 13px;
}

.pd-model {
  background: transparent;
  color: var(--pd-text);
  font-weight: 500;
}

.pd-send {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--pd-text);
  color: var(--pd-bg);
  transition: transform 200ms ease;
}

.pd-send[data-running] :deep(svg),
.pd-send[data-running] :deep(.iconify) {
  width: 10px;
  height: 10px;
}

/* Phone / IM notification */
.pd-toast {
  position: absolute;
  bottom: -26px;
  left: -28px;
  width: min(330px, 70%);
  opacity: 0;
  pointer-events: none;
  transform: translateY(18px) scale(0.96);
  transition: opacity 300ms ease, transform 300ms ease;
}

.pd-toast[data-show] {
  opacity: 1;
  transform: none;
  transition: opacity 420ms ease, transform 520ms cubic-bezier(0.2, 0.9, 0.25, 1.15);
}

.pd-toast-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 6px 4px !important;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--ink, #000);
  color: var(--bg-page, #fff) !important;
  font-size: 11px;
  font-weight: 500;
}

.pd-toast-tag :deep(svg),
.pd-toast-tag :deep(.iconify) {
  width: 12px;
  height: 12px;
}

.pd-toast-card {
  display: flex;
  gap: 11px;
  padding: 12px 14px;
  border: 1px solid var(--pd-line);
  border-radius: 16px;
  background: color-mix(in srgb, var(--pd-surface) 92%, transparent);
  box-shadow: 0 24px 48px -20px rgb(40 30 20 / 35%), 0 4px 12px -6px rgb(40 30 20 / 15%);
  color: var(--pd-text);
  backdrop-filter: blur(12px);
}

.pd-toast-app {
  display: grid;
  width: 34px;
  height: 34px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  background: #3370ff;
  color: #fff;
}

.pd-toast-app :deep(svg),
.pd-toast-app :deep(.iconify) {
  width: 17px;
  height: 17px;
}

.pd-toast-card > div {
  min-width: 0;
}

.pd-toast-card p {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 0 0 2px !important;
}

.pd-toast-card strong {
  font-size: 12.5px;
  font-weight: 600;
}

.pd-toast-card small {
  color: var(--pd-text3);
  font-size: 11px;
}

.pd-toast-card > div > span {
  display: -webkit-box;
  overflow: hidden;
  color: var(--pd-text2);
  font-size: 12px;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.pd-spin {
  animation: pd-spin 900ms linear infinite;
}

@keyframes pd-in {
  from { opacity: 0; transform: translateY(8px); }
}

@keyframes pd-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -150% 0; }
}

@keyframes pd-blink {
  50% { opacity: 0; }
}

@keyframes pd-spin {
  to { transform: rotate(360deg); }
}

@container (max-width: 560px) {
  .pd-body {
    grid-template-columns: minmax(0, 1fr);
    height: 400px;
  }

  .pd-sidebar {
    display: none;
  }

  .pd-thread {
    padding-inline: 14px;
  }

  .pd-composer {
    margin: 8px 10px 10px;
  }

  .pd-steps code {
    display: none;
  }

  .pd-toast {
    bottom: -34px;
    left: 8px;
    width: calc(100% - 16px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pd-shimmer,
  .pd-spin,
  .pd-caret {
    animation: none;
  }
}
</style>
