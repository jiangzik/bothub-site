---
seo:
  title: BotHub — 本地聊天客户端，接你自己的 Key
  description: BotHub 官网 — 一个本地聊天客户端，接自己的 API Key，支持 macOS、Windows、Android，iOS 筹备中。
---

<div class="bothub-landing">
<section class="bothub-hero">
<div class="bothub-hero-bg"></div>
<div class="bothub-hero-grid"></div>
<div class="bothub-container bothub-hero-inner">
<span class="bothub-eyebrow">
<span class="bothub-eyebrow-dot"></span>
<version-badge label="版本"></version-badge>
<span class="bothub-eyebrow-sep">·</span>
<span>Google Play 已上架</span>
</span>
<h1 class="bothub-hero-title">你的 Key，你的数据<br/>和<em>所有模型</em>聊天</h1>
<p class="bothub-hero-lead">一个本地聊天客户端 — 接你自己的 API Key，切换模型、跑 bash、操控浏览器、跑定时任务、建群让多个 Bot 互相协作。桌面 · Android · iOS。</p>
<div class="bothub-hero-cta">
<a href="#download" class="bothub-btn bothub-btn-primary">立即下载</a>
<a href="#features" class="bothub-btn bothub-btn-ghost">查看功能 →</a>
</div>
<div class="bothub-hero-meta">
<span>本地优先 · 端到端同步</span>
<span class="bothub-hero-sep">·</span>
<span>macOS · Windows · Android · iOS（筹备中）</span>
</div>
<div class="bothub-mock-wrap">
<div class="bothub-mock-glow"></div>
<div class="bothub-mock">
<div class="bothub-mock-bar">
<span class="bothub-mock-dot r"></span><span class="bothub-mock-dot y"></span><span class="bothub-mock-dot g"></span>
<span class="bothub-mock-title">BotHub · ~/projects/site-redesign</span>
</div>
<div class="bothub-mock-body">
<aside class="bothub-mock-side">
<h4>Bots</h4>
<ul>
<li class="active"><span class="bothub-avatar bothub-avatar-1">K</span>Kira · Claude Opus</li>
<li><span class="bothub-avatar bothub-avatar-2">R</span>Rex · GPT-5</li>
<li><span class="bothub-avatar bothub-avatar-3">N</span>Nova · Gemini 2.5</li>
</ul>
<h4>项目</h4>
<ul>
<li class="dim">· 网站改版</li>
<li class="dim">· 每日晨报</li>
<li class="dim">· 研究速览</li>
</ul>
<h4>群聊</h4>
<ul>
<li class="dim">· 产品评审室</li>
</ul>
</aside>
<div class="bothub-mock-main">
<div class="bothub-mock-chat">
<div class="bothub-msg user">帮我查下最近一周 AI 圈的大新闻，整理成日报。</div>
<div class="bothub-msg bot">
好，从几个来源汇总，写到 <code>~/reports</code>。
<div><span class="bothub-tool">🔧 web_search · "AI news past 7 days"</span></div>
<div><span class="bothub-tool">🔧 web_fetch · techcrunch.com/ai</span></div>
<div><span class="bothub-tool">🔧 write_file · ~/reports/ai-daily-0417.md</span></div>
</div>
<div class="bothub-msg user">不错，配个定时任务每天早上 9 点自动跑一次。</div>
<div class="bothub-msg bot">已创建 <code>cron 0 9 * * *</code>，每天 9:00 自动汇总并发到你邮箱。</div>
</div>
<div class="bothub-mock-input">
<span>输入消息，或按 / 插入技能…</span>
<span class="bothub-model-chip">claude-opus-4-7</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<div class="bothub-logos">
<div class="bothub-container">
<div class="bothub-logos-label">支持所有主流模型厂商 · 自带 Key，按量计费</div>
<div class="bothub-logos-row">
<span>OpenAI</span>
<span>Anthropic</span>
<span>Google Gemini</span>
<span>DeepSeek</span>
<span>硅基流动</span>
<span>Ollama</span>
<span>OpenAI 兼容端点</span>
</div>
</div>
</div>
<section id="features" class="bothub-section">
<div class="bothub-container">
<div class="bothub-section-head">
<div class="bothub-section-eyebrow">Built for power users</div>
<h2>一个客户端，把 AI 工具链装进来</h2>
<p>不是聚合转发，不是订阅服务。请求直达模型厂商，数据存你本地。</p>
</div>
<div class="bothub-features">
<div class="bothub-feature">
<div class="bothub-feature-icon">⚡</div>
<h3>自带 API Key</h3>
<p>OpenAI、Anthropic、Google、DeepSeek、Ollama，或任意 OpenAI 兼容端点。多 Key 轮询，按量计费，无中间商。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">⇄</div>
<h3>随时切换模型</h3>
<p>聊到一半换模型不用新建对话。每个 Bot 可以绑不同模型，不同任务用不同模型。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">🛠</div>
<h3>工具调用</h3>
<p>bash、文件读写、浏览器自动化、截屏、剪贴板、系统信息。模型不够用？接 MCP Server 扩展。</p>
<div class="bothub-feature-meta">desktop-only · macOS · Windows</div>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">📚</div>
<h3>知识库 RAG</h3>
<p>上传 PDF / DOCX / XLSX / 图片 / 网页，向量检索 + 语义重排 + 实体图谱，自动注入上下文。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">⚙</div>
<h3>技能 & MCP</h3>
<p>把常用操作存成技能，从 GitHub 一键导入。接任意 MCP Server，工具按需授权，每次可审批。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">⏱</div>
<h3>定时任务</h3>
<p>Cron 或倒计时，Bot 到点自己跑。结果写回对话，或推送到 Webhook / 飞书 / Telegram。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">💬</div>
<h3>群聊多 Bot</h3>
<p>建群，拉几个 Bot 进来，每个成员可以有不同模型和提示词，互相 @ 引用、接力回复。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">◈</div>
<h3>子代理并发</h3>
<p>Bot 干活时自己拆任务，派子代理并行跑，结果汇总。复杂任务不用干等。</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">📲</div>
<h3>手机远程跑 Claude Code / Codex</h3>
<p>手机登录同一个账号，就能连回家里或公司的 Mac / Win。开终端、跑 Claude Code 或 Codex、审批操作、看输出，都在口袋里搞定。不在同一个网络也能连。</p>
<div class="bothub-feature-meta">mobile → desktop</div>
</div>
</div>
</div>
</section>
<section id="platforms" class="bothub-section bothub-section-tight">
<div class="bothub-container">
<div class="bothub-section-head">
<div class="bothub-section-eyebrow">Platforms</div>
<h2>桌面端功能最全，Android 不缩水</h2>
<p>核心体验三端一致。每端都有各自的独家能力。</p>
</div>
<div class="bothub-platform-matrix">
<div class="bothub-plat-card featured">
<div class="bothub-plat-head">
<div class="bothub-plat-name">🖥 Desktop</div>
<span class="bothub-plat-badge">FULL</span>
</div>
<ul>
<li>Bash / 文件 / 浏览器自动化</li>
<li>剪贴板 / 截屏 / 系统控制</li>
<li>嵌入式终端，可被手机远程接管</li>
<li>飞书 / Telegram / QQ / 微信机器人</li>
<li>本地文件附件最大 10 MB</li>
<li>macOS · Windows</li>
</ul>
</div>
<div class="bothub-plat-card">
<div class="bothub-plat-head">
<div class="bothub-plat-name">📱 Android</div>
<span class="bothub-plat-badge">GOOGLE PLAY</span>
</div>
<ul>
<li>用手机跑电脑上的 Claude Code / Codex</li>
<li>电脑控制 Agent（屏幕 + 手势）</li>
<li>系统分享处理：Ask / 翻译 / 总结 / 改写</li>
<li>系统 TTS 朗读回复 · 悬浮 Agent UI</li>
<li>云同步、群聊、子代理</li>
<li>Google Play · APK 直装</li>
</ul>
</div>
<div class="bothub-plat-card">
<div class="bothub-plat-head">
<div class="bothub-plat-name">🍎 iOS</div>
<span class="bothub-plat-badge soon">筹备中</span>
</div>
<ul>
<li>核心对话 · 云同步</li>
<li>通过 Mac 桌面共享工具能力</li>
<li>上架时间：等 TestFlight 通知</li>
</ul>
</div>
</div>
<div class="bothub-integrations">
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>飞书 Bot</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>Telegram</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>QQ 频道</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>微信 iLink</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>Webhook 出站</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>S3 / WebDAV 备份</span>
</div>
</div>
</section>
<section id="download" class="bothub-section bothub-section-tight">
<div class="bothub-container">
<div class="bothub-download-box">
<div class="bothub-download-left">
<div class="bothub-section-eyebrow">下载 · 无需注册</div>
<h2>选一个平台，现在就用</h2>
<p class="bothub-download-lead">开箱自带免费额度。想用更多模型，再填自己的 API Key。</p>
</div>
<div class="bothub-download-right">
<download-mac-button label="Apple Silicon / Intel"></download-mac-button>
<download-windows-button label="Win 10+"></download-windows-button>
<download-google-play-button label="推荐"></download-google-play-button>
<download-apk-button label="APK · 直装"></download-apk-button>
</div>
<div class="bothub-version-line"><version-badge label=""></version-badge> · 最新发布</div>
</div>
</div>
</section>
<section id="resources" class="bothub-section bothub-section-tight">
<div class="bothub-container">
<div class="bothub-section-head">
<div class="bothub-section-eyebrow">Resources</div>
<h2>需要帮助？</h2>
<p>快速开始、功能手册、FAQ、隐私与账号。</p>
</div>
<div class="bothub-link-grid">
<a class="bothub-link-card" href="/zh/quick-start/overview">
<h4>快速开始<span class="arrow">→</span></h4>
<p>5 分钟跑通：安装、填 Key、发第一条消息。</p>
</a>
<a class="bothub-link-card" href="/zh/manual/overview">
<h4>功能手册<span class="arrow">→</span></h4>
<p>API 提供商、对话与上下文、MCP、技能、定时任务。</p>
</a>
<a class="bothub-link-card" href="/zh/faq/overview">
<h4>常见问题<span class="arrow">→</span></h4>
<p>下载慢、安装报错、API 失败等常见处理。</p>
</a>
<a class="bothub-link-card" href="/zh/faq/privacy-policy">
<h4>隐私 & 账号删除<span class="arrow">→</span></h4>
<p>我们收集什么、存在哪，以及如何删除云端账号。</p>
</a>
</div>
<div class="bothub-community">
<join-qq-group-button id-label="QQ群">加入 QQ 社区</join-qq-group-button>
</div>
</div>
</section>
</div>
