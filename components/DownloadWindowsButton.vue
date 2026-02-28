<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Windows' })
</script>

<template>
  <DownloadButton platform="windows" :label="label"><slot /></DownloadButton>
</template>
