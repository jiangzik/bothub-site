<script setup lang="ts">
import type { VersionManifest } from '~/types/version'

type Platform = 'android' | 'mac' | 'windows' | 'linux'

const PLATFORM_CONFIG: Record<Platform, {
  icon: string
  symbol: string
  defaultMainLabel: string
  defaultSubLabel: string
  downloadKey: keyof VersionManifest
  defaultUrl: string
  alwaysRender: boolean
}> = {
  android: { icon: 'i-simple-icons-android', symbol: '⬇', defaultMainLabel: 'Android APK', defaultSubLabel: 'APK · sideload', downloadKey: 'android', defaultUrl: '/downloads/app-release.apk', alwaysRender: true },
  mac: { icon: 'i-simple-icons-apple', symbol: '', defaultMainLabel: 'macOS', defaultSubLabel: 'DMG', downloadKey: 'mac', defaultUrl: '', alwaysRender: false },
  windows: { icon: 'i-simple-icons-windows11', symbol: '', defaultMainLabel: 'Windows', defaultSubLabel: 'EXE · Win 10+', downloadKey: 'windows', defaultUrl: '', alwaysRender: false },
  linux: { icon: 'i-simple-icons-linux', symbol: '', defaultMainLabel: 'Linux', defaultSubLabel: 'AppImage · 未经测试', downloadKey: 'linux', defaultUrl: '', alwaysRender: false },
}

const props = withDefaults(defineProps<{ platform: Platform; label?: string; channel?: string }>(), {
  label: '',
  channel: '',
})

const config = PLATFORM_CONFIG[props.platform]
const slots = useSlots()

// version.json 的权威源在 bothub 大仓 release CI 写入的 https://bothub.bookab.info/version.json。
// 不依赖站点本地 baseURL，直接绝对 URL fetch。
const { data } = await useFetch<VersionManifest>(
  'https://bothub.bookab.info/version.json',
  { default: () => ({}), server: false },
)

const downloadHref = computed(() => {
  const value = data.value?.[config.downloadKey]
  const url = typeof value === 'string' ? value : (value as { url?: string })?.url
  return url || config.defaultUrl
})

const versionText = computed(() => data.value?.version || '')

const shouldRender = computed(() => config.alwaysRender || !!downloadHref.value)
const hasSlot = computed(() => !!props.label || !!slots.default)
</script>

<template>
  <a
    v-if="shouldRender"
    :href="downloadHref"
    class="bothub-dl-card"
    :data-platform="platform"
    target="_blank"
    rel="noopener"
  >
    <span class="bothub-dl-icon">
      <UIcon :name="config.icon" />
    </span>
    <span class="bothub-dl-body">
      <span class="bothub-dl-main">{{ config.defaultMainLabel }}</span>
      <span class="bothub-dl-sub">
        <slot>{{ props.label || config.defaultSubLabel }}</slot>
      </span>
    </span>
    <span v-if="versionText" class="bothub-dl-version">v{{ versionText }}</span>
  </a>
</template>
