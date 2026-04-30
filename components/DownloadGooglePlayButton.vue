<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'Recommended',
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
</script>

<template>
  <a
    :href="downloadHref"
    class="bothub-dl-card"
    data-platform="google-play"
    target="_blank"
    rel="noopener"
  >
    <span class="bothub-dl-icon">
      <UIcon name="i-logos-google-play-icon" />
    </span>
    <span class="bothub-dl-body">
      <span class="bothub-dl-main">Google Play</span>
      <span class="bothub-dl-sub">
        <slot>{{ props.label }}</slot>
      </span>
    </span>
    <span class="bothub-dl-version">Android</span>
  </a>
</template>
