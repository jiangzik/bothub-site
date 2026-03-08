<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()

const { localePath, isEnabled, locales } = useDocusI18n()

const links = computed(() => appConfig.github && appConfig.github.url
  ? [
      {
        'icon': 'i-simple-icons-github',
        'to': appConfig.github.url,
        'target': '_blank',
        'aria-label': 'GitHub',
      },
    ]
  : [])
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

      <template v-if="links?.length">
        <UButton
          v-for="(link, index) of links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
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
          {{ $t('docs.links') === 'Community' ? 'quick-start' : 'quick-start' }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/manual/overview')"
          class="mobile-menu-link"
        >
          <span class="mobile-menu-prompt">&gt;</span>
          {{ $t('docs.links') === 'Community' ? 'manual' : 'manual' }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/faq/overview')"
          class="mobile-menu-link"
        >
          <span class="mobile-menu-prompt">&gt;</span>
          {{ $t('docs.links') === 'Community' ? 'faq' : 'faq' }}
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>
