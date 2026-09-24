<script setup lang="ts">
const props = defineProps<{
  label?: string
  loading?: string
}>()

const label = computed(() => props.label ?? '')
const loading = computed(() => props.loading ?? '--')

// 直接从权威源拉版本号；fetch 完成前显示 loading 占位。
const { data } = useVersionManifest()

const versionValue = computed(() => data.value?.version || loading.value)
const versionText = computed(() => {
  const value = `v${versionValue.value}`
  return label.value ? `${label.value} ${value}` : value
})
</script>

<template>
  <p class="term-version-badge">{{ versionText }}</p>
</template>
