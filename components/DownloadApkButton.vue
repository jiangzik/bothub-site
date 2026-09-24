<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'APK' })
</script>

<template>
  <DownloadButton platform="android" channel="apk" title="APK" :label="label"><slot /></DownloadButton>
</template>
