<script setup lang="ts">
const { locale } = useDocusI18n()
useSeoMeta({
  title: () => locale.value === 'en' ? 'Model Plaza' : '模型广场',
  description: () => locale.value === 'en'
    ? 'Browse BotHub models, capabilities, pricing and service status.'
    : '查看 BotHub 模型、能力、价格和服务状态。',
})
</script>

<template>
  <ModelPlaza />
</template>
