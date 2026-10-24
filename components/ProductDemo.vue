<script setup lang="ts">
// A hand-drawn, animated replica of the BotHub desktop chat window as it
// ships today (sidebar, bot switcher in the title bar, activity group,
// deliverable card, composer). No screenshots: every frame is HTML, so it
// stays crisp, themable and localized. Strings mirror packages/ui/locales.

const { locale } = useDocusI18n()
const runtimeConfig = useRuntimeConfig()
const isZh = computed(() => locale.value !== 'en')

const baseURL = runtimeConfig.app.baseURL || '/'
const logoSrc = `${baseURL.endsWith('/') ? baseURL : `${baseURL}/`}logo.png`

const copy = computed(() => isZh.value ? {
  label: 'BotHub 桌面端演示：把「下载」里九月的发票整理成汇总表',
  nav: [
    { icon: 'i-lucide-square-pen', label: '开始新对话', key: '⌘N' },
    { icon: 'i-lucide-search', label: '搜索', key: '⌘K' },
    { icon: 'i-lucide-clock-4', label: '定时任务', key: '' },
  ],
  groups: [
    { label: '今天', items: ['周报草稿', '竞品调研笔记'] },
    { label: '昨天', items: ['翻译 README', '东京行程规划'] },
    { label: '7 天内', items: ['季度预算复盘', '读书笔记整理'] },
  ],
  newTitle: '九月发票整理',
  settings: '设置',
  bot: '工作助理',
  emptyLead: '想聊点什么？随便说说也行',
  emptyPresets: ['帮你理一理今天要做的事', '帮你写一段文字', '把一个概念讲明白'],
  temporary: '开始临时对话',
  placeholder: '随便问点什么',
  prompt: '把「下载」里九月的发票整理成一张汇总表',
  permission: '智能批准',
  effort: '自动',
  preparing: '等待模型响应',
  steps: [
    { activity: '运行命令', title: '列出「下载」里九月的发票' },
    { activity: '读取文件', title: '读取 12 张发票' },
    { activity: '运行命令', title: '提取金额和税号' },
    { activity: '写入文件', title: '生成汇总表' },
  ],
  running: (activity: string) => `正在${activity}…`,
  summary: '运行了 2 条命令、读取了 12 个文件、写入了 1 个文件 · 14秒',
  reply: '九月一共 12 张发票，合计 ¥8,420.00，按类型汇总如下：',
  table: {
    head: ['类型', '张数', '金额'],
    rows: [['增值税专票', '3', '¥4,260.00'], ['增值税普票', '8', '¥3,860.00'], ['电子行程单', '1', '¥300.00']],
  },
  file: { name: '九月发票汇总.xlsx', kind: '文件', opening: '文件 · 正在打开' },
} : {
  label: 'BotHub desktop demo: turning September invoices in Downloads into a summary sheet',
  nav: [
    { icon: 'i-lucide-square-pen', label: 'Start new chat', key: '⌘N' },
    { icon: 'i-lucide-search', label: 'Search', key: '⌘K' },
    { icon: 'i-lucide-clock-4', label: 'Scheduled Tasks', key: '' },
  ],
  groups: [
    { label: 'Today', items: ['Weekly report draft', 'Competitor notes'] },
    { label: 'Yesterday', items: ['Translate README', 'Tokyo itinerary'] },
    { label: 'Previous 7 days', items: ['Quarterly budget review', 'Reading notes'] },
  ],
  newTitle: 'September invoices',
  settings: 'Settings',
  bot: 'Work Assistant',
  emptyLead: 'Anything on your mind?',
  emptyPresets: ['Sort out today\'s to-dos', 'Write something for you', 'Explain a concept'],
  temporary: 'Start temporary chat',
  placeholder: 'Ask anything',
  prompt: 'Turn the September invoices in Downloads into a summary sheet',
  permission: 'Smart approval',
  effort: 'Auto',
  preparing: 'Waiting for response',
  steps: [
    { activity: 'Running commands', title: 'List September invoices in Downloads' },
    { activity: 'Reading files', title: 'Read 12 invoices' },
    { activity: 'Running commands', title: 'Extract amounts and tax IDs' },
    { activity: 'Writing files', title: 'Build the summary sheet' },
  ],
  running: (activity: string) => `${activity}…`,
  summary: 'Ran 2 commands, read 12 files, wrote 1 file · 14s',
  reply: '12 invoices in September, ¥8,420.00 in total. By type:',
  table: {
    head: ['Type', 'Count', 'Amount'],
    rows: [['VAT special', '3', '¥4,260.00'], ['VAT general', '8', '¥3,860.00'], ['E-ticket', '1', '¥300.00']],
  },
  file: { name: 'invoices-sep.xlsx', kind: 'File', opening: 'File · opening' },
})

