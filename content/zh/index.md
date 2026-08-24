---
seo:
  title: BotHub - 终端里的 AI 工作台
  description: BotHub 官网 - 登录即可使用一线 AI 模型与生图能力，也支持自带 Key、本地工具调用、远程控制、知识库、定时任务和 IM 机器人。
---

::u-page-hero{class="terminal-landing-hero"}
#title
<div class="terminal-window terminal-window-home">
  <div class="terminal-titlebar">
    <span class="terminal-dot red"></span>
    <span class="terminal-dot yellow"></span>
    <span class="terminal-dot green"></span>
    <span class="terminal-titlebar-title">BOTHUB TERMINAL</span>
  </div>
  <div class="terminal-body terminal-home-body">

<div class="term-cmd term-cmd-primary"><span class="prompt">$ </span><span class="cmd-text">cat /etc/bothub/motd</span></div>
<div class="term-output term-output-primary">
<div class="terminal-hero-layout">
<div class="terminal-hero-copy">
<div class="ascii-logo" role="img" aria-label="BotHub">
 ██████╗  ██████╗ ████████╗██╗  ██╗██╗   ██╗██████╗
 ██╔══██╗██╔═══██╗╚══██╔══╝██║  ██║██║   ██║██╔══██╗
 ██████╔╝██║   ██║   ██║   ███████║██║   ██║██████╔╝
 ██╔══██╗██║   ██║   ██║   ██╔══██║██║   ██║██╔══██╗
 ██████╔╝╚██████╔╝   ██║   ██║  ██║╚██████╔╝██████╔╝
 ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝
</div>
<p class="terminal-title-line">登录即用的一线 AI 模型 + 生图客户端</p>
<p class="terminal-meta-line">Desktop / Android / iOS · 本地优先 · 自带 Key · MCP · IM Bot · 远程控制</p>
<version-badge label="版本"></version-badge>
</div>
<div class="terminal-preview-panel">
<div class="terminal-preview-title">预览 --目标=桌面端 / Android</div>
<div class="terminal-preview-stage">
<img class="terminal-preview-image terminal-preview-image-light" src="/showcase/bothub-desktop-preview.png" alt="BotHub 桌面端界面" loading="eager" />
<img class="terminal-preview-image terminal-preview-image-dark" src="/showcase/bothub-desktop-preview-dark.png" alt="BotHub 桌面端深色界面" loading="eager" />
<div class="terminal-preview-subtitle">android --随身继续</div>
<div class="terminal-android-preview">
<div class="terminal-phone-card"><img class="terminal-phone-shot terminal-phone-shot-light" src="/showcase/android-preview-welcome-light.png" alt="BotHub Android 浅色欢迎界面" loading="lazy" /><img class="terminal-phone-shot terminal-phone-shot-dark" src="/showcase/android-preview-welcome-dark.png" alt="BotHub Android 深色欢迎界面" loading="lazy" /><span>welcome.flow</span></div>
<div class="terminal-phone-card"><img class="terminal-phone-shot terminal-phone-shot-light" src="/showcase/android-preview-settings-light.png" alt="BotHub Android 浅色设置界面" loading="lazy" /><img class="terminal-phone-shot terminal-phone-shot-dark" src="/showcase/android-preview-settings-dark.png" alt="BotHub Android 深色设置界面" loading="lazy" /><span>settings.panel</span></div>
<div class="terminal-phone-card"><img class="terminal-phone-shot terminal-phone-shot-light" src="/showcase/android-preview-code-light.png" alt="BotHub Android 浅色代码修复界面" loading="lazy" /><img class="terminal-phone-shot terminal-phone-shot-dark" src="/showcase/android-preview-code-dark.png" alt="BotHub Android 深色代码修复界面" loading="lazy" /><span>code.review</span></div>
</div>
</div>
<div class="terminal-preview-log">
<span>model.route: ready</span>
<span>image.gen: enabled</span>
<span>android.client: ready</span>
<span>local.tools: approval required</span>
</div>
</div>
</div>
</div>

