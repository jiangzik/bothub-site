<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'macOS' })
</script>

<template>
  <DownloadButton platform="mac" :label="label"><slot /></DownloadButton>
</template>
