<script setup lang="ts">
// 账号相关（登录、充值、API Key）都在 BotHub Web，官网只放入口。
const { locale } = useDocusI18n()
const zh = computed(() => locale.value !== 'en')
const links = computed(() => [
  { label: zh.value ? '充值' : 'Top up', href: webAppUrl('/pay'), desktopOnly: true },
  { label: zh.value ? '网页版' : 'Web app', href: webAppUrl('/'), desktopOnly: false },
])
</script>

<template>
  <a
    v-for="link in links"
    :key="link.href"
    class="bothub-header-link"
    :class="{ 'hidden lg:inline-flex': link.desktopOnly }"
    :href="link.href"
  >{{ link.label }}</a>
</template>
