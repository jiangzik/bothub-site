<script setup lang="ts">
const { locale, locales, switchLocalePath } = useDocusI18n()

const currentLocaleName = computed(() => {
  return locales.find(item => item.code === locale.value)?.name || locale.value
})
</script>

<template>
  <UPopover
    mode="hover"
    :content="{ align: 'end' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      class="language-select-trigger"
    >
      {{ currentLocaleName }}
    </UButton>

    <template #content>
      <ul class="language-select-menu">
        <li
          v-for="localeItem in locales"
          :key="localeItem.code"
        >
          <NuxtLink
            class="language-select-item"
            :to="switchLocalePath(localeItem.code) as string"
            :aria-label="localeItem.name"
            :aria-current="localeItem.code === locale ? 'page' : undefined"
          >
            {{ localeItem.name }}
          </NuxtLink>
        </li>
      </ul>
    </template>
  </UPopover>
</template>
