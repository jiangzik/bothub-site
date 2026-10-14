<script setup lang="ts">
type ModelKind = 'chat' | 'embedding' | 'image_generation' | 'video_generation' | 'text_to_speech' | string
type ModelFilter = 'all' | 'chat' | 'vision' | 'creative' | 'free'

interface ModelPricing {
  input_yuan_per_million?: number | null
  output_yuan_per_million?: number | null
  unit_yuan?: number | null
}

interface PublicModel {
  id: string
  display_name: string
  kind: ModelKind
  input_modalities?: string[]
  output_modalities?: string[]
  capabilities?: Record<string, unknown>
  billing?: string
  summary?: string | null
  pricing?: ModelPricing | null
}

interface ModelCatalogResponse {
  object: string
  data: PublicModel[]
}

const { locale, localePath } = useDocusI18n()
const { data: serviceStatus, error: serviceStatusError } = useModelServiceStatus()
const statusByModel = computed(() => new Map(serviceStatus.value?.models.map(model => [model.id, model.state]) || []))
const runtimeConfig = useRuntimeConfig()
const isZh = computed(() => locale.value !== 'en')
const activeFilter = ref<ModelFilter>('all')

const copy = computed(() => isZh.value ? {
  index: '模型广场',
  intro: '登录就能用，按用量计费，价格都列在下面。也可以填自己的 API Key。',
  filters: {
    all: '全部',
    chat: '对话',
    vision: '视觉',
    creative: '生成',
    free: '免费额度',
  },
  columns: ['模型', '类型', '能力', '价格'],
  kinds: {
    chat: '对话',
    embedding: '向量',
    image_generation: '图像',
    video_generation: '视频',
    text_to_speech: '语音',
  },
  capabilities: {
    reasoning: '推理',
    vision: '视觉',
    tools: '工具调用',
    search: '联网搜索',
    image: '图像生成',
    video: '视频生成',
    audio: '语音合成',
    embedding: '语义向量',
    text: '文本',
  },
  count: (n: number) => `共 ${n} 个模型`,
  syncing: '正在加载模型列表',
  free: '免费额度',
  metered: '按量计费',
  inputOutput: '每百万 tokens · 输入 / 输出',
  perImage: '每次生成',
  perSecond: '每秒视频',
  perAudio: '按文本用量',
  perTextBytes: '每百万文本字节',
  included: '登录即可用',
  more: '模型和价格会更新，以实际使用时为准。',
} : {
  index: 'Model Plaza',
  intro: 'Sign in and start. Pay only for what you use; prices are listed below. You can also bring your own API key.',
  filters: {
    all: 'All',
    chat: 'Chat',
    vision: 'Vision',
    creative: 'Generate',
    free: 'Free quota',
  },
  columns: ['Model', 'Type', 'Capabilities', 'Pricing'],
  kinds: {
    chat: 'Chat',
    embedding: 'Embedding',
    image_generation: 'Image',
    video_generation: 'Video',
    text_to_speech: 'Voice',
  },
  capabilities: {
    reasoning: 'Reasoning',
    vision: 'Vision',
    tools: 'Tool use',
    search: 'Web search',
    image: 'Image generation',
    video: 'Video generation',
    audio: 'Voice synthesis',
    embedding: 'Embeddings',
    text: 'Text',
  },
  count: (n: number) => `${n} models`,
  syncing: 'Loading models',
  free: 'Free quota',
  metered: 'Usage based',
  inputOutput: 'Per 1M tokens · input / output',
  perImage: 'Per generation',
  perSecond: 'Per video second',
  perAudio: 'By text usage',
  perTextBytes: 'Per 1M text bytes',
  included: 'Available after sign-in',
  more: 'Models and prices change over time. What you see in the app is current.',
})

