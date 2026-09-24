<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const docsPath = useDocsPath()

const labels = computed(() => locale.value === 'en'
  ? { product: 'Product', models: 'Model Plaza', capabilities: 'Features', continuity: 'Cross-device', docs: 'Docs' }
  : { product: '产品', models: '模型广场', capabilities: '功能', continuity: '跨端协同', docs: '文档' })

const homePath = computed(() => localePath('/'))
</script>

<template>
  <div class="bothub-header-center">
    <nav class="bothub-header-nav" :aria-label="labels.product">
      <NuxtLink :to="`${homePath}#capabilities`">{{ labels.capabilities }}</NuxtLink>
      <NuxtLink :to="`${homePath}#continuity`">{{ labels.continuity }}</NuxtLink>
      <NuxtLink :to="docsPath('/manual/overview')">{{ labels.docs }}</NuxtLink>
    </nav>
    <NuxtLink class="bothub-header-models" :to="`${homePath}#models`">
      <i />{{ labels.models }}
    </NuxtLink>
  </div>
</template>
