<script setup lang="ts">
import type { VersionManifest } from '~/types/version'

type Platform = 'android' | 'mac' | 'windows'

const PLATFORM_CONFIG: Record<Platform, {
  icon: string
  symbol: string
  defaultMainLabel: string
  defaultSubLabel: string
  downloadKey: keyof VersionManifest
  defaultUrl: string
  alwaysRender: boolean
}> = {
  android: { icon: 'i-lucide-smartphone', symbol: '⬇', defaultMainLabel: 'Android APK', defaultSubLabel: 'APK · sideload', downloadKey: 'android', defaultUrl: '/downloads/app-release.apk', alwaysRender: true },
  mac: { icon: 'i-lucide-apple', symbol: '', defaultMainLabel: 'macOS', defaultSubLabel: 'DMG', downloadKey: 'mac', defaultUrl: '', alwaysRender: false },
  windows: { icon: 'i-lucide-monitor', symbol: '', defaultMainLabel: 'Windows', defaultSubLabel: 'EXE · Win 10+', downloadKey: 'windows', defaultUrl: '', alwaysRender: false },
}

const props = withDefaults(defineProps<{ platform: Platform; label?: string; channel?: string }>(), {
  label: '',
  channel: '',
})

const config = PLATFORM_CONFIG[props.platform]
const slots = useSlots()

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

const { data } = await useFetch<VersionManifest>('version.json', {
  baseURL: appBaseURL,
  default: () => ({}),
  server: false,
})

const downloadHref = computed(() => {
  const value = data.value?.[config.downloadKey]
  const url = typeof value === 'string' ? value : (value as { url?: string })?.url
  const downloads = runtimeConfig.public?.downloads as Record<string, string> | undefined
  const fallbackKey = props.platform === 'android' ? 'apk' : props.platform
  return resolveSiteUrl(url || downloads?.[fallbackKey] || config.defaultUrl)
})

const versionText = computed(() => {
  const versions = runtimeConfig.public?.versions as Record<string, string> | undefined
  return data.value?.version || versions?.[props.platform] || ''
})

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
