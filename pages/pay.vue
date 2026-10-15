<script setup lang="ts">
const { locale } = useDocusI18n()
const zh = computed(() => locale.value !== 'en')
const target = useWebAppRedirect('/pay')

useSeoMeta({ title: () => zh.value ? '充值' : 'Top up', robots: 'noindex' })
</script>

<template>
  <main class="web-app-redirect">
    <p>{{ zh ? '正在前往 BotHub 网页版充值…' : 'Opening BotHub Web to top up…' }}</p>
    <a :href="target">{{ zh ? '没有自动跳转？点这里' : 'Not redirected? Click here' }}</a>
  </main>
</template>

<style scoped>
.web-app-redirect {
  display: flex;
  min-height: 50vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.web-app-redirect a {
  color: var(--ui-primary);
}
</style>
