<script setup lang="ts">
const { locale, locales, switchLocalePath } = useDocusI18n()

const currentLocaleName = computed(() => {
  return locales.find(item => item.code === locale.value)?.name || locale.value
})
</script>

<template>
  <UPopover
    :content="{ align: 'end' }"
  >
    <button type="button" class="bothub-header-link" :aria-label="locale === 'en' ? 'Language' : '切换语言'">
      {{ currentLocaleName }}
    </button>

    <template #content="{ close }">
      <ul class="language-select-menu">
        <li
          v-for="localeItem in locales"
          :key="localeItem.code"
        >
          <NuxtLink
            class="language-select-item"
            :to="switchLocalePath(localeItem.code) as string"
            :aria-label="localeItem.name"
            @click="close"
            :aria-current="localeItem.code === locale ? 'page' : undefined"
          >
            {{ localeItem.name }}
          </NuxtLink>
        </li>
      </ul>
    </template>
  </UPopover>
</template>
