<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()

const { locale, localePath, isEnabled, locales } = useDocusI18n()
const docsPath = useDocsPath()

const downloadLabel = computed(() => locale.value === 'en' ? 'Download' : '下载')
const headerOpen = ref(false)
</script>

<template>
  <UHeader
    v-model:open="headerOpen"
    :ui="{
      root: 'h-auto',
      container: 'min-h-(--ui-header-height) gap-x-4 py-2 sm:gap-x-6',
      left: 'lg:flex-none',
      center: 'hidden lg:flex flex-1 justify-end',
      right: 'min-w-0 flex-wrap gap-x-4 gap-y-0 sm:gap-x-6 lg:flex-none',
      header: 'h-auto min-h-(--ui-header-height) gap-x-4 py-2 sm:gap-x-6',
    }"
    :to="localePath('/')"
    :title="appConfig.header?.title || site.name"
  >
    <AppHeaderCenter />

    <template #title>
      <AppHeaderLogo class="w-auto shrink-0" />
    </template>

    <template #right>
      <AccountHeader />

      <NuxtLink
        :to="`${localePath('/')}#download`"
        class="bothub-header-link bothub-header-download"
      >
        <span>{{ downloadLabel }}</span>
        <i aria-hidden="true">↓</i>
      </NuxtLink>

      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>
      </template>

      <ClientOnly>
        <UColorModeButton />
      </ClientOnly>
    </template>

    <template #body>
      <div class="mobile-menu-body">
        <div class="mobile-menu-cmd">BotHub</div>
        <NuxtLink
          :to="`${localePath('/')}#models`"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Model Plaza' : '模型广场' }}
        </NuxtLink>
        <NuxtLink
          :to="docsPath('/quick-start/overview')"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Quick Start' : '快速开始' }}
        </NuxtLink>
        <NuxtLink
          :to="docsPath('/manual/overview')"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Manual' : '使用手册' }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/status')"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Service status' : '服务状态' }}
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>