const apiBaseUrl = String(runtimeConfig.public.cloudApiBaseUrl || 'https://bothub-api.bookab.info').replace(/\/+$/, '')
const emptyCatalog = (): ModelCatalogResponse => ({ object: 'list', data: [] })
const fetchCatalog = async (): Promise<ModelCatalogResponse> => {
  const response = await $fetch<ModelCatalogResponse>(`${apiBaseUrl}/v1/ai/models`, {
    query: { sort: 'marketplace' },
    timeout: 8_000,
    retry: 1,
  })

  return {
    object: response.object,
    data: (response.data || []).map(model => ({
      id: model.id,
      display_name: model.display_name,
      kind: model.kind,
      input_modalities: model.input_modalities,
      output_modalities: model.output_modalities,
      capabilities: {
        reasoning: model.capabilities?.reasoning === true,
        vision: model.capabilities?.vision === true,
        tools: model.capabilities?.tools === true,
        search: model.capabilities?.search === true,
      },
      billing: model.billing,
      summary: model.summary,
      pricing: model.pricing
        ? {
            input_yuan_per_million: model.pricing.input_yuan_per_million,
            output_yuan_per_million: model.pricing.output_yuan_per_million,
            unit_yuan: model.pricing.unit_yuan,
          }
        : null,
    })),
  }
}

const { data: catalog, error: catalogError, status: catalogStatus, refresh: refreshCatalog } = await useAsyncData(
  `bothub-public-model-catalog-${locale.value}`,
  fetchCatalog,
  { default: emptyCatalog },
)
onMounted(() => { void refreshCatalog() })

const models = computed(() => catalog.value?.data || [])

const matchesFilter = (model: PublicModel, filter: ModelFilter): boolean => {
  if (filter === 'all') return true
  if (filter === 'chat') return model.kind === 'chat'
  if (filter === 'vision') return model.capabilities?.vision === true || model.input_modalities?.includes('image') === true
  if (filter === 'creative') return ['image_generation', 'video_generation', 'text_to_speech'].includes(model.kind)
  return model.billing === 'free'
}

const filterItems = computed(() => (Object.keys(copy.value.filters) as ModelFilter[]).map(value => ({
  value,
  label: copy.value.filters[value],
  count: models.value.filter(model => matchesFilter(model, value)).length,
})))

const visibleModels = computed(() => models.value.filter(model => matchesFilter(model, activeFilter.value)))

const kindLabel = (kind: ModelKind): string => copy.value.kinds[kind as keyof typeof copy.value.kinds] || kind.replaceAll('_', ' ')

const capabilityLabels = (model: PublicModel): string[] => {
  if (model.kind === 'image_generation') return [copy.value.capabilities.image]
  if (model.kind === 'video_generation') return [copy.value.capabilities.video]
  if (model.kind === 'text_to_speech') return [copy.value.capabilities.audio]
  if (model.kind === 'embedding') return [copy.value.capabilities.embedding]

  const capabilities = model.capabilities || {}
  const items = [
    capabilities.reasoning === true ? copy.value.capabilities.reasoning : '',
    capabilities.vision === true ? copy.value.capabilities.vision : '',
    capabilities.tools === true ? copy.value.capabilities.tools : '',
    capabilities.search === true ? copy.value.capabilities.search : '',
  ].filter(Boolean)

  return items.length > 0 ? items.slice(0, 3) : [copy.value.capabilities.text]
}

const formatAmount = (value: number): string => new Intl.NumberFormat(isZh.value ? 'zh-CN' : 'en-US', {
  minimumFractionDigits: value < 1 ? 2 : 0,
  maximumFractionDigits: 2,
}).format(value)

const priceCopy = (model: PublicModel): { value: string, unit: string } => {
  if (model.billing === 'free') {
    return { value: copy.value.free, unit: copy.value.included }
  }

  const unitPrice = model.pricing?.unit_yuan
  if (unitPrice && unitPrice > 0) {
    const unit = model.kind === 'video_generation'
      ? copy.value.perSecond
      : model.kind === 'image_generation'
        ? copy.value.perImage
        : copy.value.perAudio
    return { value: `¥${formatAmount(unitPrice)}`, unit }
  }

  const inputPrice = model.pricing?.input_yuan_per_million
  const outputPrice = model.pricing?.output_yuan_per_million
  if (inputPrice != null || outputPrice != null) {
    if (model.kind === 'text_to_speech' && inputPrice != null && outputPrice == null) {
      return { value: `¥${formatAmount(inputPrice)}`, unit: copy.value.perTextBytes }
    }

    return {
      value: `¥${formatAmount(inputPrice || 0)} / ¥${formatAmount(outputPrice || 0)}`,
      unit: copy.value.inputOutput,
    }
  }

  return { value: copy.value.metered, unit: model.kind === 'text_to_speech' ? copy.value.perAudio : '' }
}
</script>

