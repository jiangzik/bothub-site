<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Linux' })
</script>

<template>
  <DownloadButton platform="linux" :label="label"><slot /></DownloadButton>
</template>
