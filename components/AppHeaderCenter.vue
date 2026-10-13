<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const docsPath = useDocsPath()

const labels = computed(() => locale.value === 'en'
  ? { product: 'Product', models: 'Model Plaza', docs: 'Docs', status: 'Service status' }
  : { product: '产品', models: '模型广场', docs: '文档', status: '服务状态' })
</script>

<template>
  <nav class="bothub-header-nav" :aria-label="labels.product">
    <NuxtLink class="bothub-header-link" :to="docsPath('/faq/overview')">{{ labels.docs }}</NuxtLink>
    <NuxtLink class="bothub-header-link" :to="localePath('/status')">{{ labels.status }}</NuxtLink>
    <NuxtLink class="bothub-header-link" :to="localePath('/models')">{{ labels.models }}</NuxtLink>
  </nav>
</template>
