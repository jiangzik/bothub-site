---
seo:
  title: BotHub — A local chat client with your own API keys
  description: BotHub — a local chat client that uses your own API keys. macOS, Windows, Android. iOS in progress.
---

<div class="bothub-landing">
<section class="bothub-hero">
<div class="bothub-hero-bg"></div>
<div class="bothub-hero-grid"></div>
<div class="bothub-container bothub-hero-inner">
<span class="bothub-eyebrow">
<span class="bothub-eyebrow-dot"></span>
<version-badge label="Version"></version-badge>
<span class="bothub-eyebrow-sep">·</span>
<span>Now on Google Play</span>
</span>
<h1 class="bothub-hero-title">Your keys. Your data.<br/>Chat with <em>any model</em>.</h1>
<p class="bothub-hero-lead">A local chat client that uses your own API keys. Switch models, run bash, drive a browser, schedule tasks, or spin up a group of bots that work together. Desktop · Android · iOS.</p>
<div class="bothub-hero-cta">
<a href="#download" class="bothub-btn bothub-btn-primary">Download</a>
<a href="#features" class="bothub-btn bothub-btn-ghost">See features →</a>
</div>
<div class="bothub-hero-meta">
<span>Local-first · End-to-end sync</span>
<span class="bothub-hero-sep">·</span>
<span>macOS · Windows · Android · iOS (soon)</span>
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
<h4>Projects</h4>
<ul>
<li class="dim">· Site redesign</li>
<li class="dim">· Daily digest</li>
<li class="dim">· Research brief</li>
</ul>
<h4>Groups</h4>
<ul>
<li class="dim">· Product review</li>
</ul>
</aside>
<div class="bothub-mock-main">
<div class="bothub-mock-chat">
<div class="bothub-msg user">Pull the top AI news from the past week into a daily brief.</div>
<div class="bothub-msg bot">
Sure — fanning out to a few sources and writing to <code>~/reports</code>.
<div><span class="bothub-tool">🔧 web_search · "AI news past 7 days"</span></div>
<div><span class="bothub-tool">🔧 web_fetch · techcrunch.com/ai</span></div>
<div><span class="bothub-tool">🔧 write_file · ~/reports/ai-daily-0417.md</span></div>
</div>
<div class="bothub-msg user">Nice. Schedule this to run 9am every day.</div>
<div class="bothub-msg bot">Done — <code>cron 0 9 * * *</code>. Brief lands in your inbox daily at 9:00.</div>
</div>
<div class="bothub-mock-input">
<span>Type a message, or press / for skills…</span>
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
<div class="bothub-logos-label">Every major provider · Bring your own key, pay by usage</div>
<div class="bothub-logos-row">
<span>OpenAI</span>
<span>Anthropic</span>
<span>Google Gemini</span>
<span>DeepSeek</span>
<span>SiliconFlow</span>
<span>Ollama</span>
<span>OpenAI-compatible</span>
</div>
</div>
</div>
<section id="features" class="bothub-section">
<div class="bothub-container">
<div class="bothub-section-head">
<div class="bothub-section-eyebrow">Built for power users</div>
<h2>One client, every AI tool you need</h2>
<p>Not a reverse proxy. Not a subscription. Your requests go straight to the model provider, your data stays local.</p>
</div>
<div class="bothub-features">
<div class="bothub-feature">
<div class="bothub-feature-icon">⚡</div>
<h3>Bring your own key</h3>
<p>OpenAI, Anthropic, Google, DeepSeek, Ollama — or any OpenAI-compatible endpoint. Multi-key rotation. Pay by usage, no middleman.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">⇄</div>
<h3>Switch models anytime</h3>
<p>Swap models mid-conversation without starting over. Each bot can bind to a different model — match the model to the task.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">🛠</div>
<h3>Tool use, built in</h3>
<p>Bash, file I/O, browser automation, screenshot, clipboard, system info. Need more? Plug in any MCP server.</p>
<div class="bothub-feature-meta">desktop-only · macOS · Windows</div>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">📚</div>
<h3>Knowledge base RAG</h3>
<p>Upload PDFs, DOCX, XLSX, images, or web pages. Vector search + semantic rerank + entity graph, injected into context automatically.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">⚙</div>
<h3>Skills & MCP</h3>
<p>Save workflows as skills or import from GitHub. Connect any MCP server, with per-tool approval policies.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">⏱</div>
<h3>Scheduled tasks</h3>
<p>Cron or countdown. The bot runs on its own. Results flow back to the chat, or out to Webhook / Feishu / Telegram.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">💬</div>
<h3>Group chats with bots</h3>
<p>Create a group, add a few bots. Each member has its own model and prompt. They can @-mention and quote each other.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">◈</div>
<h3>Parallel sub-agents</h3>
<p>Bots can split a task into sub-agents and run them in parallel. Complex work doesn't block on a single thread.</p>
</div>
<div class="bothub-feature">
<div class="bothub-feature-icon">📲</div>
<h3>Run Claude Code / Codex from your phone</h3>
<p>Sign in on your phone and you're already connected to your Mac or Windows at home or at work. Open a terminal, run Claude Code or Codex, approve actions, watch output — all from your pocket. Works across networks.</p>
<div class="bothub-feature-meta">mobile → desktop</div>
</div>
</div>
</div>
</section>
<section id="platforms" class="bothub-section bothub-section-tight">
<div class="bothub-container">
<div class="bothub-section-head">
<div class="bothub-section-eyebrow">Platforms</div>
<h2>Desktop is full-featured. Android isn't stripped down.</h2>
<p>The core experience is the same across platforms. Each one has exclusive capabilities of its own.</p>
</div>
<div class="bothub-platform-matrix">
<div class="bothub-plat-card featured">
<div class="bothub-plat-head">
<div class="bothub-plat-name">🖥 Desktop</div>
<span class="bothub-plat-badge">FULL</span>
</div>
<ul>
<li>Bash / filesystem / browser automation</li>
<li>Clipboard / screenshot / system control</li>
<li>Embedded terminal, controllable from your phone</li>
<li>Feishu / Telegram / QQ / WeChat bots</li>
<li>Local file attachments up to 10 MB</li>
<li>macOS · Windows</li>
</ul>
</div>
<div class="bothub-plat-card">
<div class="bothub-plat-head">
<div class="bothub-plat-name">📱 Android</div>
<span class="bothub-plat-badge">GOOGLE PLAY</span>
</div>
<ul>
<li>Run Claude Code / Codex on your PC from your phone</li>
<li>Computer-control agent (screen + gestures)</li>
<li>Share-sheet handler: Ask / Translate / Summarize / Rewrite</li>
<li>System TTS · floating agent overlay</li>
<li>Cloud sync, group chat, sub-agents</li>
<li>Google Play · APK sideload</li>
</ul>
</div>
<div class="bothub-plat-card">
<div class="bothub-plat-head">
<div class="bothub-plat-name">🍎 iOS</div>
<span class="bothub-plat-badge soon">Coming</span>
</div>
<ul>
<li>Core chat · cloud sync</li>
<li>Tool capabilities via paired Mac desktop</li>
<li>TestFlight invite coming</li>
</ul>
</div>
</div>
<div class="bothub-integrations">
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>Feishu Bot</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>Telegram</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>QQ Guild</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>WeChat iLink</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>Outbound Webhook</span>
<span class="bothub-int-chip"><span class="bothub-int-dot"></span>S3 / WebDAV backup</span>
</div>
</div>
</section>
<section id="download" class="bothub-section bothub-section-tight">
<div class="bothub-container">
<div class="bothub-download-box">
<div class="bothub-download-left">
<div class="bothub-section-eyebrow">Download · no signup</div>
<h2>Pick a platform, start now</h2>
<p class="bothub-download-lead">Free trial credits out of the box. Plug in your own API key when you're ready for more.</p>
</div>
<div class="bothub-download-right">
<download-mac-button label="Apple Silicon / Intel"></download-mac-button>
<download-windows-button label="Win 10+"></download-windows-button>
<download-google-play-button label="Recommended"></download-google-play-button>
<download-apk-button label="APK · sideload"></download-apk-button>
</div>
<div class="bothub-version-line"><version-badge label=""></version-badge> · latest release</div>
</div>
</div>
</section>
<section id="resources" class="bothub-section bothub-section-tight">
<div class="bothub-container">
<div class="bothub-section-head">
<div class="bothub-section-eyebrow">Resources</div>
<h2>Need help?</h2>
<p>Quick start, manual, FAQ, and account.</p>
</div>
<div class="bothub-link-grid">
<a class="bothub-link-card" href="/en/quick-start/overview">
<h4>Quick Start<span class="arrow">→</span></h4>
<p>5-minute walkthrough: install, add key, first message.</p>
</a>
<a class="bothub-link-card" href="/en/manual/overview">
<h4>Manual<span class="arrow">→</span></h4>
<p>Providers, chat & context, MCP, skills, scheduled tasks.</p>
</a>
<a class="bothub-link-card" href="/en/faq/overview">
<h4>FAQ<span class="arrow">→</span></h4>
<p>Downloads, installation issues, API errors, and more.</p>
</a>
<a class="bothub-link-card" href="/en/faq/privacy-policy">
<h4>Privacy & account<span class="arrow">→</span></h4>
<p>What we collect, where it's stored, and how to delete your cloud account.</p>
</a>
</div>
<div class="bothub-community">
<join-qq-group-button id-label="QQ Group">Join QQ Community</join-qq-group-button>
</div>
</div>
</section>
</div>
