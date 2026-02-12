<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string; idLabel?: string }>(), {
  label: 'Join QQ Group',
  idLabel: 'QQ Group',
})

const QQ_GROUP_URL = 'https://qm.qq.com/q/sWqmwBTc76'
const QQ_GROUP_ID = '292036480'
</script>

<template>
  <UButton
    color="primary"
    size="xl"
    :to="QQ_GROUP_URL"
    external
    :title="`${props.idLabel}: ${QQ_GROUP_ID}`"
  >
    <slot>{{ props.label }}</slot>
    <span class="ms-1">({{ QQ_GROUP_ID }})</span>
  </UButton>
</template>
