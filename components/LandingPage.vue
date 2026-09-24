<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const docsPath = useDocsPath()

const isZh = computed(() => locale.value !== 'en')
const detectedPlatform = useDetectedPlatform()

const copy = computed(() => isZh.value ? {
  heroTitle: ['好用的 AI，', '都在这一个 App 里'],
  heroSubtitle: 'GPT、DeepSeek、通义千问等模型，登录就能用。它还能读你的文件、开网页、跑命令；出门在外，用手机也能接着管。',
  alsoOn: '也支持',
  allPlatforms: '全部平台',
  guide: '查看使用指南',
  labels: { features: '功能', continuity: '跨端' },
  capabilitiesTitle: '说一声，它自己动手',
  capabilitiesIntro: '你说要做什么，它会自己去翻文件、开网页、跑命令。删文件这类操作，会先问过你。',
  features: {
    computer: {
      title: '帮你操作电脑',
      body: '整理文件夹、从网页上抄数据、在终端里跑脚本。动手改东西之前，会先征求你同意。',
    },
    knowledge: {
      title: '资料放进来，以后直接问',
      body: '把 PDF、Word、表格、网页放进知识库，之后提问时它会自己去翻，不用每次重新上传。',
    },
    automation: {
      title: '定时自动跑，结果发到手机',
      body: '比如每天早上 9 点整理行业新闻，每周五汇总周报，做完发到飞书、Telegram、QQ 或微信。',
    },
  },
  toolIndex: [
    { title: '文件', meta: '整理、改名、写入' },
    { title: '浏览器', meta: '打开网页、读内容、点按钮' },
    { title: '终端和 MCP', meta: '跑命令、接入更多工具' },
  ],
  knowledgeFormats: ['PDF', 'Word', 'Excel', '图片', '网页'],
  knowledgeLabel: '支持的资料',
  knowledgeOutcome: '放一次，一直能用',
  automation: [
    { meta: '每天 09:00', title: '按时开始', body: '按时间或事件自动启动' },
    { meta: '在你的电脑上', title: '自动做完', body: '调用模型和工具把事办完' },
    { meta: '发到手机', title: '收到结果', body: '飞书、Telegram、QQ 或微信' },
  ],
  continuityTitle: '人不在电脑前，也能管上面的任务',
  continuityBody: '用 Android 手机连上家里或公司的电脑，随时看 Claude Code、Codex 跑到哪了，需要你确认时直接在手机上回。iOS 版正在做。',
  continuityLink: '怎么连接手机和电脑',
  continuityChannels: [
    { label: 'desktop', title: '在电脑上干活', meta: 'macOS · Windows · Linux' },
    { label: 'phone', title: '在手机上远程查看和回复', meta: 'Android · iOS 开发中' },
    { label: 'im', title: '在聊天软件里派活、收结果', meta: '飞书 · Telegram · QQ · 微信' },
  ],
  downloadTitle: '下载 BotHub',
  downloadBody: '免费。电脑版功能最全，手机版可以远程接着用。',
  desktopGroup: '电脑',
  mobileGroup: '手机',
  apkLabel: '直接安装，不用应用商店',
  resourcesTitle: '使用帮助',
  resources: [
    { title: '快速开始', body: '安装、登录、发出第一条消息', to: '/quick-start/overview' },
    { title: '使用手册', body: '模型、工具、知识库和定时任务', to: '/manual/overview' },
    { title: '常见问题', body: '下载失败、连不上、模型报错', to: '/faq/overview' },
    { title: '隐私政策', body: '我们存什么、存在哪、怎么删号', to: '/faq/privacy-policy' },
  ],
  community: '有问题或想法？来 QQ 群聊聊。',
  join: '加入 QQ 群',
} : {
  heroTitle: ['The AI you want,', 'all in one app'],
  heroSubtitle: 'Use GPT, DeepSeek, Qwen and more right after you sign in. BotHub can also read your files, open web pages, and run commands. Away from your desk? Pick it up on your phone.',
  alsoOn: 'Also on',
  allPlatforms: 'All platforms',
  guide: 'Read the guide',
  labels: { features: 'Features', continuity: 'On the go' },
  capabilitiesTitle: 'Ask for it. BotHub does the work.',
  capabilitiesIntro: 'Tell it what you need and it goes through your files, opens web pages, and runs commands to get it done. It checks with you before anything risky, like deleting files.',
  features: {
    computer: {
      title: 'Works on your computer',
      body: 'Tidy up a folder, copy data off a web page, run a script in the terminal. It asks before it changes anything.',
    },
    knowledge: {
      title: 'Add your documents once, ask anytime',
      body: 'Put PDFs, Word files, spreadsheets, and web pages in a knowledge base. BotHub looks things up there when you ask, so you never upload them again.',
    },
    automation: {
      title: 'Runs on a schedule, reports to your phone',
      body: 'Summarize industry news every morning at 9, or pull together a weekly report on Fridays. Results arrive in Feishu, Telegram, QQ, or WeChat.',
    },
  },
  toolIndex: [
    { title: 'Files', meta: 'Organize, rename, write' },
    { title: 'Browser', meta: 'Open pages, read, click' },
    { title: 'Terminal & MCP', meta: 'Run commands, plug in tools' },
  ],
  knowledgeFormats: ['PDF', 'Word', 'Excel', 'Images', 'Web'],
  knowledgeLabel: 'Supported sources',
  knowledgeOutcome: 'Add once, use anytime',
  automation: [
    { meta: 'Every day 09:00', title: 'Starts on time', body: 'On a schedule or an event' },
    { meta: 'On your computer', title: 'Gets it done', body: 'Models and tools do the work' },
    { meta: 'To your phone', title: 'Result delivered', body: 'Feishu, Telegram, QQ, or WeChat' },
  ],
  continuityTitle: 'Away from your desk? Your tasks keep going.',
  continuityBody: 'Connect your Android phone to your computer at home or at work. See how Claude Code or Codex is doing, and reply from your phone when it needs you. iOS is in development.',
  continuityLink: 'How to connect your phone',
  continuityChannels: [
    { label: 'desktop', title: 'Does the work on your computer', meta: 'macOS · Windows · Linux' },
    { label: 'phone', title: 'Check in and reply from your phone', meta: 'Android · iOS in development' },
    { label: 'im', title: 'Send tasks and get results in chat', meta: 'Feishu · Telegram · QQ · WeChat' },
  ],
  downloadTitle: 'Download BotHub',
  downloadBody: 'Free. The desktop app does everything; the phone app lets you pick up where you left off.',
  desktopGroup: 'Desktop',
  mobileGroup: 'Mobile',
  apkLabel: 'Install directly, no app store',
  resourcesTitle: 'Help',
  resources: [
    { title: 'Quick Start', body: 'Install, sign in, send your first message', to: '/quick-start/overview' },
    { title: 'Manual', body: 'Models, tools, knowledge bases, schedules', to: '/manual/overview' },
    { title: 'FAQ', body: 'Download problems, connection issues, model errors', to: '/faq/overview' },
    { title: 'Privacy Policy', body: 'What we store, where, and how to delete your account', to: '/faq/privacy-policy' },
  ],
  community: 'Questions or ideas? Come chat in our QQ group.',
  join: 'Join QQ Group',
})
</script>