<div class="term-cmd term-cmd-primary"><span class="prompt">$ </span><span class="cmd-text">bothub --platforms</span></div>
<div class="term-output term-output-primary">
<div class="terminal-platform-table">
<div class="terminal-platform-row terminal-platform-head"><span>模块</span><span>描述</span><span>状态</span></div>
<div class="terminal-platform-row"><span>DESKTOP</span><span>macOS / Windows / Linux</span><span>主力工作台</span></div>
<div class="terminal-platform-row"><span>ANDROID</span><span>Google Play / APK</span><span>已可使用</span></div>
<div class="terminal-platform-row"><span>CLOUD LINK</span><span>手机远程接管电脑</span><span>登录后启用</span></div>
<div class="terminal-platform-row"><span>iOS</span><span>核心对话与 Mac 工具共享</span><span>筹备中</span></div>
</div>
<p class="terminal-caption">桌面端负责重工具流，Android 负责随身继续工作；登录后还能从手机远程连接电脑。</p>
</div>

<div id="download" class="term-cmd term-cmd-primary"><span class="prompt">$ </span><span class="cmd-text">bothub --download --auto-source</span></div>
<div class="term-output term-output-primary">
<div class="terminal-download-grid">
<download-mac-button label="Apple Silicon / Intel"></download-mac-button>
<download-windows-button label="Win 10+"></download-windows-button>
<download-google-play-button label="Google Play"></download-google-play-button>
<download-apk-button label="APK 直装"></download-apk-button>
<download-linux-button label="AppImage · 未充分测试"></download-linux-button>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --capabilities --summary</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-cap-grid">
<div class="terminal-cap-item"><strong>models.route</strong><span>登录即可用一线模型；需要更高控制时可自带 Key。</span></div>
<div class="terminal-cap-item"><strong>image.gen</strong><span>文生图、改图、连续追问，直接沉在聊天流程里。</span></div>
<div class="terminal-cap-item"><strong>tools.local</strong><span>Bash、文件、浏览器、截屏、剪贴板和 MCP 按需审批。</span></div>
<div class="terminal-cap-item"><strong>rag.index</strong><span>PDF / DOCX / XLSX / 图片 / 网页进入知识库上下文。</span></div>
<div class="terminal-cap-item"><strong>schedule.jobs</strong><span>Cron 或倒计时让 Bot 到点自己跑，结果回写对话。</span></div>
<div class="terminal-cap-item"><strong>im.bridge</strong><span>飞书、Telegram、QQ、微信都能作为 BotHub 入口。</span></div>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --cloud-link</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-cloud-link">
<div class="terminal-cloud-status">Cloud link module loaded ... done</div>
<div class="terminal-cloud-block"><strong>PHONE -> PC</strong><span>Android 连接桌面端，不在同一网络也能查看状态、执行命令、管理 Agent。</span></div>
<div class="terminal-cloud-block"><strong>REMOTE CONTROL</strong><span>出门在外也能用手机接管桌面终端和屏幕，继续跑 Claude Code / Codex。</span></div>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">ls ./docs ./community</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-doc-grid">
<a href="/zh/quick-start/overview"><strong>[01] 快速开始</strong><span>安装、配置、发出第一条消息</span></a>
<a href="/zh/manual/overview"><strong>[02] 使用手册</strong><span>提供商、上下文、MCP、技能、定时任务</span></a>
<a href="/zh/faq/overview"><strong>[03] 常见问题</strong><span>下载、安装、网络和模型调用排查</span></a>
<a href="/zh/faq/privacy-policy"><strong>[04] 隐私政策</strong><span>数据收集范围、存储方式与账号删除</span></a>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">tail -f workflows.log</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-workflow-list">
<div><strong>个人研究</strong><span>问题拆解 -> 交叉验证 -> 结论沉淀</span></div>
<div><strong>产品团队</strong><span>需求整理 -> 方案对比 -> 评审迭代</span></div>
<div><strong>远程 Agent</strong><span>手机触发 -> 桌面执行 -> IM 回传结果</span></div>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --community</span></div>
<div class="term-output term-output-secondary">
<p class="terminal-caption">连接到 BotHub 社区网络 ... 完成</p>
<join-qq-group-button id-label="QQ群">加入 QQ 群</join-qq-group-button>
</div>

<div class="term-cursor-line"><span class="prompt">$ </span><span class="cursor-blink">_</span></div>

  </div>
</div>

#links
::
