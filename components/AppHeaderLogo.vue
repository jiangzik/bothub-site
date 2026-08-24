<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <span class="terminal-logo">
    <span class="terminal-logo-prompt">&gt;</span>
    <span class="terminal-logo-text">{{ appConfig.header?.title || 'BOTHUB' }}</span>
  </span>
</template>

<style scoped>
.terminal-logo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
}
.terminal-logo-prompt {
  color: var(--terra, #c67a4b);
}
.terminal-logo-text {
  color: var(--ink, #3d2b1f);
}
</style>