<template>
  <main class="signal-section signal-model-plaza" aria-labelledby="model-plaza-title">
    <header class="signal-section-head signal-model-plaza-head">
      <div>
        <h1 id="model-plaza-title">{{ copy.index }}</h1>
      </div>
      <p>{{ copy.intro }}</p>
    </header>

    <div class="signal-model-browser">
      <div class="signal-model-toolbar">
        <div class="signal-model-filters" role="tablist" :aria-label="copy.index">
          <button
            v-for="item in filterItems"
            :key="item.value"
            type="button"
            role="tab"
            :aria-selected="activeFilter === item.value"
            :class="{ active: activeFilter === item.value }"
            @click="activeFilter = item.value"
          >
            {{ item.label }} <span>{{ item.count }}</span>
          </button>
        </div>
        <p class="signal-model-live" aria-live="polite">
          {{ models.length > 0 ? copy.count(models.length) : copy.syncing }}
        </p>
      </div>

      <div class="signal-model-table-head" aria-hidden="true">
        <span v-for="column in copy.columns" :key="column">{{ column }}</span>
      </div>

      <div class="signal-model-list">
        <article v-for="model in visibleModels" :key="model.id" class="signal-model-row">
          <div class="signal-model-identity">
            <div>
              <strong :title="model.display_name || model.id">{{ model.display_name || model.id }}</strong>
              <NuxtLink v-if="statusByModel.has(model.id)" :to="localePath('/status')" class="model-status-link"><ServiceStateBadge :state="serviceStatusError ? undefined : statusByModel.get(model.id)" /></NuxtLink>
              <small v-if="model.summary">{{ model.summary }}</small>
            </div>
          </div>
          <span class="signal-model-kind">{{ kindLabel(model.kind) }}</span>
          <div class="signal-model-capabilities">
            <span v-for="capability in capabilityLabels(model)" :key="capability">{{ capability }}</span>
          </div>
          <div class="signal-model-price">
            <strong>{{ priceCopy(model).value }}</strong>
            <small>{{ priceCopy(model).unit }}</small>
          </div>
        </article>
        <div v-if="catalogError" class="signal-model-empty" role="alert">
          {{ isZh ? '模型列表加载失败。' : 'Could not load models.' }}
          <UButton color="neutral" variant="ghost" :loading="catalogStatus === 'pending'" @click="refreshCatalog()">{{ isZh ? '重试' : 'Retry' }}</UButton>
        </div>
        <div v-else-if="visibleModels.length === 0" class="signal-model-empty">{{ catalogStatus === 'pending' ? copy.syncing : (isZh ? '暂无匹配模型' : 'No matching models') }}</div>
      </div>

      <footer class="signal-model-footer">
        <p>{{ copy.more }}</p>
        <NuxtLink :to="localePath('/status')">{{ isZh ? '查看模型服务状态' : 'View model service status' }} →</NuxtLink>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.signal-model-plaza { padding: 56px 0 96px; border-bottom: 0; }
.signal-model-plaza-head { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; margin-bottom: 32px; }
.signal-model-plaza-head > p { max-width: 680px; margin: 0; font-size: 14px; line-height: 1.8; }
h1 { margin: 0; color: var(--ink); font-size: 32px; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; }
.model-status-link { display: inline-flex; grid-column: 2; text-decoration: none; }
.model-status-link:hover { text-decoration: underline; text-underline-offset: 3px; }
.signal-model-footer a { font-size: 13px; text-decoration: underline; text-underline-offset: 4px; }
</style>
