<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: '',
})

const DEFAULT_GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.jiangzikang.bothub'

const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app.baseURL || '/'

const resolveSiteUrl = (value: string): string => {
  if (!value) return ''
  if (/^(?:[a-z]+:)?\/\//i.test(value)) return value
  if (appBaseURL !== '/' && value.startsWith(appBaseURL)) return value
  const normalized = value.replace(/^\/+/, '')
  if (appBaseURL === '/') return `/${normalized}`
  return `${appBaseURL}${normalized}`
}

const downloadHref = computed(() => {
  const downloads = runtimeConfig.public?.downloads as Record<string, string> | undefined
  return resolveSiteUrl(downloads?.googlePlay || DEFAULT_GOOGLE_PLAY_URL)
})

const { locale } = useDocusI18n()
const detected = useDetectedPlatform()
const recommended = computed(() => detected.value === 'android')
const subLabel = computed(() => props.label || (locale.value === 'en' ? 'Recommended for Android' : 'Android 推荐渠道'))
</script>

<template>
  <a
    :href="downloadHref"
    class="term-download-link bothub-download-card"
    data-platform="google-play"
    :data-recommended="recommended ? 'true' : undefined"
    target="_blank"
    rel="noopener"
  >
    <UIcon name="i-logos-google-play-icon" class="bothub-download-icon" />
    <span class="bothub-download-text">
      <strong>Google Play</strong>
      <small><slot>{{ subLabel }}</slot></small>
    </span>
    <span class="bothub-download-meta">
      <em v-if="recommended">{{ locale === 'en' ? 'For this device' : '适合当前设备' }}</em>
    </span>
    <i class="bothub-download-arrow" aria-hidden="true">↗</i>
  </a>
</template>
