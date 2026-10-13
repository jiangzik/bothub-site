<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const docsPath = useDocsPath()
const account = useBothubAccount()
const user = account.user
const open = ref(false)
const zh = computed(() => locale.value !== 'en')
const items = computed(() => [[
  { label: 'API Keys', icon: 'i-lucide-key-round', to: localePath('/account') },
  { label: zh.value ? '充值' : 'Top up', to: docsPath('/pay') },
], [{ label: zh.value ? '退出登录' : 'Sign out', onSelect: () => account.logout() }]])
function showLogin(): void { open.value = true }
onMounted(account.restore)
watch(user, (value) => { if (value) open.value = false })
</script>
<template>
  <ClientOnly>
    <UDropdownMenu v-if="user" :items="items" :content="{ align: 'end' }">
      <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down" :aria-label="user.email" class="max-w-36">
        <span class="truncate">{{ user.name || user.email }}</span>
      </UButton>
    </UDropdownMenu>
    <UButton v-else color="neutral" variant="outline" @click="showLogin">{{ zh ? '登录' : 'Sign in' }}</UButton>
    <UModal v-model:open="open" :title="zh ? '登录 BotHub' : 'Sign in to BotHub'" :ui="{ content: 'max-w-md' }">
      <template #body><AccountAuthForm :lang="zh ? 'zh' : 'en'" /></template>
    </UModal>
  </ClientOnly>
</template>
