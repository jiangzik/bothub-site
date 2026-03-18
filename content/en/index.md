---
seo:
  title: BotHub
  description: BotHub — a chat client that uses your own API keys. Desktop and Android.
---

::u-page-hero{class="terminal-landing-hero"}
#title
<div class="terminal-window">
  <div class="terminal-titlebar">
    <span class="terminal-dot red"></span>
    <span class="terminal-dot yellow"></span>
    <span class="terminal-dot green"></span>
    <span class="terminal-titlebar-title">BOTHUB TERMINAL</span>
  </div>
  <div class="terminal-body">

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">cat /etc/bothub/motd</span></div>
<div class="term-output">
<pre style="font-size:clamp(0.35rem,1.8vw,0.9rem);line-height:1.15;overflow-x:auto;color:var(--terra);">
 ██████╗  ██████╗ ████████╗██╗  ██╗██╗   ██╗██████╗
 ██╔══██╗██╔═══██╗╚══██╔══╝██║  ██║██║   ██║██╔══██╗
 ██████╔╝██║   ██║   ██║   ███████║██║   ██║██████╔╝
 ██╔══██╗██║   ██║   ██║   ██╔══██║██║   ██║██╔══██╗
 ██████╔╝╚██████╔╝   ██║   ██║  ██║╚██████╔╝██████╔╝
 ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝
</pre>
<p style="margin:8px 0 4px;color:var(--ink);font-size:14px;font-weight:700;">Chat with any model, using your own keys</p>
<p style="color:var(--text-muted);font-size:12px;">Desktop / Android / iOS &nbsp;|&nbsp; Data stays on your device &nbsp;|&nbsp; Bring your own API keys</p>
<version-badge label="Version"></version-badge>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --download</span></div>
<div class="term-output">
<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">Select target platform to install:</p>
<div style="display:flex;flex-wrap:wrap;gap:8px;">

:::download-mac-button
macOS
:::

:::download-windows-button
Windows
:::

:::download-linux-button
Linux
:::

:::download-apk-button
Android
:::

</div>
<p style="color:var(--text-muted);font-size:12px;margin-top:8px;">Desktop has the most features. Android is live. iOS is in progress.</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --capabilities</span></div>
<div class="term-output">
<pre>
Loaded 6 modules:

-- Multi-model switching -------------------------------------------
  Use models from different providers in one place
  Add your API keys for OpenAI, Claude, Gemini, etc. Switch models mid-conversation.
  · Dozens of providers  · Switch models anytime  · Each bot can use a different model

-- MCP tools -------------------------------------------------------
  Let models use files, browsers, and search
  Connect MCP servers so models can read/write files, control a browser, or search the web.
  · Filesystem access  · Browser automation (Playwright)  · Web search

-- Prompts & skills ------------------------------------------------
  Save prompts you use often
  Store prompts as templates and reuse them. Skills let you chain multi-step actions.
  · Prompt template library  · Reusable skills  · Per-scenario parameters

-- Scheduled tasks -------------------------------------------------
  Let bots run on a schedule
  Set a time, and the bot runs the conversation or task automatically.
  · Cron-like scheduling  · Auto-execution  · Run history

-- Group chats -----------------------------------------------------
  Multiple bots in one conversation
  Create a group, add bots with different models, and let them each respond.
  · Multiple bots  · Different models side by side  · Good for comparison

-- Local storage ---------------------------------------------------
  Chat history stays on your device
  All conversations, configs, and attachments are stored locally. Works without an account.
  · Local SQLite  · API keys never touch our servers  · Optional cloud sync
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --cloud-link</span></div>
<div class="term-output">
<pre>
Cloud link module loaded ... done

-- Phone → PC ------------------------------------------------------
  Scan a QR code to pair
  Sign in on Android, scan the code on your desktop, and your phone connects to your PC.
  · QR pairing  · Works across networks  · Live connection status

-- Remote control --------------------------------------------------
  Use your PC from your phone
  Open a terminal, run commands, view the screen, manage agent tasks — all from your phone.
  · Remote terminal  · Screen viewing  · Manage multiple PCs
</pre>
<p style="color:var(--text-muted);font-size:12px;">Sign in to use cloud link. Without an account, everything else works — data stays local.</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --integrations</span></div>
<div class="term-output">
<pre>
Desktop supports chat platform bots:

  · Feishu Bot — works in Feishu groups, with approval workflows
  · Telegram Bot — connect to Telegram
  · QQ Bot — connect to QQ

Once configured, messages in the group trigger bot replies and task execution.
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --docs</span></div>
<div class="term-output">
<pre>
Loading doc index ... done

  <a href="en/quick-start/overview">[01] Quick Start .......... Install, set up, send your first message</a>
  <a href="en/manual/overview">[02] Manual ............... Provider setup, chat flow, context behavior</a>
  <a href="en/faq/overview">[03] FAQ .................. Common issues with downloads, network, and calls</a>
  <a href="en/faq/privacy-policy">[04] Privacy Policy ....... What data we collect and how we store it</a>
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --community</span></div>
<div class="term-output">
<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">Connecting to BotHub community network ... done</p>

:::join-qq-group-button{id-label="QQ Group"}
Join QQ Community
:::

</div>

<div class="term-cursor-line"><span class="prompt" style="color:var(--sage);">$ </span><span class="cursor-blink">_</span></div>

  </div>
</div>

#links
::
