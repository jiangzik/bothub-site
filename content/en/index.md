---
seo:
  title: BotHub - An AI workspace in terminal form
  description: BotHub - sign in to use frontier AI models and image generation, or bring your own keys, local tools, remote control, knowledge bases, scheduled tasks, and IM bots.
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
<p class="terminal-title-line">Frontier AI models + image generation, ready after sign-in</p>
<p class="terminal-meta-line">Desktop / Android / iOS · local-first · BYOK · MCP · IM Bot · remote control</p>
<version-badge label="Version"></version-badge>
</div>
<div class="terminal-preview-panel">
<div class="terminal-preview-title">preview --target=desktop / android</div>
<div class="terminal-preview-stage">
<img class="terminal-preview-image terminal-preview-image-light" src="/showcase/bothub-desktop-preview.png" alt="BotHub desktop interface" loading="eager" />
<img class="terminal-preview-image terminal-preview-image-dark" src="/showcase/bothub-desktop-preview-dark.png" alt="BotHub desktop dark interface" loading="eager" />
<div class="terminal-preview-subtitle">android --resume-anywhere</div>
<div class="terminal-android-preview">
<div class="terminal-phone-card"><img class="terminal-phone-shot terminal-phone-shot-light" src="/showcase/android-preview-welcome-light.png" alt="BotHub Android light welcome interface" loading="lazy" /><img class="terminal-phone-shot terminal-phone-shot-dark" src="/showcase/android-preview-welcome-dark.png" alt="BotHub Android dark welcome interface" loading="lazy" /><span>welcome.flow</span></div>
<div class="terminal-phone-card"><img class="terminal-phone-shot terminal-phone-shot-light" src="/showcase/android-preview-settings-light.png" alt="BotHub Android light settings interface" loading="lazy" /><img class="terminal-phone-shot terminal-phone-shot-dark" src="/showcase/android-preview-settings-dark.png" alt="BotHub Android dark settings interface" loading="lazy" /><span>settings.panel</span></div>
<div class="terminal-phone-card"><img class="terminal-phone-shot terminal-phone-shot-light" src="/showcase/android-preview-code-light.png" alt="BotHub Android light code review interface" loading="lazy" /><img class="terminal-phone-shot terminal-phone-shot-dark" src="/showcase/android-preview-code-dark.png" alt="BotHub Android dark code review interface" loading="lazy" /><span>code.review</span></div>
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
<div class="terminal-platform-row terminal-platform-head"><span>MODULE</span><span>DESCRIPTION</span><span>STATUS</span></div>
<div class="terminal-platform-row"><span>DESKTOP</span><span>macOS / Windows / Linux</span><span>primary workspace</span></div>
<div class="terminal-platform-row"><span>ANDROID</span><span>Google Play / APK</span><span>live</span></div>
<div class="terminal-platform-row"><span>CLOUD LINK</span><span>phone controls your PC</span><span>sign-in enabled</span></div>
<div class="terminal-platform-row"><span>iOS</span><span>chat + paired Mac tools</span><span>in progress</span></div>
</div>
<p class="terminal-caption">Desktop carries the heavy tool workflow. Android keeps the session moving, and signed-in cloud link lets your phone reach your computer.</p>
</div>

<div id="download" class="term-cmd term-cmd-primary"><span class="prompt">$ </span><span class="cmd-text">bothub --download --auto-source</span></div>
<div class="term-output term-output-primary">
<div class="terminal-download-grid">
<download-mac-button label="Apple Silicon / Intel"></download-mac-button>
<download-windows-button label="Win 10+"></download-windows-button>
<download-google-play-button label="Google Play"></download-google-play-button>
<download-apk-button label="APK sideload"></download-apk-button>
<download-linux-button label="AppImage · not fully tested"></download-linux-button>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --capabilities --summary</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-cap-grid">
<div class="terminal-cap-item"><strong>models.route</strong><span>Sign in for frontier models; bring your own key when you need deeper control.</span></div>
<div class="terminal-cap-item"><strong>image.gen</strong><span>Generate, edit, and iterate on images directly inside the chat flow.</span></div>
<div class="terminal-cap-item"><strong>tools.local</strong><span>Bash, files, browser, screenshots, clipboard, and MCP run with approval.</span></div>
<div class="terminal-cap-item"><strong>rag.index</strong><span>PDF, DOCX, XLSX, images, and web pages become knowledge-base context.</span></div>
<div class="terminal-cap-item"><strong>schedule.jobs</strong><span>Cron or countdown tasks let bots run on time and write results back.</span></div>
<div class="terminal-cap-item"><strong>im.bridge</strong><span>Feishu, Telegram, QQ, and WeChat can become BotHub entry points.</span></div>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --cloud-link</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-cloud-link">
<div class="terminal-cloud-status">Cloud link module loaded ... done</div>
<div class="terminal-cloud-block"><strong>PHONE -> PC</strong><span>Connect Android with your desktop, even across networks, then check status, run commands, and manage agents.</span></div>
<div class="terminal-cloud-block"><strong>REMOTE CONTROL</strong><span>Take over your desktop terminal and screen from your phone to keep Claude Code / Codex running.</span></div>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">ls ./docs ./community</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-doc-grid">
<a href="/en/quick-start/overview"><strong>[01] Quick Start</strong><span>Install, configure, and send your first message</span></a>
<a href="/en/manual/overview"><strong>[02] Manual</strong><span>Providers, context, MCP, skills, and scheduled tasks</span></a>
<a href="/en/faq/overview"><strong>[03] FAQ</strong><span>Download, install, network, and model-call fixes</span></a>
<a href="/en/faq/privacy-policy"><strong>[04] Privacy Policy</strong><span>Data collection scope, storage, and account deletion</span></a>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">tail -f workflows.log</span></div>
<div class="term-output term-output-secondary">
<div class="terminal-workflow-list">
<div><strong>Research</strong><span>Break down -> cross-check -> package conclusions</span></div>
<div><strong>Product Team</strong><span>Collect requirements -> compare options -> iterate reviews</span></div>
<div><strong>Remote Agent</strong><span>Trigger from phone -> execute on desktop -> send back to IM</span></div>
</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --community</span></div>
<div class="term-output term-output-secondary">
<p class="terminal-caption">Connecting to BotHub community network ... done</p>
<join-qq-group-button id-label="QQ Group">Join QQ Group</join-qq-group-button>
</div>

<div class="term-cursor-line"><span class="prompt">$ </span><span class="cursor-blink">_</span></div>

  </div>
</div>

#links
::
