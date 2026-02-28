<script setup lang="ts">
import { mobileSlidesZh, mobileSlidesEn, mobileContentZh, mobileContentEn } from '~/data/mobile-slides'

const props = withDefaults(defineProps<{ locale?: 'zh' | 'en' }>(), {
  locale: 'zh',
})

const slides = computed(() => props.locale === 'zh' ? mobileSlidesZh : mobileSlidesEn)
const content = computed(() => props.locale === 'zh' ? mobileContentZh : mobileContentEn)
const { currentSlide, progressText, prevSlide, nextSlide } = useCarousel(slides, () => props.locale)
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
