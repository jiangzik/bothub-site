<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()

const { locale, localePath, isEnabled, locales } = useDocusI18n()
const docsPath = useDocsPath()

const headerOpen = ref(false)
</script>

<template>
  <UHeader
    v-model:open="headerOpen"
    :ui="{
      root: 'h-auto',
      container: 'min-h-(--ui-header-height) gap-x-4 py-2 sm:gap-x-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
      left: 'lg:flex-none lg:justify-self-start',
      center: 'hidden lg:flex justify-center lg:justify-self-center',
      right: 'min-w-0 flex-wrap gap-x-4 gap-y-0 sm:gap-x-6 lg:flex-none lg:max-w-full lg:justify-self-end',
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


      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>
      </template>

      <ClientOnly>
        <UColorModeButton class="bothub-header-theme" />
      </ClientOnly>
    </template>

    <template #body>
      <div class="mobile-menu-body">
        <div class="mobile-menu-cmd">BotHub</div>
        <NuxtLink
          :to="localePath('/models')"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Model Plaza' : '模型广场' }}
        </NuxtLink>
        <NuxtLink :to="docsPath('/faq/overview')" class="mobile-menu-link" @click="headerOpen = false">
          {{ locale === 'en' ? 'FAQ' : '常见问题' }}
        </NuxtLink>
        <NuxtLink :to="docsPath('/api/overview')" class="mobile-menu-link" @click="headerOpen = false">
          {{ locale === 'en' ? 'Developer API' : '开发者 API' }}
        </NuxtLink>
        <NuxtLink :to="docsPath('/macos-install')" class="mobile-menu-link" @click="headerOpen = false">
          {{ locale === 'en' ? 'macOS Install Guide' : 'macOS 安装指南' }}
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
