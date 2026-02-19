<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'macOS',
})

interface VersionEntry {
  url?: string
}

interface VersionManifest {
  version?: string
  mac?: VersionEntry | string
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
  const value = data.value?.mac
  const url = typeof value === 'string' ? value : value?.url
  return resolveSiteUrl(url || runtimeConfig.public?.downloads?.mac || '')
})

const versionText = computed(() => {
  return data.value?.version || runtimeConfig.public?.versions?.mac || ''
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
    icon="i-lucide-apple"
  >
    <slot>{{ props.label }}</slot>
    <template v-if="versionText"> v{{ versionText }}</template>
  </UButton>
</template>
