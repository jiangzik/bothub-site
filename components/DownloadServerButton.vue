<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Server' })
</script>

<template>
  <DownloadButton platform="server" :label="label"><slot /></DownloadButton>
</template>
