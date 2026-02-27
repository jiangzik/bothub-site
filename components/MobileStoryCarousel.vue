<script setup lang="ts">
interface MobileSlide {
  src: string
  alt: string
  kicker: string
  title: string
  desc: string
}

interface MobileCard {
  kicker: string
  title: string
  items: string[]
}

interface MobileFlow {
  kicker: string
  title: string
  steps: string[]
}

interface MobileContent {
  cards: MobileCard[]
  flow: MobileFlow
  ariaPrev: string
  ariaNext: string
}

const props = withDefaults(defineProps<{ locale?: 'zh' | 'en' }>(), {
  locale: 'zh',
})

const mobileSlidesZh: MobileSlide[] = [
  {
    src: '/android/2.png',
    alt: 'BotHub Android 设置与模型面板',
    kicker: 'Android Live',
    title: '移动端延续桌面策略，而不是简化版替代',
    desc: '在移动场景下保留关键控制能力，确保外出期间也能接续复杂任务。',
  },
  {
    src: '/android/1.png',
    alt: 'BotHub Android 聊天界面',
    kicker: 'Chat Interface',
    title: '会话与追问链路保持连贯',
    desc: '在手机端快速处理追问、补充条件与结果确认，减少任务中断。',
  },
  {
    src: '/android/9.png',
    alt: 'BotHub Android 快捷操作区域',
    kicker: 'Quick Actions',
    title: '高频操作入口聚合在同一屏',
    desc: '通过快捷操作快速切换模型与会话状态，提高碎片时间处理效率。',
  },
]

const mobileSlidesEn: MobileSlide[] = [
  {
    src: '/android/2.png',
    alt: 'BotHub Android settings and model panel',
    kicker: 'Android Live',
    title: 'Mobile extends desktop strategy, not a stripped-down fallback',
    desc: 'Keep key controls available on the go so complex tasks can continue outside desktop sessions.',
  },
  {
    src: '/android/1.png',
    alt: 'BotHub Android chat interface',
    kicker: 'Chat Interface',
    title: 'Maintain continuity across follow-up conversations',
    desc: 'Handle follow-ups, constraints, and confirmation loops quickly without breaking task flow.',
  },
  {
    src: '/android/9.png',
    alt: 'BotHub Android quick action area',
    kicker: 'Quick Actions',
    title: 'High-frequency controls in one screen',
    desc: 'Switch model strategy and session state quickly to improve execution in short mobile sessions.',
  },
]

const mobileContentZh: MobileContent = {
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

const mobileContentEn: MobileContent = {
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

const currentIndex = ref(0)

const slides = computed(() => {
  return props.locale === 'zh' ? mobileSlidesZh : mobileSlidesEn
})

const content = computed(() => {
  return props.locale === 'zh' ? mobileContentZh : mobileContentEn
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
  <div class="story-shell mobile-story-shell">
    <div class="story-top-nav">
      <button class="nav-btn" type="button" :aria-label="content.ariaPrev" @click="prevSlide">
        &larr;
      </button>
      <button class="nav-btn" type="button" :aria-label="content.ariaNext" @click="nextSlide">
        &rarr;
      </button>
      <span class="story-progress">{{ progressText }}</span>
    </div>

    <div class="mobile-story-grid">
      <article class="mobile-story-visual">
        <img class="mobile-story-image" :src="currentSlide.src" :alt="currentSlide.alt" />
        <div class="mobile-story-caption">
          <p class="mobile-story-kicker">{{ currentSlide.kicker }}</p>
          <h3 class="mobile-story-title">{{ currentSlide.title }}</h3>
          <p class="mobile-story-desc">{{ currentSlide.desc }}</p>
        </div>
      </article>

      <article v-for="card in content.cards" :key="card.kicker" class="mobile-story-card">
        <p class="mobile-story-kicker">{{ card.kicker }}</p>
        <h3 class="mobile-story-title">{{ card.title }}</h3>
        <ul class="mobile-story-list">
          <li v-for="item in card.items" :key="item">{{ item }}</li>
        </ul>
      </article>

      <article class="mobile-story-flow">
        <p class="flow-kicker">{{ content.flow.kicker }}</p>
        <h3 class="flow-title">{{ content.flow.title }}</h3>
        <div class="mobile-flow-grid">
          <div v-for="(step, index) in content.flow.steps" :key="step" class="mobile-flow-item">
            <span class="mobile-flow-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <p>{{ step }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
