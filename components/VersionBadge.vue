<script setup lang="ts">
const props = defineProps<{
  label?: string
  loading?: string
}>()

const label = computed(() => props.label ?? '')
const loading = computed(() => props.loading ?? '--')

// 直接从权威源拉版本号；fetch 完成前显示 loading 占位。
const { data } = await useVersionManifest()

const versionValue = computed(() => data.value?.version || loading.value)
const versionText = computed(() => `v${versionValue.value}`)
</script>

<template>
  <span class="bothub-version-badge">
    <span v-if="label" class="bothub-version-label">{{ label }}</span>
    <span class="bothub-version-value">{{ versionText }}</span>
  </span>
</template>

<style scoped>
.bothub-version-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: inherit;
  line-height: 1;
}
.bothub-version-label {
  color: var(--bothub-text-mute, #8a8a8a);
}
.bothub-version-value {
  color: var(--bothub-accent, #ea580c);
  font-weight: 600;
}
</style>
