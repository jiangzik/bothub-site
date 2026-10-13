<script setup lang="ts">
import type { ServiceState } from '~/types/service-status'
defineProps<{ state?: ServiceState }>()
const { locale } = useDocusI18n()
const labels = computed(() => locale.value === 'en'
  ? { idle: 'No data', ok: 'Operational', degraded: 'Degraded', down: 'Major failures', unknown: 'Unavailable' }
  : { idle: '暂无数据', ok: '正常', degraded: '部分异常', down: '大面积失败', unknown: '状态未获取' })
</script>
<template>
  <span class="service-badge" :data-state="state || 'unknown'"><i aria-hidden="true" />{{ labels[state || 'unknown'] }}</span>
</template>
<style scoped>
.service-badge { display: inline-flex; gap: 7px; align-items: center; font-size: 12px; white-space: nowrap; color: var(--text-secondary); }
i { width: 7px; height: 7px; border-radius: 50%; background: var(--text-muted); }
[data-state="ok"] i { background: #2f9468; }
[data-state="degraded"] i { background: #d49424; }
[data-state="down"] i { background: #d94b45; }
</style>
