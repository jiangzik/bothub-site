---
seo:
  title: BotHub
  description: BotHub 官网 — 一个聊天客户端，接你自己的 API Key，支持桌面和 Android。
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
<pre class="term-ascii">
 ██████╗  ██████╗ ████████╗██╗  ██╗██╗   ██╗██████╗
 ██╔══██╗██╔═══██╗╚══██╔══╝██║  ██║██║   ██║██╔══██╗
 ██████╔╝██║   ██║   ██║   ███████║██║   ██║██████╔╝
 ██╔══██╗██║   ██║   ██║   ██╔══██║██║   ██║██╔══██╗
 ██████╔╝╚██████╔╝   ██║   ██║  ██║╚██████╔╝██████╔╝
 ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝
</pre>
<p class="term-output-title">用自己的 Key，和各家模型聊天</p>
<p class="term-output-note">Desktop / Android / iOS &nbsp;|&nbsp; 数据存本地 &nbsp;|&nbsp; 接多家 API</p>
<version-badge label="版本"></version-badge>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --download</span></div>
<div class="term-output">
<p class="term-output-note term-output-note--spaced">选择目标平台执行安装:</p>
<div class="term-output-actions">

:::download-mac-button
macOS
:::

:::download-windows-button
Windows
:::

:::download-google-play-button
Google Play
:::

:::download-apk-button
APK
:::

</div>
<p class="term-output-note term-output-note--top-spaced">桌面端功能最全，Android 已上线，iOS 还在做。</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --capabilities</span></div>
<div class="term-output">
<pre>
已加载 6 个模块:

-- 多模型切换 ------------------------------------------------------
  一个界面里用多家的模型
  填好 API Key 就能用 OpenAI、Claude、Gemini 等，对话中间随时切。
  · 支持几十家服务商  · 对话中途换模型  · 每个 Bot 可以绑不同模型

-- MCP 工具 --------------------------------------------------------
  让模型能操作文件、浏览器、搜索
  接入 MCP Server 后，模型可以读写文件、控浏览器、查网页，不只是聊天。
  · 接文件系统  · 接浏览器 (Playwright)  · 接搜索引擎

-- 提示词和技能 ----------------------------------------------------
  把常用的提问方式存下来
  写好的提示词存成模板，下次直接用；技能系统可以组合多步操作。
  · 提示词模板库  · 可复用技能  · 按场景配参数

-- 定时任务 --------------------------------------------------------
  让 Bot 自己定时跑
  设好时间，Bot 会按计划自动执行对话或任务，不用盯着。
  · 定时触发  · 自动执行  · 查看运行记录

-- 群组对话 --------------------------------------------------------
  多个 Bot 在同一个对话里协作
  建一个群聊，拉几个不同模型的 Bot 进来，各自回答，互相补充。
  · 多 Bot 同场  · 不同模型各答各的  · 适合对比和讨论

-- 数据本地存 ------------------------------------------------------
  聊天记录默认不上传
  所有对话、配置、附件都存在你自己的设备上，不登录也能用全部功能。
  · 本地 SQLite 存储  · API Key 不经过我们的服务器  · 可选云同步
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --cloud-link</span></div>
<div class="term-output">
<pre>
已加载云连接模块 ... 完成

-- 手机连电脑 ------------------------------------------------------
  扫个码就能配对
  在 Android 上登录账号，扫桌面端的二维码，手机就能连上电脑。
  · 扫码配对  · 跨网络可用  · 连接状态实时显示

-- 远程控制 --------------------------------------------------------
  在手机上操作电脑
  出门也能用手机打开终端、执行命令、看屏幕、管理 Agent 任务。
  · 远程终端  · 远程看屏幕  · 同时管多台电脑
</pre>
<p class="term-output-note">登录后可用云连接；不登录一样用，数据留在本地。</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --integrations</span></div>
<div class="term-output">
<pre>
桌面端支持接入聊天平台机器人:

  · 飞书 Bot — 在飞书群里用，支持审批流程
  · Telegram Bot — 接 Telegram
  · QQ Bot — 接 QQ

配置好之后，群里发消息就能触发 Bot 回复和任务执行。
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --docs</span></div>
<div class="term-output">
<pre>
读取文档索引 ... 完成

  <a href="zh/quick-start/overview">[01] 快速开始 ............. 装好、配好、发出第一条消息</a>
  <a href="zh/manual/overview">[02] 使用手册 ............. 配置服务商、对话流程、上下文机制</a>
  <a href="zh/faq/overview">[03] 常见问题 ............. 下载、网络、调用的常见问题</a>
  <a href="zh/faq/privacy-policy">[04] 隐私政策 ............. 我们收集什么数据、怎么存的</a>
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --community</span></div>
<div class="term-output">
<p class="term-output-note term-output-note--spaced">连接到 BotHub 社区网络 ... 完成</p>

:::join-qq-group-button{id-label="QQ群"}
加入QQ群
:::

</div>

<div class="term-cursor-line"><span class="prompt term-cursor-prompt">$ </span><span class="cursor-blink">_</span></div>

  </div>
</div>

#links
::
