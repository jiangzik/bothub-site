<script setup lang="ts">
const { locale } = useDocusI18n()
const lang = computed(() => locale.value === 'en' ? 'en' : 'zh')

useSeoMeta({
  title: () => lang.value === 'en' ? 'Top up' : '充值',
  description: () => lang.value === 'en'
    ? 'Add AI credits or get Pro for your BotHub account.'
    : '为 BotHub 账号充值 AI 余额或开通 Pro。',
  robots: 'noindex',
})
</script>

<template>
  <RechargePage :lang="lang" />
</template>