const initialState = () => ({
  typed: 0,
  sent: false,
  step: 0,
  done: false,
  reply: 0,
  rows: 0,
  file: false,
  opening: false,
  fading: false,
})

const state = reactive(initialState())

const running = computed(() => state.sent && !state.done)
const typedText = computed(() => Array.from(copy.value.prompt).slice(0, state.typed).join(''))
const replyLength = computed(() => Array.from(copy.value.reply).length)
const replyText = computed(() => Array.from(copy.value.reply).slice(0, state.reply).join(''))
const currentStep = computed(() => copy.value.steps[state.step - 1])

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

const showFinalFrame = () => {
  Object.assign(state, initialState(), {
    sent: true,
    step: copy.value.steps.length,
    done: true,
    reply: replyLength.value,
    rows: copy.value.table.rows.length,
    file: true,
  })
}

const play = async () => {
  try {
    while (alive) {
      Object.assign(state, initialState())
      await wait(1500)
      const promptLength = Array.from(copy.value.prompt).length
      while (state.typed < promptLength) {
        state.typed += 1
        await wait(isZh.value ? 75 : 34)
      }
      await wait(450)
      state.sent = true
      state.typed = 0
      await wait(900)
      for (let i = 1; i <= copy.value.steps.length; i += 1) {
        state.step = i
        await wait(1250)
      }
      state.done = true
      await wait(400)
      while (state.reply < replyLength.value) {
        state.reply = Math.min(replyLength.value, state.reply + (isZh.value ? 1 : 3))
        await wait(34)
      }
      for (let i = 1; i <= copy.value.table.rows.length; i += 1) {
        await wait(200)
        state.rows = i
      }
      await wait(400)
      state.file = true
      await wait(1500)
      state.opening = true
      await wait(1300)
      state.opening = false
      await wait(3800)
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
      <!-- 标题栏：侧栏色与页面色分区，Bot 切换器居中在对话列上方 -->
      <div class="pd-titlebar">
        <div class="pd-titlebar-side">
          <span class="pd-lights"><i /><i /><i /></span>
          <span class="pd-bar-btn">
            <svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M9.5 4.5v15" /></svg>
          </span>
        </div>
        <div class="pd-titlebar-main">
          <span class="pd-bot">
            <img :src="logoSrc" alt="">
            <strong>{{ copy.bot }}</strong>
            <UIcon name="i-lucide-chevron-down" />
          </span>
          <span class="pd-bar-btn pd-bar-right">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></svg>
          </span>
        </div>
      </div>

      <div class="pd-body">
        <aside class="pd-sidebar">
          <div class="pd-nav">
            <span v-for="item in copy.nav" :key="item.icon"><UIcon :name="item.icon" /><em>{{ item.label }}</em><kbd v-if="item.key">{{ item.key }}</kbd></span>
          </div>
          <div class="pd-list">
            <template v-for="(group, groupIndex) in copy.groups" :key="group.label">
              <p class="pd-group">{{ group.label }}</p>
              <span v-if="groupIndex === 0 && state.sent" class="pd-row active pd-row-new">
                <em>{{ copy.newTitle }}</em>
                <i v-if="running" class="pd-ring" />
              </span>
              <span v-for="title in group.items" :key="title" class="pd-row"><em>{{ title }}</em></span>
            </template>
          </div>
          <div class="pd-nav pd-settings">
            <span><UIcon name="i-lucide-settings" /><em>{{ copy.settings }}</em></span>
          </div>
        </aside>

        <main class="pd-main">
          <div class="pd-thread">
            <!-- 空状态：左对齐、贴近输入框 -->
            <div class="pd-empty" :data-hidden="state.sent || undefined">
              <p class="pd-empty-lead">{{ copy.emptyLead }}</p>
              <p v-for="preset in copy.emptyPresets" :key="preset" class="pd-empty-row">{{ preset }}</p>
              <span class="pd-temp">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke-dasharray="3 3" /></svg>
                {{ copy.temporary }}
              </span>
            </div>

            <div v-if="state.sent" class="pd-column">
              <div class="pd-user">{{ copy.prompt }}</div>

              <p v-if="state.step === 0" class="pd-activity"><span class="pd-shimmer">{{ copy.preparing }}</span></p>
              <p v-else class="pd-activity" :data-done="state.done || undefined">
                <template v-if="!state.done && currentStep">
                  <span class="pd-shimmer">{{ copy.running(currentStep.activity) }}</span>
                  <small :key="state.step">· {{ currentStep.title }}</small>
                </template>
                <span v-else>{{ copy.summary }}</span>
                <UIcon name="i-lucide-chevron-right" />
              </p>

              <div v-if="state.reply > 0" class="pd-reply">
                <p>{{ replyText }}<i v-if="state.reply < replyLength" class="pd-caret" /></p>
                <table v-if="state.rows > 0">
                  <thead><tr><th v-for="cell in copy.table.head" :key="cell">{{ cell }}</th></tr></thead>
                  <tbody>
                    <tr v-for="row in copy.table.rows.slice(0, state.rows)" :key="row[0]">
                      <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="state.file" class="pd-file" :data-opening="state.opening || undefined">
                <UIcon name="i-lucide-file" class="pd-file-icon" />
                <span><strong>{{ copy.file.name }}</strong><small>{{ state.opening ? copy.file.opening : copy.file.kind }}</small></span>
                <i v-if="state.opening" class="pd-ring pd-ring-lg" />
                <UIcon v-else name="i-lucide-external-link" class="pd-file-open" />
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
              <span class="pd-chip pd-perm"><UIcon name="i-lucide-shield-check" /><em>{{ copy.permission }}</em><UIcon name="i-lucide-chevron-down" class="pd-chev" /></span>
              <span class="pd-spacer" />
              <span v-if="state.sent" class="pd-context">
                <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="7" :style="{ strokeDashoffset: state.done ? 29 : 33 }" /></svg>
              </span>
              <span class="pd-chip pd-hide-narrow"><UIcon name="i-lucide-brain" />{{ copy.effort }}</span>
              <span class="pd-chip">gpt-5.5<UIcon name="i-lucide-chevron-down" class="pd-chev" /></span>
              <span class="pd-send" :data-running="running || undefined" :data-disabled="(!running && state.typed === 0) || undefined">
                <svg v-if="running" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" /></svg>
                <svg v-else viewBox="0 0 24 24"><path d="M12 5v14M5 12l7-7 7 7" /></svg>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pd {
  --pd-bg: #fefdfd;
  --pd-sidebar: #f5f3f2;
  --pd-variant: #f3f1f0;
  --pd-card: #e9e7e6;
  --pd-text: #1d1a18;
  --pd-text2: #585553;
  --pd-text3: #716e6c;
  --pd-divider: #d9d7d5;
  --pd-primary: #795a47;
  --pd-user: #f0f0ef;
  --pd-user-text: #2e2e2e;
  --pd-shadow: 0 1px 0 rgb(40 30 20 / 3%), 0 40px 80px -32px rgb(40 30 20 / 32%), 0 16px 32px -20px rgb(40 30 20 / 20%);

  position: relative;
  container-type: inline-size;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
}

.pd * {
  font-family: inherit !important;
}

.pd[data-fading] .pd-column {
  opacity: 0 !important;
  transition: opacity 500ms ease;
}

:global(.dark .pd) {
  --pd-bg: #201f1e;
  --pd-sidebar: #2a2927;
  --pd-variant: #393836;
  --pd-card: #343231;
  --pd-text: #e6e4e2;
  --pd-text2: #a9a7a6;
  --pd-text3: #8d8c8a;
  --pd-divider: #494745;
  --pd-primary: #cca87f;
  --pd-user: #3a3a3a;
  --pd-user-text: #e5e5e5;
  --pd-shadow: 0 40px 80px -32px rgb(0 0 0 / 70%);
}

.pd-window {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--pd-divider) 70%, transparent);
  border-radius: 14px;
  background: var(--pd-bg);
  box-shadow: var(--pd-shadow);
  color: var(--pd-text);
  font-size: 13px;
  font-weight: 450;
  line-height: 1.5;
}

/* Title bar */
.pd-titlebar {
  display: grid;
  grid-template-columns: 184px minmax(0, 1fr);
  height: 40px;
}

.pd-titlebar-side {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 14px;
  border-right: 1px solid color-mix(in srgb, var(--pd-divider) 70%, transparent);
  background: var(--pd-sidebar);
}

.pd-titlebar-main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pd-lights {
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

.pd-bar-btn {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  color: var(--pd-text2);
}

.pd-bar-btn svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.pd-bar-right {
  position: absolute;
  right: 10px;
}

.pd-bot {
  display: inline-flex;
  height: 32px;
  align-items: center;
  gap: 7px;
  padding: 0 8px;
  border-radius: 12px;
}

.pd-bot img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.pd-bot strong {
  font-size: 13px;
  font-weight: 500;
}

.pd-bot > :last-child {
  width: 14px;
  height: 14px;
  color: var(--pd-text2);
}

.pd-body {
  display: grid;
  grid-template-columns: 184px minmax(0, 1fr);
  height: 470px;
}

/* Sidebar */
.pd-sidebar {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 4px 8px 10px;
  border-right: 1px solid color-mix(in srgb, var(--pd-divider) 70%, transparent);
  background: var(--pd-sidebar);
}

.pd-nav {
  display: grid;
  gap: 1px;
}

.pd-nav span,
.pd-row {
  display: flex;
  min-height: 28px;
  align-items: center;
  gap: 9px;
  padding: 0 9px;
  border-radius: 8px;
  color: var(--pd-text);
  font-size: 12.5px;
}

.pd-nav em,
.pd-row em {
  overflow: hidden;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-nav :deep(.iconify),
.pd-nav :deep(svg) {
  flex: none;
  width: 15px;
  height: 15px;
  color: var(--pd-text);
}

.pd-nav kbd {
  margin-left: auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--pd-text3);
  font-size: 11px;
}

.pd-list {
  min-height: 0;
  flex: 1;
  overflow: hidden;
  padding-top: 8px;
}

.pd-group {
  margin: 8px 9px 2px !important;
  color: var(--pd-text3);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.pd-row.active {
  background: color-mix(in srgb, var(--pd-text) 7%, transparent);
}

.pd-row-new {
  animation: pd-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pd-ring {
  flex: none;
  width: 13px;
  height: 13px;
  margin-left: auto;
  border: 2px solid color-mix(in srgb, var(--pd-text2) 22%, transparent);
  border-top-color: var(--pd-text2);
  border-radius: 50%;
  animation: pd-spin 700ms linear infinite;
}

.pd-ring-lg {
  width: 16px;
  height: 16px;
}

.pd-settings {
  padding-top: 6px;
}

/* Main column */
.pd-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  background: var(--pd-bg);
}

.pd-thread {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  padding: 8px 24px 0;
}

.pd-empty {
  position: absolute;
  right: 0;
  bottom: 14px;
  left: 0;
  width: min(100% - 48px, 400px);
  margin: 0 auto;
  transition: opacity 250ms ease, transform 250ms ease;
}

.pd-empty[data-hidden] {
  opacity: 0;
  transform: translateY(-6px);
}

.pd-empty-lead {
  margin: 0 0 10px !important;
  color: var(--pd-text) !important;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.36;
}

.pd-empty-row {
  margin: 0 !important;
  padding: 9px 0;
  border-top: 1px solid color-mix(in srgb, var(--pd-divider) 60%, transparent);
  color: var(--pd-text2) !important;
  font-size: 13px;
}

.pd-temp {
  display: flex;
  width: max-content;
  height: 26px;
  align-items: center;
  gap: 5px;
  margin: 12px auto 0;
  padding: 0 11px;
  border: 1px solid var(--pd-divider);
  border-radius: 13px;
  color: var(--pd-text2);
  font-size: 11px;
}

.pd-temp svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.pd-column {
  display: flex;
  max-width: 440px;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
}

.pd-user {
  align-self: flex-end;
  max-width: 84%;
  padding: 7px 14px;
  border-radius: 18px 5px 18px 18px;
  background: var(--pd-user);
  color: var(--pd-user-text);
  font-size: 13px;
  line-height: 1.6;
  animation: pd-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pd-activity {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 5px;
  margin: 0 !important;
  color: var(--pd-text2) !important;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.pd-activity small {
  overflow: hidden;
  color: var(--pd-text3);
  font-size: 13px;
  font-weight: 450;
  text-overflow: ellipsis;
  animation: pd-fade 300ms ease;
}

.pd-activity > span:not(.pd-shimmer) {
  overflow: hidden;
  text-overflow: ellipsis;
}

.pd-activity :deep(.iconify),
.pd-activity :deep(svg) {
  flex: none;
  width: 14px;
  height: 14px;
  opacity: 0;
}

.pd-activity[data-done] :deep(.iconify),
.pd-activity[data-done] :deep(svg) {
  opacity: 0.6;
}

.pd-shimmer {
  flex: none;
  background: linear-gradient(90deg, var(--pd-text3) 0%, var(--pd-text3) 35%, var(--pd-text) 50%, var(--pd-text3) 65%, var(--pd-text3) 100%);
  background-size: 250% 100%;
  background-clip: text;
  color: transparent;
  animation: pd-shimmer 1.4s linear infinite;
}

.pd-reply p {
  margin: 0 !important;
  color: var(--pd-text) !important;
  font-size: 13px;
  line-height: 1.7;
}

.pd-reply table {
  width: 100%;
  margin: 8px 0 0 !important;
  border-collapse: collapse;
  font-size: 12px;
}

.pd-reply th,
.pd-reply td {
  padding: 5px 10px 5px 0 !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--pd-divider) 70%, transparent) !important;
  background: none !important;
  color: var(--pd-text);
  text-align: left;
}

.pd-reply th {
  color: var(--pd-text2);
  font-weight: 600;
}

.pd-reply th:last-child,
.pd-reply td:last-child {
  padding-right: 0 !important;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.pd-reply tbody tr {
  animation: pd-in 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pd-file {
  display: grid;
  width: min(100%, 300px);
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
  padding: 9px 13px;
  border: 1px solid color-mix(in srgb, var(--pd-divider) 60%, transparent);
  border-radius: 13px;
  background: var(--pd-bg);
  animation: pd-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
  transition: background 200ms ease;
}

.pd-file[data-opening] {
  background: color-mix(in srgb, var(--pd-text) 4%, var(--pd-bg));
}

.pd-file-icon {
  width: 18px;
  height: 18px;
  color: var(--pd-text2);
}

.pd-file > span {
  display: grid;
  min-width: 0;
}

.pd-file strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-file small {
  color: var(--pd-text2);
  font-size: 12px;
}

.pd-file-open {
  width: 15px;
  height: 15px;
  color: var(--pd-text);
  opacity: 0.7;
}

/* Composer */
.pd-composer {
  display: grid;
  gap: 10px;
  margin: 8px 18px 12px;
  padding: 11px 12px 10px 14px;
  border: 1.5px solid color-mix(in srgb, var(--pd-text2) 12%, transparent);
  border-radius: 22px;
  background: var(--pd-bg);
  box-shadow: 0 3px 10px rgb(0 0 0 / 4%);
}

.pd-input {
  min-height: 21px;
  margin: 0 0 12px !important;
  overflow: hidden;
  color: var(--pd-text) !important;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pd-placeholder {
  color: var(--pd-text2);
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
  gap: 4px;
}

.pd-spacer {
  flex: 1;
}

.pd-icon-btn,
.pd-chip {
  display: inline-flex;
  height: 28px;
  flex: none;
  align-items: center;
  gap: 5px;
  border-radius: 14px;
  color: var(--pd-text);
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
}

.pd-icon-btn {
  width: 28px;
  justify-content: center;
  color: var(--pd-text2);
}

.pd-chip {
  padding: 0 7px;
}

.pd-chip em {
  font-style: normal;
}

.pd-tools :deep(.iconify),
.pd-tools :deep(svg) {
  width: 14px;
  height: 14px;
}

.pd-icon-btn :deep(.iconify),
.pd-icon-btn :deep(svg) {
  width: 17px;
  height: 17px;
}

.pd-chip .pd-chev {
  width: 13px;
  height: 13px;
  color: var(--pd-text2);
}

.pd-context {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  animation: pd-fade 300ms ease;
}

.pd-context svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke-width: 2.4;
  transform: rotate(-90deg);
}

.pd-context circle:first-child {
  stroke: color-mix(in srgb, var(--pd-text) 16%, transparent);
}

.pd-context circle:last-child {
  stroke: var(--pd-text2);
  stroke-dasharray: 44;
  stroke-linecap: butt;
  transition: stroke-dashoffset 800ms ease;
}

.pd-send {
  display: grid;
  width: 28px;
  height: 28px;
  flex: none;
  place-items: center;
  margin-left: 2px;
  border-radius: 50%;
  background: var(--pd-text);
  color: var(--pd-bg);
  transition: background 200ms ease, color 200ms ease;
}

.pd-send[data-disabled] {
  background: var(--pd-card);
  color: color-mix(in srgb, var(--pd-text) 35%, transparent);
}

.pd-send svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.pd-send[data-running] svg {
  width: 13px;
  height: 13px;
  fill: currentColor;
  stroke: none;
}

@keyframes pd-in {
  from { opacity: 0; transform: translateY(8px); }
}

@keyframes pd-fade {
  from { opacity: 0; }
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
  .pd-titlebar,
  .pd-body {
    grid-template-columns: 0 minmax(0, 1fr);
  }

  .pd-titlebar-side,
  .pd-sidebar {
    overflow: hidden;
    padding: 0;
    border: 0;
  }

  .pd-titlebar-main {
    padding-left: 70px;
  }

  .pd-titlebar-main::before {
    position: absolute;
    left: 14px;
    width: 47px;
    height: 11px;
    background:
      radial-gradient(circle at 5.5px 5.5px, #ff5f57 5.5px, transparent 6px),
      radial-gradient(circle at 23.5px 5.5px, #febc2e 5.5px, transparent 6px),
      radial-gradient(circle at 41.5px 5.5px, #28c840 5.5px, transparent 6px);
    content: "";
  }

  .pd-body {
    height: 440px;
  }

  .pd-thread {
    padding-inline: 14px;
  }

  .pd-composer {
    margin: 8px 10px 10px;
  }

  .pd-hide-narrow {
    display: none;
  }
}

@container (max-width: 400px) {
  .pd-perm em {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pd-shimmer,
  .pd-ring,
  .pd-caret {
    animation: none;
  }
}
</style>
