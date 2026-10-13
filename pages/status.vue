<script setup lang="ts">
import type { ServiceBucket } from '~/types/service-status'
const { locale } = useDocusI18n()
const zh = computed(() => locale.value !== 'en')
const { data, error, status, refresh } = useModelServiceStatus()
const query = ref('')
const models = computed(() => (data.value?.models || []).filter(model =>
  `${model.id} ${model.displayName}`.toLowerCase().includes(query.value.trim().toLowerCase())))
const date = (value: string | number) => new Date(value).toLocaleString(zh.value ? 'zh-CN' : 'en-US')
function bucketTitle(bucket: ServiceBucket | null, index: number): string {
  if (!data.value) return ''
  const time = date(new Date(data.value.windowStart).getTime() + index * data.value.bucketMinutes * 60_000)
  return bucket
    ? `${time} · ${zh.value ? '成功 / 失败' : 'Success / failure'}: ${bucket.successes} / ${bucket.failures}`
    : `${time} · ${zh.value ? '暂无请求数据' : 'No requests'}`
}
useSeoMeta({ title: () => zh.value ? '模型服务状态' : 'Model service status' })
</script>
<template>
  <main class="status-page">
    <header>
      <div><h1>{{ zh ? '模型服务状态' : 'Model service status' }}</h1>
        <p>{{ zh ? '最近 24 小时的实际请求表现，每分钟自动刷新。' : 'Actual request performance over the last 24 hours. Refreshes every minute.' }}</p>
      </div>
      <UButton color="neutral" variant="outline" :loading="status === 'pending'" @click="refresh()">{{ zh ? '刷新' : 'Refresh' }}</UButton>
    </header>
    <p v-if="error" role="alert" class="status-error">{{ zh ? '服务状态加载失败，请重试。已有数据未更新。' : 'Could not load service status. Retry to update the data.' }}</p>
    <p v-else-if="!data" role="status">{{ zh ? '正在获取服务状态…' : 'Loading service status…' }}</p>
    <template v-if="data">
      <section class="status-summary">
        <ServiceStateBadge :state="error ? undefined : data.state" />
        <span>{{ zh ? `受影响模型 ${data.affectedModelCount} 个` : `${data.affectedModelCount} affected models` }}</span>
        <small>{{ zh ? '更新于' : 'Updated' }} {{ date(data.generatedAt) }}</small>
      </section>
      <div class="status-tools">
        <UInput v-model="query" icon="i-lucide-search" :placeholder="zh ? '搜索模型' : 'Search models'" :aria-label="zh ? '搜索模型' : 'Search models'" />
        <div class="status-legend"><ServiceStateBadge v-for="state in (['ok', 'degraded', 'down', 'idle'] as const)" :key="state" :state="state" /></div>
      </div>
      <p class="status-note">{{ zh ? `每格 ${data.bucketMinutes} 分钟；当前状态取最近一小时中较差的状态。成功率和首个输出耗时为 24 小时统计，无请求不代表正常。仅展示对话、图像和视频模型。` : `Each bar covers ${data.bucketMinutes} minutes. Current status reflects the worse state over the past hour. Success rate and first output latency cover 24 hours. No requests means no data. Chat, image and video models only.` }}</p>
      <article v-for="model in models" :key="model.id" class="status-model">
        <div class="status-model-head">
          <div><h2>{{ model.displayName }}</h2><small>{{ model.id }}</small></div>
          <ServiceStateBadge :state="error ? undefined : model.state" />
        </div>
        <div class="status-metrics">
          <span>{{ zh ? '成功率' : 'Success rate' }} <strong>{{ model.successRate == null ? '—' : `${(model.successRate * 100).toFixed(1)}%` }}</strong></span>
          <span>{{ zh ? '首个输出 P50' : 'First output P50' }} <strong>{{ model.firstOutputP50Ms == null ? '—' : `${(model.firstOutputP50Ms / 1000).toFixed(2)}s` }}</strong></span>
        </div>
        <div class="status-bars" :aria-label="zh ? '最近 24 小时的请求状态' : 'Request status over 24 hours'">
          <span v-for="(bucket, index) in model.buckets" :key="index" :data-state="bucket?.state || 'idle'" :title="bucketTitle(bucket, index)" tabindex="0" />
        </div>
        <div class="status-axis"><small>{{ date(data.windowStart) }}</small><small>{{ zh ? '现在' : 'Now' }}</small></div>
      </article>
      <p v-if="!models.length">{{ zh ? '没有匹配的模型。' : 'No matching models.' }}</p>
    </template>
  </main>
</template>
<style scoped>
.status-page { max-width: 1000px; padding: 56px 20px 96px; margin: auto; color: var(--text-primary); }
header, .status-summary, .status-tools, .status-model-head, .status-axis { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
h1 { font-size: 32px; font-weight: 700; margin: 0; }
header p, .status-note, small { color: var(--text-secondary); }
header p { margin-top: 10px; }
.status-summary { padding: 24px; margin: 28px 0; border: 1px solid var(--border); border-radius: 12px; }
.status-summary small { margin-left: auto; }
.status-legend { display: flex; flex-wrap: wrap; gap: 16px; }
.status-note { font-size: 13px; line-height: 1.8; margin: 20px 0; }
.status-model { border-top: 1px solid var(--border); padding: 24px 0; }
h2 { font-size: 17px; font-weight: 650; margin: 0; }
.status-model-head small { font-size: 12px; overflow-wrap: anywhere; }
.status-metrics { display: flex; gap: 24px; font-size: 12px; margin: 16px 0 12px; color: var(--text-secondary); }
.status-metrics strong { color: var(--text-primary); margin-left: 6px; }
.status-bars { display: flex; gap: 3px; }
.status-bars span { flex: 1; min-width: 0; height: 28px; border-radius: 3px; background: var(--border); }
.status-bars [data-state="ok"] { background: #2f9468; }
.status-bars [data-state="degraded"] { background: #d49424; }
.status-bars [data-state="down"] { background: #d94b45; }
.status-bars span:focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; }
.status-axis { margin-top: 6px; font-size: 12px; }
.status-error { color: #c0362c; margin-top: 24px; }
</style>
