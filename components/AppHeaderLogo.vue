<script setup lang="ts">
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app.baseURL || '/'

const logoSrc = computed(() => {
  const base = appBaseURL === '/' ? '/' : appBaseURL
  return `${base}logo-mark-light.png`
})

const logoStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: '15px',
  fontWeight: '700',
  color: 'var(--bothub-text, #0a0a0a)',
  lineHeight: '1',
}

const logoImageStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '7px',
  display: 'block',
  objectFit: 'cover',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
}
</script>

<template>
  <span :style="logoStyle">
    <img :src="logoSrc" alt="BotHub" :style="logoImageStyle" />
    <span>{{ appConfig.header?.title || 'BotHub' }}</span>
  </span>
</template>
