<script setup lang="ts">
import { desktopSlidesZh, desktopSlidesEn, panelZh, panelEn } from '~/data/desktop-slides'

const props = withDefaults(defineProps<{ locale?: 'zh' | 'en' }>(), {
  locale: 'zh',
})

const slides = computed(() => props.locale === 'zh' ? desktopSlidesZh : desktopSlidesEn)
const panel = computed(() => props.locale === 'zh' ? panelZh : panelEn)
const { currentSlide, progressText, prevSlide, nextSlide } = useCarousel(slides, () => props.locale)
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
