<script setup lang="ts">
import type { DownloadPlatform } from '~/composables/usePlatformDownload'

const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.jiangzikang.bothub'
const PLATFORM_NAMES: Record<DownloadPlatform, string> = { mac: 'macOS', windows: 'Windows', linux: 'Linux', android: 'Android' }

const { locale } = useDocusI18n()
const isZh = computed(() => locale.value !== 'en')
const detected = useDetectedPlatform()

const directPlatform = computed<DownloadPlatform | null>(() => {
  const value = detected.value
  return value === 'mac' || value === 'windows' || value === 'linux' ? value : null
})

const { downloadHref, effectiveHref, version, statusText, warm, start } = usePlatformDownload(directPlatform)

const mode = computed<'direct' | 'play' | 'anchor'>(() => {
  if (detected.value === 'android') return 'play'
  if (directPlatform.value && downloadHref.value) return 'direct'
  return 'anchor'
})

const label = computed(() => {
  if (mode.value === 'play') return isZh.value ? '在 Google Play 获取' : 'Get it on Google Play'
  if (mode.value === 'direct' && directPlatform.value) {
    const name = PLATFORM_NAMES[directPlatform.value]
    return isZh.value ? `下载 ${name} 版` : `Download for ${name}`
  }
  return isZh.value ? '免费下载' : 'Download free'
})

const href = computed(() => {
  if (mode.value === 'play') return GOOGLE_PLAY_URL
  if (mode.value === 'direct') return effectiveHref.value
  return '#download'
})

const hint = computed(() => {
  if (statusText.value) return statusText.value
  const parts = [isZh.value ? '免费' : 'Free']
  if (version.value) parts.push(`v${version.value}`)
  if (detected.value === 'ios') parts.push(isZh.value ? 'iOS 版筹备中' : 'iOS in progress')
  return parts.join(' · ')
})

const onClick = (event: MouseEvent) => {
  if (mode.value === 'direct') void start(event)
}
</script>

<template>
  <div class="hero-download">
    <a
      class="signal-button signal-button-primary"
      :href="href"
      :target="mode === 'play' ? '_blank' : undefined"
      :rel="mode === 'play' ? 'noopener' : undefined"
      :download="mode === 'direct' ? '' : undefined"
      @pointerenter="mode === 'direct' && warm()"
      @click="onClick"
    >
      <span>{{ label }}</span>
      <span aria-hidden="true">{{ mode === 'anchor' ? '→' : '↓' }}</span>
    </a>
    <p class="hero-download-hint" role="status">{{ hint }}</p>
  </div>
</template>
