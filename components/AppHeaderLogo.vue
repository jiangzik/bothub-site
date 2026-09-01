<script setup lang="ts">
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const logoSrc = computed(() => {
  const baseURL = runtimeConfig.app.baseURL || '/'
  return `${baseURL.endsWith('/') ? baseURL : `${baseURL}/`}logo.png`
})
</script>

<template>
  <span class="bothub-brand">
    <img :src="logoSrc" alt="" class="bothub-brand-mark">
    <span class="bothub-brand-text">{{ appConfig.header?.title || 'BotHub' }}</span>
  </span>
</template>

<style scoped>
.bothub-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.bothub-brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

.bothub-brand-text {
  color: var(--ink, #000);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.03em;
}
</style>
