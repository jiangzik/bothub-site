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
      class="h-8 px-2 text-sm"
    >
      {{ currentLocaleName }}
    </UButton>

    <template #content>
      <ul class="flex flex-col min-w-[120px]">
        <li
          v-for="localeItem in locales"
          :key="localeItem.code"
        >
          <NuxtLink
            class="flex items-center py-1.5 px-2 text-sm hover:bg-muted"
            :to="switchLocalePath(localeItem.code) as string"
            :aria-label="localeItem.name"
          >
            {{ localeItem.name }}
          </NuxtLink>
        </li>
      </ul>
    </template>
  </UPopover>
</template>
