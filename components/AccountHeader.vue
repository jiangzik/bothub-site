<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const docsPath = useDocsPath()
const account = useBothubAccount()
const user = account.user
const open = ref(false)
const zh = computed(() => locale.value !== 'en')
const items = computed(() => [[
  { label: user.value?.email || '', type: 'label' as const },
], [{ label: zh.value ? '退出登录' : 'Sign out', onSelect: () => account.logout() }]])
function showLogin(): void { open.value = true }
onMounted(account.restore)
watch(user, (value) => { if (value) open.value = false })
</script>
<template>
  <ClientOnly>
    <template v-if="user">
      <NuxtLink class="bothub-header-link" :to="localePath('/account')">API Keys</NuxtLink>
      <NuxtLink class="bothub-header-link" :to="docsPath('/pay')">{{ zh ? '充值' : 'Top up' }}</NuxtLink>
      <UDropdownMenu :items="items" :content="{ align: 'end' }">
        <button type="button" class="bothub-header-link" :title="user.email" :aria-label="zh ? '账号菜单' : 'Account menu'">{{ zh ? '账号' : 'Account' }}</button>
      </UDropdownMenu>
    </template>
    <button v-else type="button" class="bothub-header-link" @click="showLogin">{{ zh ? '登录' : 'Sign in' }}</button>
    <UModal v-model:open="open" :title="zh ? '登录 BotHub' : 'Sign in to BotHub'" :ui="{ content: 'max-w-md' }">
      <template #body><AccountAuthForm :lang="zh ? 'zh' : 'en'" /></template>
    </UModal>
  </ClientOnly>
</template>
