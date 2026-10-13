<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const docsPath = useDocsPath()
const account = useBothubAccount()
const user = account.user
const open = ref(false)
const zh = computed(() => locale.value !== 'en')
const displayName = computed(() => user.value?.name?.trim() || user.value?.email || '')
const shortcuts = computed(() => [
  { label: 'API Keys', to: localePath('/account') },
  { label: zh.value ? '充值' : 'Top up', to: docsPath('/pay') },
])
const items = computed(() => [
  { label: user.value?.email || '', type: 'label' as const },
  ...shortcuts.value.map(link => ({ ...link, class: 'lg:hidden' })),
  { label: zh.value ? '退出登录' : 'Sign out', onSelect: () => account.logout() },
])
function showLogin(): void { open.value = true }
onMounted(account.restore)
watch(user, (value) => { if (value) open.value = false })
</script>
<template>
  <ClientOnly>
    <template v-if="user">
      <div class="hidden lg:contents">
        <NuxtLink v-for="link in shortcuts" :key="link.to" class="bothub-header-link" :to="link.to">{{ link.label }}</NuxtLink>
      </div>
      <UDropdownMenu :items="items" :content="{ align: 'end' }" :ui="{ content: 'w-56 max-w-[calc(100vw-2rem)]' }">
        <button type="button" class="bothub-header-link min-w-0" :title="displayName" :aria-label="`${displayName} ${zh ? '账号菜单' : 'Account menu'}`"><span class="bothub-header-account-name">{{ displayName }}</span></button>
      </UDropdownMenu>
    </template>
    <button v-else type="button" class="bothub-header-link" @click="showLogin">{{ zh ? '登录' : 'Sign in' }}</button>
    <UModal v-model:open="open" :title="zh ? '登录 BotHub' : 'Sign in to BotHub'" :ui="{ content: 'max-w-md' }">
      <template #body><AccountAuthForm :lang="zh ? 'zh' : 'en'" /></template>
    </UModal>
  </ClientOnly>
</template>
