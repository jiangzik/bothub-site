<script setup lang="ts">
const { locale, localePath } = useDocusI18n()

const isZh = computed(() => locale.value !== 'en')

const copy = computed(() => isZh.value ? {
  heroTitle: '把所有 AI，放进一个工作流。',
  heroSubtitle: '连接前沿模型、本地工具与移动设备。需要思考、创作或执行时，BotHub 让合适的能力自然接力。',
  download: '免费下载',
  guide: '查看使用指南',
  boardLabel: 'BotHub 将不同 AI 能力、本地工具与远程设备组织到同一个工作流中',
  sourceDetails: ['深度思考', '图像与内容', '工具与自动化'],
  boardBottom: ['上下文持续同步', '本地操作按需授权', '跨端继续'],
  ticker: ['前沿模型', '本地优先', '跨端接力', '开放协议'],
  capabilitiesTitle: '从一个问题，到真正完成。',
  capabilitiesIntro: 'BotHub 不止回答问题。它能组织模型、读取上下文、调用本地工具，并在需要时把工作延续到你的其他设备。',
  features: [
    {
      title: '按任务选择智能，而不是被模型绑住',
      body: '登录即可使用一线模型，也可以接入自己的 Key。推理、速度、视觉和生图能力，在同一条工作流里按需切换。',
    },
    {
      title: '让 AI 在你的电脑上动手',
      body: '文件、终端、浏览器、截图、剪贴板与 MCP 工具都能按需调用；敏感操作仍由你确认。',
    },
    {
      title: '上下文留在工作里',
      body: 'PDF、文档、表格、图片和网页可以进入知识库。重要内容可长期复用，不必每次重新解释。',
    },
    {
      title: '离开屏幕，工作也能继续',
      body: '用定时任务触发 Bot，通过飞书、Telegram、QQ 或微信接收结果；也能从手机远程连接桌面端继续管理 Agent。',
    },
  ],
  toolIndex: [
    { title: '文件与知识库', meta: '读取 · 整理 · 写入' },
    { title: '浏览器与网页', meta: '打开 · 分析 · 操作' },
    { title: '终端与 MCP', meta: '执行 · 扩展 · 审批' },
  ],
  knowledgeFormats: ['PDF', 'DOCX', 'XLSX', 'IMAGE', 'WEB'],
  knowledgeLabel: '05 种来源进入同一上下文',
  knowledgeOutcome: '一次加入，持续复用。',
  automation: [
    { meta: 'SCHEDULE / 09:00', title: '定时触发', body: '按计划或事件启动 Bot' },
    { meta: 'LOCAL / DESKTOP', title: '本地执行', body: '模型和工具继续完成任务' },
    { meta: 'DELIVER / ANYWHERE', title: '结果回传', body: '发送到手机或 IM' },
  ],
  manifestoTitle: '你的 AI，不该困在一个对话框里。',
  principles: [
    { title: '从对话到执行', body: '答案不是终点。BotHub 让模型继续读取、整理、操作和交付。' },
    { title: '从单一到协作', body: '不同模型各司其职，共享同一段上下文，减少来回复制与切换。' },
    { title: '从桌面到随身', body: '重任务留在电脑运行，手机和 IM 随时查看、触发与接续。' },
  ],
  continuityTitle: '电脑负责重活，手机让它不中断。',
  continuityBody: 'Android 可以跨网络连接 BotHub 桌面端，查看状态、运行命令、管理 Agent，继续推进 Claude Code 或 Codex 任务。iOS 版本也在筹备中。',
  continuityLink: '了解远程工作流',
  continuityChannels: [
    { label: 'DESKTOP', title: '深度工作与本地工具', meta: 'macOS · Windows · Linux' },
    { label: 'PHONE', title: '远程控制与接力', meta: 'Android · iOS soon' },
    { label: 'IM BOT', title: '触发任务与收结果', meta: 'Feishu · Telegram · QQ · WeChat' },
  ],
  continuityStatus: '一个任务 · 同一段上下文 · 随处继续',
  downloadTitle: '把下一次工作，交给更完整的 AI。',
  downloadBody: '桌面端承担完整工具流，Android 让工作随时继续。',
  resourcesTitle: '从这里开始。',
  resourcesIntro: '安装、配置、深入使用或排查问题，都有清晰的文档可以继续。',
  resources: [
    { title: '快速开始', body: '安装、配置与第一条消息', to: '/quick-start/overview' },
    { title: '使用手册', body: '模型、工具、知识库与自动化', to: '/manual/overview' },
    { title: '常见问题', body: '下载、网络与模型调用排查', to: '/faq/overview' },
    { title: '隐私政策', body: '数据范围、存储与账号删除', to: '/faq/privacy-policy' },
  ],
  community: '和开发者、创作者一起交流 BotHub 的新用法。',
  join: '加入 QQ 群',
} : {
  heroTitle: 'Put every AI into one workflow.',
  heroSubtitle: 'Connect frontier models, local tools, and your devices. When it is time to reason, create, or act, BotHub brings the right capability into the flow.',
  download: 'Download free',
  guide: 'Read the guide',
  boardLabel: 'BotHub orchestrates AI capabilities, local tools, and remote devices in one continuous workflow',
  sourceDetails: ['Deep thinking', 'Image & content', 'Tools & automation'],
  boardBottom: ['Context in sync', 'Permission first', 'Continue anywhere'],
  ticker: ['Frontier models', 'Local first', 'Cross-device', 'Open protocols'],
  capabilitiesTitle: 'From one question to work completed.',
  capabilitiesIntro: 'BotHub does more than answer. It orchestrates models, reads context, uses local tools, and carries the work to your other devices when needed.',
  features: [
    {
      title: 'Choose intelligence for the task, not the other way around',
      body: 'Use frontier models after sign-in, or bring your own key. Reasoning, speed, vision, and image generation can hand off inside one workflow.',
    },
    {
      title: 'Let AI work on your computer',
      body: 'Files, terminal, browser, screenshots, clipboard, and MCP tools are available when needed, with your approval for sensitive actions.',
    },
    {
      title: 'Keep context with the work',
      body: 'PDFs, documents, spreadsheets, images, and web pages become reusable knowledge, so you do not have to explain everything again.',
    },
    {
      title: 'Keep working after you leave the screen',
      body: 'Schedule bots, receive results through Feishu, Telegram, QQ, or WeChat, and reach your desktop agents remotely from your phone.',
    },
  ],
  toolIndex: [
    { title: 'Files & knowledge', meta: 'Read · organize · write' },
    { title: 'Browser & web', meta: 'Open · inspect · operate' },
    { title: 'Terminal & MCP', meta: 'Run · extend · approve' },
  ],
  knowledgeFormats: ['PDF', 'DOCX', 'XLSX', 'IMAGE', 'WEB'],
  knowledgeLabel: '05 sources, one shared context',
  knowledgeOutcome: 'Add once. Reuse throughout.',
  automation: [
    { meta: 'SCHEDULE / 09:00', title: 'Scheduled', body: 'Start a bot by time or event' },
    { meta: 'LOCAL / DESKTOP', title: 'Local action', body: 'Models and tools keep working' },
    { meta: 'DELIVER / ANYWHERE', title: 'Result delivered', body: 'Reach your phone or IM' },
  ],
  manifestoTitle: 'Your AI should not live inside one chat box.',
  principles: [
    { title: 'From conversation to action', body: 'An answer is not the finish line. BotHub helps models read, organize, operate, and deliver.' },
    { title: 'From one model to a team', body: 'Different models do what they do best while sharing context, without constant copying and switching.' },
    { title: 'From desktop to anywhere', body: 'Heavy work stays on your computer while phone and IM let you check, trigger, and continue.' },
  ],
  continuityTitle: 'Let the computer work. Keep it moving from your phone.',
  continuityBody: 'Android can reach BotHub Desktop across networks to check status, run commands, manage agents, and continue Claude Code or Codex tasks. iOS is in progress.',
  continuityLink: 'Explore remote workflows',
  continuityChannels: [
    { label: 'DESKTOP', title: 'Deep work & local tools', meta: 'macOS · Windows · Linux' },
    { label: 'PHONE', title: 'Remote control & handoff', meta: 'Android · iOS soon' },
    { label: 'IM BOT', title: 'Trigger work & get results', meta: 'Feishu · Telegram · QQ · WeChat' },
  ],
  continuityStatus: 'One task · one context · continue anywhere',
  downloadTitle: 'Give your next task a more complete AI.',
  downloadBody: 'Desktop handles the full tool workflow. Android keeps it moving.',
  resourcesTitle: 'Start here.',
  resourcesIntro: 'Clear guides are ready when you want to install, configure, go deeper, or solve a problem.',
  resources: [
    { title: 'Quick Start', body: 'Install, configure, send your first message', to: '/quick-start/overview' },
    { title: 'Manual', body: 'Models, tools, knowledge, and automation', to: '/manual/overview' },
    { title: 'FAQ', body: 'Downloads, networking, and model calls', to: '/faq/overview' },
    { title: 'Privacy Policy', body: 'Data scope, storage, and account deletion', to: '/faq/privacy-policy' },
  ],
  community: 'Share new ways of working with BotHub developers and creators.',
  join: 'Join QQ Group',
})
</script>

