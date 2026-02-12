<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'Android',
})

interface VersionEntry {
  url?: string
}

interface VersionManifest {
  android?: VersionEntry | string
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
  const value = data.value?.android
  const url = typeof value === 'string' ? value : value?.url
  return resolveSiteUrl(url || runtimeConfig.public?.downloads?.apk || '/downloads/app-release.apk')
})
</script>

<template>
  <UButton
    color="neutral"
    variant="outline"
    size="xl"
    :to="downloadHref"
    external
    icon="i-lucide-smartphone"
  >
    <slot>{{ props.label }}</slot>
  </UButton>
</template>
