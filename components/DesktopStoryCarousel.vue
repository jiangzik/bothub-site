<script setup lang="ts">
interface DesktopSlide {
  src: string
  alt: string
  kicker: string
  title: string
  desc: string
}

interface PanelContent {
  kicker: string
  title: string
  desc: string
  items: Array<{ id: string; text: string }>
  ariaPrev: string
  ariaNext: string
}

const props = withDefaults(defineProps<{ locale?: 'zh' | 'en' }>(), {
  locale: 'zh',
})

const desktopSlidesZh: DesktopSlide[] = [
  {
    src: '/desktop/7.png',
    alt: 'BotHub 桌面端对话与上下文视图',
    kicker: 'Desktop Workspace',
    title: '一个主工作台覆盖从思考到交付的完整流程',
    desc: '在一个界面里完成提问、验证、整理与输出，减少工具切换造成的上下文丢失。',
  },
  {
    src: '/desktop/8.png',
    alt: 'BotHub 桌面端模型与参数设置视图',
    kicker: 'Desktop Controls',
    title: '模型、参数与提供商策略集中管理',
    desc: '把路由策略、模型参数和上下文控制放在一个面板里，支持高频迭代和稳定复现。',
  },
]

const desktopSlidesEn: DesktopSlide[] = [
  {
    src: '/desktop/7.png',
    alt: 'BotHub desktop conversation and context workspace',
    kicker: 'Desktop Workspace',
    title: 'One control surface for the full task lifecycle',
    desc: 'Handle question framing, validation, synthesis, and delivery in one place without losing context between tools.',
  },
  {
    src: '/desktop/8.png',
    alt: 'BotHub desktop model and parameter controls',
    kicker: 'Desktop Controls',
    title: 'Centralized model, parameter, and provider strategy',
    desc: 'Keep routing strategy, model tuning, and context controls in one panel for high-frequency iterative work.',
  },
]

const panelZh: PanelContent = {
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

const panelEn: PanelContent = {
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

const currentIndex = ref(0)

const slides = computed(() => {
  return props.locale === 'zh' ? desktopSlidesZh : desktopSlidesEn
})

const panel = computed(() => {
  return props.locale === 'zh' ? panelZh : panelEn
})

const currentSlide = computed(() => slides.value[currentIndex.value])

const progressText = computed(() => {
  const total = slides.value.length
  const active = currentIndex.value + 1
  return `${String(active).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
})

const prevSlide = () => {
  const total = slides.value.length
  currentIndex.value = (currentIndex.value - 1 + total) % total
}

const nextSlide = () => {
  const total = slides.value.length
  currentIndex.value = (currentIndex.value + 1) % total
}

watch(
  () => props.locale,
  () => {
    currentIndex.value = 0
  },
)
</script>

<template>
  <div class="story-shell desktop-story-shell">
    <div class="story-top-nav">
      <button class="nav-btn" type="button" :aria-label="panel.ariaPrev" @click="prevSlide">
        &larr;
      </button>
      <button class="nav-btn" type="button" :aria-label="panel.ariaNext" @click="nextSlide">
        &rarr;
      </button>
      <span class="story-progress">{{ progressText }}</span>
    </div>

    <div class="desktop-story-grid">
      <article class="desktop-story-visual">
        <img class="desktop-story-image" :src="currentSlide.src" :alt="currentSlide.alt" />
        <div class="desktop-story-caption">
          <p class="desktop-story-kicker">{{ currentSlide.kicker }}</p>
          <h3 class="desktop-story-title">{{ currentSlide.title }}</h3>
          <p class="desktop-story-desc">{{ currentSlide.desc }}</p>
        </div>
      </article>

      <article class="desktop-story-panel">
        <p class="panel-kicker">{{ panel.kicker }}</p>
        <h3 class="panel-title">{{ panel.title }}</h3>
        <p class="panel-desc">{{ panel.desc }}</p>
        <div class="panel-grid">
          <div v-for="item in panel.items" :key="item.id" class="panel-item">
            <span>{{ item.id }}</span>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
