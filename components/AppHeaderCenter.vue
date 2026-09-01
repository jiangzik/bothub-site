<script setup lang="ts">
const { locale, localePath } = useDocusI18n()

const labels = computed(() => locale.value === 'en'
  ? { product: 'Product', models: 'Model Plaza', capabilities: 'Capabilities', continuity: 'Continuity', docs: 'Docs', live: 'Live' }
  : { product: '产品', models: '模型广场', capabilities: '能力', continuity: '跨端', docs: '文档', live: '实时' })

const homePath = computed(() => localePath('/'))
</script>

<template>
  <div class="bothub-header-center">
    <nav class="bothub-header-nav" :aria-label="labels.product">
      <NuxtLink :to="`${homePath}#capabilities`">{{ labels.capabilities }}</NuxtLink>
      <NuxtLink :to="`${homePath}#continuity`">{{ labels.continuity }}</NuxtLink>
      <NuxtLink :to="localePath('/manual/overview')">{{ labels.docs }}</NuxtLink>
    </nav>
    <NuxtLink class="bothub-header-models" :to="`${homePath}#models`">
      <i />{{ labels.models }}<span>{{ labels.live }}</span>
    </NuxtLink>
  </div>
</template>
