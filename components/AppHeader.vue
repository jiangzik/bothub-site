<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()

const { localePath, isEnabled, locales } = useDocusI18n()
</script>

<template>
  <UHeader
    :to="localePath('/')"
    :title="appConfig.header?.title || site.name"
  >
    <template #title>
      <AppHeaderLogo class="w-auto shrink-0" />
    </template>

    <template #right>
      <AppHeaderCTA />

      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>

        <USeparator
          orientation="vertical"
          class="h-8"
        />
      </template>

      <ClientOnly>
        <UColorModeButton />
      </ClientOnly>

    </template>

    <template #body>
      <div class="bothub-mobile-menu">
        <NuxtLink
          :to="localePath('/quick-start/overview')"
          class="bothub-mobile-menu-link"
        >
          快速开始 · Quick Start
        </NuxtLink>
        <NuxtLink
          :to="localePath('/manual/overview')"
          class="bothub-mobile-menu-link"
        >
          功能手册 · Manual
        </NuxtLink>
        <NuxtLink
          :to="localePath('/faq/overview')"
          class="bothub-mobile-menu-link"
        >
          常见问题 · FAQ
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>
