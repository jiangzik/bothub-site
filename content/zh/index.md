---
seo:
  title: BotHub
  description: BotHub 官网，支持多厂商兼容与本地隐私保护。
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
<p style="margin:8px 0 4px;color:var(--ink);font-size:14px;font-weight:700;">AI 驱动跨平台客户端</p>
<p style="color:var(--text-muted);font-size:12px;">平台: Desktop / Android / iOS &nbsp;|&nbsp; 隐私: 本地优先存储 &nbsp;|&nbsp; 模型: 多厂商兼容</p>
<version-badge label="版本"></version-badge>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --platforms</span></div>
<div class="term-output">
<pre>
+------------+----------------------------+-------+
| 模块       | 描述                       | 评分  |
+------------+----------------------------+-------+
| DESKTOP    | macOS / Windows / Linux    |  A+   |
| CONSOLE    | 参数控制台                 |  91   |
| ANDROID    | 移动端流程                 |  89   |
| QUICK      | Android 快捷操作           |  93   |
+------------+----------------------------+-------+
</pre>
<p style="color:var(--text-muted);font-size:12px;">桌面端作为主力生产力工作台，Android 已可使用，iOS 正在持续开发中。</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --download</span></div>
<div class="term-output">
<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">选择目标平台执行安装:</p>
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

:::download-server-button
Server
:::

</div>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --capabilities</span></div>
<div class="term-output">
<pre>
已加载 4 个核心模块:

-- CONTEXT ENGINE -----------------------------------------------
  长上下文任务不中断
  在多轮对话和复杂任务中，持续保留关键信息与阶段状态。
  · 长会话上下文延续  · 阶段状态可追踪  · 跨任务记忆更稳定

-- PROVIDER ROUTING ---------------------------------------------
  多模型与多提供商协同
  同一工作流中按任务目标切换模型能力，覆盖创作、分析、代码、检索。
  · 多提供商统一管理  · 模型能力按需调度  · 参数策略集中控制

-- PROMPT CONTROL -----------------------------------------------
  可复用的提示词体系
  将临时提问升级为结构化提示词模板，降低输出波动与沟通成本。
  · 模板化提示词沉淀  · 场景化参数组合  · 团队复用效率提升

-- LOCAL PRIVACY ------------------------------------------------
  本地优先的数据策略
  核心数据本地优先，降低敏感信息外泄风险，平衡效率与合规。
  · 本地优先存储  · 关键配置可控  · 隐私策略可审计
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --cloud-link</span></div>
<div class="term-output">
<pre>
已加载云连接模块 ... 完成

-- PHONE → PC ---------------------------------------------------
  手机扫码，即刻连接电脑
  登录后在 Android 端扫一扫，即可与桌面端配对，随时随地操控你的电脑。
  · 扫码一键配对  · 不在同一网络也能连  · 连接状态实时可见

-- REMOTE CONTROL -----------------------------------------------
  口袋里的远程桌面
  出门在外也能用手机查看电脑运行状态、执行命令、管理 Agent 任务。
  · 远程终端访问  · 多台电脑统一管理  · 随时查看连接状况
</pre>
<p style="color:var(--text-muted);font-size:12px;">登录账号后即可使用云连接功能；不登录时所有功能仍可正常使用，数据完全保留在本地。</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --docs</span></div>
<div class="term-output">
<pre>
读取文档索引 ... 完成

  <a href="/zh/quick-start/overview">[01] 快速开始 ............. 完成安装配置并发出第一条消息</a>
  <a href="/zh/manual/overview">[02] 使用手册 ............. 查看提供商配置、对话流程和上下文机制</a>
  <a href="/zh/faq/overview">[03] 常见问题 ............. 排查下载、网络和模型调用常见故障</a>
  <a href="/zh/faq/privacy-policy">[04] 隐私政策 ............. 查看数据收集范围、存储方式与隐私承诺</a>
</pre>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --workflows</span></div>
<div class="term-output">
<pre>
已加载 3 条典型工作流:

  > 个人研究者:  问题拆解 → 交叉验证 → 结论沉淀
  > 产品团队:    需求整理 → 方案对比 → 评审迭代
  > 运营支持:    问题归档 → 模板匹配 → 响应手册
</pre>
<p style="color:var(--text-muted);font-size:12px;">从快速开始入门，再逐步把提示词、模型路由和工作流模板沉淀为长期资产。</p>
</div>

<div class="term-cmd"><span class="prompt">$ </span><span class="cmd-text">bothub --community</span></div>
<div class="term-output">
<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">连接到 BotHub 社区网络 ... 完成</p>

:::join-qq-group-button{id-label="QQ群"}
加入QQ群
:::

</div>

<div class="term-cursor-line"><span class="prompt" style="color:var(--sage);">$ </span><span class="cursor-blink">_</span></div>

  </div>
</div>

#links
::
