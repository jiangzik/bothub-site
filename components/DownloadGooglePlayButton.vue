<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'Google Play',
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
    class="term-download-link"
    target="_blank"
    rel="noopener"
  >
    <span class="term-prompt">&gt;</span>
    <span class="term-cmd-text">./install --platform=android</span>
    <span class="term-label"><slot>{{ props.label }}</slot></span>
  </a>
</template>
