<script setup lang="ts">
import type { VersionManifest } from '~/types/version'

type Platform = 'android' | 'mac' | 'windows' | 'linux' | 'server'

const PLATFORM_CONFIG: Record<Platform, {
  icon: string
  downloadKey: keyof VersionManifest
  defaultUrl: string
  alwaysRender: boolean
}> = {
  android: { icon: 'i-lucide-smartphone', downloadKey: 'android', defaultUrl: '/downloads/app-release.apk', alwaysRender: true },
  mac: { icon: 'i-lucide-apple', downloadKey: 'mac', defaultUrl: '', alwaysRender: false },
  windows: { icon: 'i-lucide-monitor', downloadKey: 'windows', defaultUrl: '', alwaysRender: false },
  linux: { icon: 'i-lucide-box', downloadKey: 'linux', defaultUrl: '', alwaysRender: false },
  server: { icon: 'i-lucide-server', downloadKey: 'server', defaultUrl: '', alwaysRender: false },
}

const props = withDefaults(defineProps<{ platform: Platform; label?: string }>(), {
  label: '',
})

const config = PLATFORM_CONFIG[props.platform]

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
</script>

<template>
  <UButton
    v-if="shouldRender"
    color="neutral"
    variant="outline"
    size="xl"
    :to="downloadHref"
    external
    :icon="config.icon"
  >
    <slot>{{ props.label }}</slot>
    <template v-if="versionText"> v{{ versionText }}</template>
  </UButton>
</template>
