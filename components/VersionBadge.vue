<script setup lang="ts">
const props = defineProps<{
  label?: string
  loading?: string
}>()

interface VersionManifest {
  version?: string
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

const versionText = computed(() => {
  const v = data.value?.version || runtimeConfig.public?.appVersion || loading.value
  const value = `v${v}`
  return label.value ? `${label.value}: ${value}` : value
})
</script>

<template>
  <p class="text-sm text-muted">
    {{ versionText }}
  </p>
</template>
