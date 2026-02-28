<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Android' })
</script>

<template>
  <DownloadButton platform="android" :label="label"><slot /></DownloadButton>
</template>
