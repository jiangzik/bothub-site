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
    class="bothub-qq-button"
    target="_blank"
    rel="noopener"
    :title="`${props.idLabel}: ${QQ_GROUP_ID}`"
  >
    <span class="bothub-qq-icon"><UIcon name="i-simple-icons-tencentqq" /></span>
    <span class="bothub-qq-text">
      <slot>{{ props.label }}</slot>
      <span class="bothub-qq-id">#{{ QQ_GROUP_ID }}</span>
    </span>
  </a>
</template>
