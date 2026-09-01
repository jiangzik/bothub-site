<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()

const { locale, localePath, isEnabled, locales } = useDocusI18n()

const downloadLabel = computed(() => locale.value === 'en' ? 'Download' : '下载')
const headerOpen = ref(false)
</script>

<template>
  <UHeader
    v-model:open="headerOpen"
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

      <NuxtLink
        :to="`${localePath('/')}#download`"
        class="bothub-header-download"
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
          :to="`${localePath('/')}#capabilities`"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Capabilities' : '能力' }}
        </NuxtLink>
        <NuxtLink
          :to="`${localePath('/')}#continuity`"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Continuity' : '跨端' }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/quick-start/overview')"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Quick Start' : '快速开始' }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/manual/overview')"
          class="mobile-menu-link"
          @click="headerOpen = false"
        >
          {{ locale === 'en' ? 'Manual' : '使用手册' }}
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>