<template>
  <div class="refined-landing">
    <section class="signal-hero" aria-labelledby="signal-hero-title">
      <div class="signal-hero-grid">
        <div class="signal-hero-copy">
          <h1 id="signal-hero-title">{{ copy.heroTitle[0] }}<br>{{ copy.heroTitle[1] }}</h1>
          <p class="signal-hero-lede">{{ copy.heroSubtitle }}</p>
          <div class="signal-hero-actions">
            <HeroDownloadButton />
            <NuxtLink class="signal-button signal-button-quiet" :to="docsPath('/quick-start/overview')">{{ copy.guide }} <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <p class="signal-platforms">
            <span>{{ copy.alsoOn }}</span>
            <span v-for="name in ['macOS', 'Windows', 'Linux', 'Android']" :key="name" class="signal-platform">{{ name }}</span>
            <a href="#download">{{ copy.allPlatforms }} →</a>
          </p>
        </div>

        <ProductDemo class="signal-hero-demo" />
      </div>
    </section>

    <ModelPlaza />

    <section id="capabilities" class="signal-section signal-capabilities" aria-labelledby="capabilities-title">
      <header class="signal-section-head">
        <div><p class="signal-section-index">{{ copy.labels.features }}</p><h2 id="capabilities-title">{{ copy.capabilitiesTitle }}</h2></div>
        <p>{{ copy.capabilitiesIntro }}</p>
      </header>

      <div class="signal-capability-stack">
        <article class="signal-capability-row">
          <div class="signal-capability-copy"><h3>{{ copy.features.computer.title }}</h3><p>{{ copy.features.computer.body }}</p></div>
          <div class="signal-tool-index">
            <div v-for="item in copy.toolIndex" :key="item.title"><strong>{{ item.title }}</strong><em>{{ item.meta }}</em></div>
          </div>
        </article>

        <article class="signal-capability-row">
          <div class="signal-capability-copy"><h3>{{ copy.features.knowledge.title }}</h3><p>{{ copy.features.knowledge.body }}</p></div>
          <div class="signal-knowledge-field">
            <div class="signal-knowledge-types"><span v-for="format in copy.knowledgeFormats" :key="format">{{ format }}</span></div>
            <div class="signal-knowledge-outcome"><span>{{ copy.knowledgeLabel }}</span><strong>{{ copy.knowledgeOutcome }}</strong></div>
          </div>
        </article>

        <article class="signal-capability-row">
          <div class="signal-capability-copy"><h3>{{ copy.features.automation.title }}</h3><p>{{ copy.features.automation.body }}</p></div>
          <div class="signal-run-sequence">
            <div v-for="item in copy.automation" :key="item.title"><span>{{ item.meta }}</span><strong>{{ item.title }}</strong><small>{{ item.body }}</small></div>
          </div>
        </article>
      </div>
    </section>

    <section id="continuity" class="signal-section signal-continuity" aria-labelledby="continuity-title">
      <div class="signal-continuity-copy">
        <p class="signal-section-index">{{ copy.labels.continuity }}</p>
        <h2 id="continuity-title">{{ copy.continuityTitle }}</h2>
        <p>{{ copy.continuityBody }}</p>
        <ul class="signal-continuity-ledger">
          <li v-for="channel in copy.continuityChannels" :key="channel.label">
            <strong>{{ channel.title }}</strong><small>{{ channel.meta }}</small>
          </li>
        </ul>
        <NuxtLink class="signal-text-link" :to="docsPath('/manual/overview')">{{ copy.continuityLink }} <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <div class="signal-continuity-stage">
        <PhoneDemo />
      </div>
    </section>

    <section id="download" class="signal-download" aria-labelledby="download-title">
      <div class="signal-download-head"><div><h2 id="download-title">{{ copy.downloadTitle }}</h2></div><div class="signal-download-meta"><VersionBadge :label="isZh ? '最新版本' : 'Latest version'" /><p>{{ copy.downloadBody }}</p></div></div>
      <div class="signal-download-groups" :data-mobile-first="detectedPlatform === 'android' || undefined">
        <div class="signal-download-group">
          <p>{{ copy.desktopGroup }}</p>
          <div class="signal-download-grid"><DownloadMacButton label="Apple Silicon / Intel" /><DownloadWindowsButton label="Windows 10+" /><DownloadLinuxButton label="AppImage" /></div>
        </div>
        <div class="signal-download-group">
          <p>{{ copy.mobileGroup }}</p>
          <div class="signal-download-grid signal-download-grid-mobile"><DownloadGooglePlayButton /><DownloadApkButton :label="copy.apkLabel" /></div>
        </div>
      </div>
    </section>

    <section id="resources" class="signal-section signal-resources" aria-labelledby="resources-title">
      <header class="signal-resources-head"><h2 id="resources-title">{{ copy.resourcesTitle }}</h2></header>
      <div class="signal-resource-grid"><NuxtLink v-for="item in copy.resources" :key="item.title" :to="docsPath(item.to)"><strong>{{ item.title }}</strong><small>{{ item.body }}</small><i>↗</i></NuxtLink></div>
      <div class="signal-community"><p>{{ copy.community }}</p><JoinQqGroupButton id-label="QQ">{{ copy.join }}</JoinQqGroupButton></div>
    </section>
  </div>
</template>
