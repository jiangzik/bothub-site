<script setup lang="ts">
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app.baseURL || '/'

const logoSrc = computed(() => {
  const base = appBaseURL === '/' ? '/' : appBaseURL
  return `${base}logo.png`
})
</script>

<template>
  <span class="bothub-logo">
    <img :src="logoSrc" alt="BotHub" class="bothub-logo-img" width="28" height="28" />
    <span class="bothub-logo-text">{{ appConfig.header?.title || 'BotHub' }}</span>
  </span>
</template>

<style scoped>
.bothub-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--bothub-text, #0a0a0a);
}
.bothub-logo-img {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: block;
  object-fit: cover;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
:global(.dark) .bothub-logo {
  color: #f5f5f5;
}
</style>
