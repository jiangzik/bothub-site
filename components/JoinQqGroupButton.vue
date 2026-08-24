<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string; idLabel?: string }>(), {
  label: 'Join QQ Group',
  idLabel: 'QQ Group',
})

const QQ_GROUP_URL = 'https://qm.qq.com/q/sWqmwBTc76'
const QQ_GROUP_ID = '292036480'
</script>

<template>
  <a
    :href="QQ_GROUP_URL"
    class="term-download-link"
    target="_blank"
    rel="noopener"
    :title="`${props.idLabel}: ${QQ_GROUP_ID}`"
  >
    <span class="term-prompt">&gt;</span>
    <span class="term-cmd-text">connect --group={{ QQ_GROUP_ID }}</span>
    <span class="term-label"><slot>{{ props.label }}</slot></span>
  </a>
</template>
