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

const { locale } = useDocusI18n()
const opening = ref(false)
const commandText = computed(() => {
  return locale.value === 'zh' ? './安装 --平台=google-play' : './install --platform=google-play'
})

const sourceStatusText = computed(() => {
  if (opening.value) {
    return locale.value === 'zh' ? '正在打开官方 Google Play 下载源...' : 'opening official Google Play source...'
  }
  return ''
})

const handleClick = (): void => {
  opening.value = true
  window.setTimeout(() => {
    opening.value = false
  }, 900)
}
</script>

<template>
  <a
    :href="downloadHref"
    class="term-download-link"
    data-platform="google-play"
    :data-source-state="opening ? 'downloading' : 'ready'"
    target="_blank"
    rel="noopener"
    @click="handleClick"
  >
    <span class="term-prompt">&gt;</span>
    <span class="term-cmd-text">{{ commandText }}</span>
    <span class="term-version">Android</span>
    <span class="term-label"><slot>{{ props.label }}</slot></span>
    <span v-if="sourceStatusText" class="term-download-status">{{ sourceStatusText }}</span>
  </a>
</template>
