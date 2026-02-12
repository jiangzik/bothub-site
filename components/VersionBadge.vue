<script setup lang="ts">
const props = defineProps<{
  label?: string
  loading?: string
}>()

interface VersionEntry {
  version?: string
}

interface VersionManifest {
  android?: VersionEntry | string
  mac?: VersionEntry | string
  windows?: VersionEntry | string
}

const label = computed(() => props.label ?? 'Version')
const loading = computed(() => props.loading ?? '--')
const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app.baseURL || '/'

const { data } = await useFetch<VersionManifest>('version.json', {
  baseURL: appBaseURL,
  default: () => ({}),
  server: false,
})

const pickVersion = (entry: VersionEntry | string | undefined, fallback?: string) => {
  if (entry && typeof entry === 'object' && entry.version) return entry.version
  return fallback || loading.value
}

const versionText = computed(() => {
  const fallback = runtimeConfig.public?.versions
  const androidVersion = pickVersion(data.value?.android, fallback?.android)
  const macVersion = pickVersion(data.value?.mac, fallback?.mac)
  const windowsVersion = pickVersion(data.value?.windows, fallback?.windows)

  const value = `Android v${androidVersion} · macOS v${macVersion} · Windows v${windowsVersion}`
  return label.value ? `${label.value}: ${value}` : value
})
</script>

<template>
  <p class="text-sm text-muted">
    {{ versionText }}
  </p>
</template>
