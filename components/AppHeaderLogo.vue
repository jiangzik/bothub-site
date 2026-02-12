<script setup lang="ts">
const appConfig = useAppConfig()

const logoHeight = computed(() => appConfig.header?.logo?.height || '40px')
</script>

<template>
  <UColorModeImage
    v-if="appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
    :light="appConfig.header?.logo?.light || appConfig.header?.logo?.dark"
    :dark="appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
    :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
    class="w-auto shrink-0"
    :style="{ height: logoHeight }"
  />
  <span
    v-else
    class="text-lg font-semibold"
  >
    {{ appConfig.header?.title || '{appConfig.header.title}' }}
  </span>
</template>
