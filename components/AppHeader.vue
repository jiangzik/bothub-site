<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()

const { localePath, isEnabled, locales } = useDocusI18n()
</script>

<template>
  <UHeader
    :ui="{ center: 'hidden lg:flex flex-1' }"
    :to="localePath('/')"
    :title="appConfig.header?.title || site.name"
  >
    <AppHeaderCenter />

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

      <ClientOnly>
        <UContentSearchButton class="lg:hidden" />
      </ClientOnly>
    </template>

    <template #body>
      <div class="mobile-menu-body">
        <div class="mobile-menu-cmd">$ bothub --navigate</div>
        <UContentSearchButton class="w-full mobile-menu-btn" />
        <NuxtLink
          :to="localePath('/quick-start/overview')"
          class="mobile-menu-link"
        >
          <span class="mobile-menu-prompt">&gt;</span>
          quick-start
        </NuxtLink>
        <NuxtLink
          :to="localePath('/manual/overview')"
          class="mobile-menu-link"
        >
          <span class="mobile-menu-prompt">&gt;</span>
          manual
        </NuxtLink>
        <NuxtLink
          :to="localePath('/faq/overview')"
          class="mobile-menu-link"
        >
          <span class="mobile-menu-prompt">&gt;</span>
          faq
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>
