<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'Linux',
})

interface VersionEntry {
  url?: string
  version?: string
}

interface VersionManifest {
  linux?: VersionEntry | string
}

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
  const value = data.value?.linux
  const url = typeof value === 'string' ? value : value?.url
  return resolveSiteUrl(url || runtimeConfig.public?.downloads?.linux || '')
})

const versionText = computed(() => {
  const value = data.value?.linux
  if (value && typeof value === 'object' && value.version) {
    return value.version
  }
  return runtimeConfig.public?.versions?.linux || ''
})
</script>

<template>
  <UButton
    v-if="downloadHref"
    color="neutral"
    variant="outline"
    size="xl"
    :to="downloadHref"
    external
    icon="i-lucide-box"
  >
    <slot>{{ props.label }}</slot>
    <template v-if="versionText"> v{{ versionText }}</template>
  </UButton>
</template>
