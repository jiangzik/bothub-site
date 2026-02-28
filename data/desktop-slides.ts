import type { DesktopSlide, PanelContent } from '~/types/carousel'

export const desktopSlidesZh: DesktopSlide[] = [
  {
    src: '/desktop/home.png',
    alt: 'BotHub 桌面端对话与上下文视图',
    kicker: 'Desktop Workspace',
    title: '一个主工作台覆盖从思考到交付的完整流程',
    desc: '在一个界面里完成提问、验证、整理与输出，减少工具切换造成的上下文丢失。',
  },
  {
    src: '/desktop/setting.png',
    alt: 'BotHub 桌面端模型与参数设置视图',
    kicker: 'Desktop Controls',
    title: '模型、参数与提供商策略集中管理',
    desc: '把路由策略、模型参数和上下文控制放在一个面板里，支持高频迭代和稳定复现。',
  },
]

export const desktopSlidesEn: DesktopSlide[] = [
  {
    src: '/desktop/home.png',
    alt: 'BotHub desktop conversation and context workspace',
    kicker: 'Desktop Workspace',
    title: 'One control surface for the full task lifecycle',
    desc: 'Handle question framing, validation, synthesis, and delivery in one place without losing context between tools.',
  },
  {
    src: '/desktop/setting.png',
    alt: 'BotHub desktop model and parameter controls',
    kicker: 'Desktop Controls',
    title: 'Centralized model, parameter, and provider strategy',
    desc: 'Keep routing strategy, model tuning, and context controls in one panel for high-frequency iterative work.',
  },
]

export const panelZh: PanelContent = {
  kicker: 'Control Layers',
  title: '四层控制能力，支撑深度任务',
  desc: '通过模型、上下文、提示词与输出结构四个层级的组合控制，把不稳定的 AI 结果变成可复用的生产流程。',
  items: [
    { id: '01', text: '模型路由：按任务动态切换能力' },
    { id: '02', text: '上下文管理：长任务连续不中断' },
    { id: '03', text: '提示词模板：结构化沉淀团队经验' },
    { id: '04', text: '输出规范：统一报告与交付格式' },
  ],
  ariaPrev: '上一张',
  ariaNext: '下一张',
}

export const panelEn: PanelContent = {
  kicker: 'Control Layers',
  title: 'Four layers that stabilize complex AI work',
  desc: 'Combine model routing, context continuity, prompt templates, and output structure to turn ad-hoc usage into repeatable production flow.',
  items: [
    { id: '01', text: 'Model routing for task-specific capability' },
    { id: '02', text: 'Context management for long sessions' },
    { id: '03', text: 'Prompt templates for team reuse' },
    { id: '04', text: 'Output standards for delivery quality' },
  ],
  ariaPrev: 'Previous slide',
  ariaNext: 'Next slide',
}