<template>
  <div class="refined-landing">
    <section class="signal-hero" aria-labelledby="signal-hero-title">
      <div class="signal-hero-grid">
        <div class="signal-hero-copy">
          <p class="signal-eyebrow"><span /> ONE WORKSPACE · ALL YOUR AI</p>
          <h1 id="signal-hero-title">{{ copy.heroTitle }}</h1>
          <p class="signal-hero-lede">{{ copy.heroSubtitle }}</p>
          <div class="signal-hero-actions">
            <a class="signal-button signal-button-primary" href="#download">{{ copy.download }} <span aria-hidden="true">→</span></a>
            <NuxtLink class="signal-button signal-button-quiet" :to="localePath('/quick-start/overview')">{{ copy.guide }} <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <div class="signal-platforms"><span>macOS</span><span>Windows</span><span>Linux</span><span>Android</span></div>
        </div>

        <div class="signal-board" role="img" :aria-label="copy.boardLabel">
          <div class="signal-board-top"><span>LIVE ORCHESTRATION</span><span class="signal-live"><i /> READY</span></div>
          <div class="signal-board-canvas">
            <div v-for="(name, index) in ['REASON', 'CREATE', 'ACT']" :key="name" class="signal-flow-row">
              <div class="signal-source">
                <span>0{{ index + 1 }}</span><strong>{{ name }}</strong><small>{{ copy.sourceDetails[index] }}</small>
              </div>
              <div class="signal-route" aria-hidden="true"><span>ROUTE 0{{ index + 1 }}</span></div>
              <div class="signal-target"><i /><span>{{ ['LOCAL TOOLS', 'KNOWLEDGE', 'REMOTE LINK'][index] }}</span></div>
            </div>
          </div>
          <div class="signal-board-bottom"><span v-for="item in copy.boardBottom" :key="item">{{ item }}</span></div>
        </div>
      </div>
    </section>

    <div class="signal-ticker" aria-label="BotHub core qualities">
      <span v-for="(item, index) in copy.ticker" :key="item"><i>0{{ index + 1 }}</i>{{ item }}</span>
    </div>

    <ModelPlaza />

    <section id="capabilities" class="signal-section signal-capabilities" aria-labelledby="capabilities-title">
      <header class="signal-section-head">
        <div><p class="signal-section-index">02 / CAPABILITIES</p><h2 id="capabilities-title">{{ copy.capabilitiesTitle }}</h2></div>
        <p>{{ copy.capabilitiesIntro }}</p>
      </header>

      <div class="signal-capability-stack">
        <article class="signal-capability-row">
          <div class="signal-capability-copy"><span>01</span><h3>{{ copy.features[1].title }}</h3><p>{{ copy.features[1].body }}</p></div>
          <div class="signal-tool-index" aria-label="Local tools">
            <div v-for="(item, index) in copy.toolIndex" :key="item.title"><span>0{{ index + 1 }}</span><strong>{{ item.title }}</strong><em>{{ item.meta }}</em><i>↗</i></div>
          </div>
        </article>

        <article class="signal-capability-row">
          <div class="signal-capability-copy"><span>02</span><h3>{{ copy.features[2].title }}</h3><p>{{ copy.features[2].body }}</p></div>
          <div class="signal-knowledge-field" aria-label="Supported knowledge types">
            <div class="signal-knowledge-types"><span v-for="format in copy.knowledgeFormats" :key="format">{{ format }}</span></div>
            <div class="signal-knowledge-outcome"><span>{{ copy.knowledgeLabel }}</span><strong>{{ copy.knowledgeOutcome }}</strong></div>
          </div>
        </article>

        <article class="signal-capability-row">
          <div class="signal-capability-copy"><span>03</span><h3>{{ copy.features[3].title }}</h3><p>{{ copy.features[3].body }}</p></div>
          <div class="signal-run-sequence" aria-label="Automation and cross-device delivery flow">
            <div v-for="(item, index) in copy.automation" :key="item.title"><span>0{{ index + 1 }} · {{ item.meta }}</span><strong>{{ item.title }}</strong><small>{{ item.body }}</small></div>
          </div>
        </article>
      </div>
    </section>

    <section class="signal-manifesto" aria-labelledby="manifesto-title">
      <div class="signal-manifesto-head"><p class="signal-section-index">03 / A BETTER WORKFLOW</p><h2 id="manifesto-title">{{ copy.manifestoTitle }}</h2></div>
      <div class="signal-principles"><article v-for="(item, index) in copy.principles" :key="item.title"><span>0{{ index + 1 }}</span><h3>{{ item.title }}</h3><p>{{ item.body }}</p></article></div>
    </section>

    <section id="continuity" class="signal-section signal-continuity" aria-labelledby="continuity-title">
      <div class="signal-continuity-copy"><p class="signal-section-index">04 / CONTINUITY</p><h2 id="continuity-title">{{ copy.continuityTitle }}</h2><p>{{ copy.continuityBody }}</p><NuxtLink class="signal-text-link" :to="localePath('/manual/overview')">{{ copy.continuityLink }} <span aria-hidden="true">→</span></NuxtLink></div>
      <div class="signal-continuity-ledger" aria-label="BotHub Link connects desktop, phone, and instant messaging">
        <header><span>BOT HUB LINK</span><span>CONTEXT / SYNCED</span></header>
        <article v-for="(channel, index) in copy.continuityChannels" :key="channel.label"><span>0{{ index + 1 }}</span><em>{{ channel.label }}</em><strong>{{ channel.title }}</strong><small>{{ channel.meta }}</small></article>
        <footer><i /><span>{{ copy.continuityStatus }}</span></footer>
      </div>
    </section>

    <section id="download" class="signal-download" aria-labelledby="download-title">
      <div class="signal-download-head"><div><p class="signal-section-index">05 / GET BOTHUB</p><h2 id="download-title">{{ copy.downloadTitle }}</h2></div><div class="signal-download-meta"><VersionBadge label="CURRENT VERSION" /><p>{{ copy.downloadBody }}</p></div></div>
      <div class="signal-download-grid"><DownloadMacButton label="Apple Silicon / Intel" /><DownloadWindowsButton label="Windows 10+" /><DownloadGooglePlayButton label="Google Play" /><DownloadApkButton label="APK" /><DownloadLinuxButton label="AppImage" /></div>
    </section>

    <section id="resources" class="signal-section signal-resources" aria-labelledby="resources-title">
      <header class="signal-section-head signal-resources-head"><div><p class="signal-section-index">06 / RESOURCES</p><h2 id="resources-title">{{ copy.resourcesTitle }}</h2></div><p>{{ copy.resourcesIntro }}</p></header>
      <div class="signal-resource-grid"><NuxtLink v-for="(item, index) in copy.resources" :key="item.title" :to="localePath(item.to)"><span>0{{ index + 1 }}</span><strong>{{ item.title }}</strong><small>{{ item.body }}</small><i>↗</i></NuxtLink></div>
      <div class="signal-community"><p><span>COMMUNITY</span>{{ copy.community }}</p><JoinQqGroupButton id-label="QQ">{{ copy.join }}</JoinQqGroupButton></div>
    </section>
  </div>
</template>
