<script setup lang="ts">
import type { DownloadPlatform } from '~/composables/usePlatformDownload'
import { preferredDownloadPlatform } from '~/utils/platform-download'

const PLATFORM_CONFIG: Record<DownloadPlatform, { icon: string, title: string, subLabel: string }> = {
  android: { icon: 'i-simple-icons-android', title: 'Android APK', subLabel: 'APK' },
  mac: { icon: 'i-simple-icons-apple', title: 'macOS', subLabel: 'DMG' },
  windows: { icon: 'i-simple-icons-windows11', title: 'Windows', subLabel: 'EXE · Win 10+' },
  linux: { icon: 'i-simple-icons-linux', title: 'Linux', subLabel: 'AppImage' },
}

const props = withDefaults(defineProps<{ platform: DownloadPlatform, label?: string, title?: string }>(), {
  label: '',
  title: '',
})

const config = PLATFORM_CONFIG[props.platform]
const { downloadHref, effectiveHref, version, selecting, sourceState, statusText, warm, start } = usePlatformDownload(() => props.platform)
const detected = useDetectedPlatform()
const { locale } = useDocusI18n()

const recommended = computed(() => preferredDownloadPlatform(detected.value) === props.platform)
const shouldRender = computed(() => !!downloadHref.value)
</script>

<template>
  <a
    v-if="shouldRender"
    :href="effectiveHref"
    class="term-download-link bothub-download-card"
    :data-platform="platform"
    :data-source-state="sourceState"
    :data-recommended="recommended ? 'true' : undefined"
    :aria-busy="selecting ? 'true' : undefined"
    download
    @pointerenter="warm"
    @focus="warm"
    @click="start"
  >
    <UIcon :name="config.icon" class="bothub-download-icon" />
    <span class="bothub-download-text">
      <strong>{{ props.title || config.title }}</strong>
      <small><slot>{{ props.label || config.subLabel }}</slot></small>
    </span>
    <span class="bothub-download-meta">
      <em v-if="recommended">{{ locale === 'en' ? 'For this device' : '适合当前设备' }}</em>
      <span v-if="version">v{{ version }}</span>
    </span>
    <i class="bothub-download-arrow" aria-hidden="true">↓</i>
    <span v-if="statusText" class="bothub-download-status" role="status">{{ statusText }}</span>
  </a>
</template>
