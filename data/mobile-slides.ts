import type { MobileSlide, MobileContent } from '~/types/carousel'

export const mobileSlidesZh: MobileSlide[] = [
  {
    src: '/android/chat.png',
    alt: 'BotHub Android 聊天界面',
    kicker: 'Chat Interface',
    title: '会话与追问链路保持连贯',
    desc: '在手机端快速处理追问、补充条件与结果确认，减少任务中断。',
  },
  {
    src: '/android/toolbar.png',
    alt: 'BotHub Android 功能面板',
    kicker: 'Android Live',
    title: '移动端延续桌面策略，而不是简化版替代',
    desc: '在移动场景下保留关键控制能力，确保外出期间也能接续复杂任务。',
  },
  {
    src: '/android/providers.png',
    alt: 'BotHub Android 模型服务列表',
    kicker: 'Model Providers',
    title: '主流模型服务商一站接入',
    desc: '支持 Anthropic、OpenAI、DeepSeek、Ollama 等十余家服务商，按需灵活切换。',
  },
  {
    src: '/android/setting.png',
    alt: 'BotHub Android 设置页面',
    kicker: 'Settings',
    title: '模型、技能与设备控制集中管理',
    desc: '从模型配置到 MCP 扩展，所有控制项集中在一个入口，随时调整工作策略。',
  },
  {
    src: '/android/chat-list.png',
    alt: 'BotHub Android 会话列表',
    kicker: 'Chat List',
    title: '会话与项目分类清晰可检索',
    desc: '通过 Bots 与项目分组管理历史会话，快速找到并恢复之前的任务上下文。',
  },
  {
    src: '/android/multi-model.png',
    alt: 'BotHub Android 多模型对比',
    kicker: 'Multi-Model',
    title: '同一问题多模型并行回答',
    desc: '对比不同模型的输出结果，选择最佳方案，提升决策质量。',
  },
  {
    src: '/android/statistics.png',
    alt: 'BotHub Android 统计看板',
    kicker: 'Statistics',
    title: '使用数据一目了然',
    desc: '查看使用频率、模型分布与活跃时段，帮助优化个人 AI 使用习惯。',
  },
  {
    src: '/android/data-management.png',
    alt: 'BotHub Android 数据管理',
    kicker: 'Data Management',
    title: '本地数据存储透明可控',
    desc: '清晰展示存储占用与文件分类，数据完全掌握在自己手中。',
  },
]

export const mobileSlidesEn: MobileSlide[] = [
  {
    src: '/android/chat.png',
    alt: 'BotHub Android chat interface',
    kicker: 'Chat Interface',
    title: 'Maintain continuity across follow-up conversations',
    desc: 'Handle follow-ups, constraints, and confirmation loops quickly without breaking task flow.',
  },
  {
    src: '/android/toolbar.png',
    alt: 'BotHub Android feature panel',
    kicker: 'Android Live',
    title: 'Mobile extends desktop strategy, not a stripped-down fallback',
    desc: 'Keep key controls available on the go so complex tasks can continue outside desktop sessions.',
  },
  {
    src: '/android/providers.png',
    alt: 'BotHub Android model providers list',
    kicker: 'Model Providers',
    title: 'All major model providers in one place',
    desc: 'Connect to Anthropic, OpenAI, DeepSeek, Ollama, and 10+ providers with flexible switching.',
  },
  {
    src: '/android/setting.png',
    alt: 'BotHub Android settings page',
    kicker: 'Settings',
    title: 'Centralized model, skill, and device controls',
    desc: 'From model config to MCP extensions, all controls live in one entry point for on-the-fly strategy changes.',
  },
  {
    src: '/android/chat-list.png',
    alt: 'BotHub Android chat list',
    kicker: 'Chat List',
    title: 'Organized and searchable conversation history',
    desc: 'Manage past sessions with Bots and project folders to quickly locate and resume prior task context.',
  },
  {
    src: '/android/multi-model.png',
    alt: 'BotHub Android multi-model comparison',
    kicker: 'Multi-Model',
    title: 'Parallel answers from multiple models',
    desc: 'Compare outputs across models for the same prompt to pick the best result and improve decisions.',
  },
  {
    src: '/android/statistics.png',
    alt: 'BotHub Android statistics dashboard',
    kicker: 'Statistics',
    title: 'Usage insights at a glance',
    desc: 'Review usage frequency, model distribution, and active hours to optimize your AI workflow.',
  },
  {
    src: '/android/data-management.png',
    alt: 'BotHub Android data management',
    kicker: 'Data Management',
    title: 'Transparent local data storage',
    desc: 'Clear breakdown of storage usage and file categories — your data stays fully under your control.',
  },
]

export const mobileContentZh: MobileContent = {
  cards: [
    {
      kicker: 'Android 能力',
      title: '当前可直接投入日常使用',
      items: [
        '聊天、调参、会话管理已覆盖高频场景',
        '快捷操作区可快速切换任务上下文',
        '与桌面端保持一致的核心工作方式',
      ],
    },
    {
      kicker: 'iOS 进度',
      title: '按同一交互标准持续开发',
      items: [
        '优先保证体验一致与流程连贯',
        '重点打磨核心任务路径稳定性',
        '完成后与 Desktop / Android 同步节奏',
      ],
    },
  ],
  flow: {
    kicker: 'Mobile Flow',
    title: '移动端任务路径',
    steps: [
      '进入会话并恢复上次上下文',
      '按场景快速切换模型与参数',
      '使用模板稳定输出结构',
      '返回桌面端继续深度处理',
    ],
  },
  ariaPrev: '上一张',
  ariaNext: '下一张',
}

export const mobileContentEn: MobileContent = {
  cards: [
    {
      kicker: 'Android Scope',
      title: 'Ready for day-to-day production usage',
      items: [
        'Chat, tuning, and session controls cover high-frequency tasks',
        'Quick action area accelerates context switching',
        'Core workflow stays aligned with desktop behavior',
      ],
    },
    {
      kicker: 'iOS Progress',
      title: 'Built under the same interaction standard',
      items: [
        'Consistency and flow continuity are top priority',
        'Stability for core task paths is being refined',
        'Roadmap is aligned with Desktop and Android',
      ],
    },
  ],
  flow: {
    kicker: 'Mobile Flow',
    title: 'Task path on mobile',
    steps: [
      'Resume previous context on entry',
      'Switch model and parameters by scenario',
      'Use templates to stabilize output quality',
      'Return to desktop for deeper execution',
    ],
  },
  ariaPrev: 'Previous slide',
  ariaNext: 'Next slide',
}
