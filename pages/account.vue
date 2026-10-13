<script setup lang="ts">
import type { DeveloperKey } from '~/types/developer-key'
const { locale } = useDocusI18n()
const docsPath = useDocsPath()
const zh = computed(() => locale.value !== 'en')
const account = useBothubAccount()
const user = account.user
const keys = ref<DeveloperKey[]>([])
const name = ref('')
const loading = ref(false)
const creating = ref(false)
const revoking = ref(false)
const message = ref('')
const secret = ref('')
const secretOpen = ref(false)
const copied = ref(false)
const revokeTarget = ref<DeveloperKey | null>(null)
const revokeOpen = ref(false)
let generation = 0
const describe = useBothubErrorMessage(zh)
async function loadKeys(): Promise<void> {
  const current = generation
  loading.value = true
  message.value = ''
  try {
    const data = await account.authed<{ items: DeveloperKey[] }>('/v1/developer/api-keys')
    if (current === generation) keys.value = data.items
  }
  catch (error) { if (current === generation) message.value = describe(error) }
  finally { if (current === generation) loading.value = false }
}
async function createKey(): Promise<void> {
  if (creating.value || secretOpen.value) return
  if (!name.value.trim()) { message.value = zh.value ? '请输入密钥名称。' : 'Enter a key name.'; return }
  const current = generation
  creating.value = true
  message.value = ''
  try {
    const result = await account.authed<{ apiKey: string; item: DeveloperKey }>('/v1/developer/api-keys', { body: { name: name.value.trim() } })
    if (current !== generation) return
    keys.value = [result.item, ...keys.value]
    secret.value = result.apiKey
    copied.value = false
    secretOpen.value = true
    name.value = ''
  }
  catch (error) { if (current === generation) message.value = describe(error) }
  finally { if (current === generation) creating.value = false }
}
async function copySecret(): Promise<void> {
  try { await navigator.clipboard.writeText(secret.value); copied.value = true }
  catch { message.value = zh.value ? '复制失败，请手动选择并复制密钥。' : 'Copy failed. Select and copy the key manually.' }
}
async function revokeKey(): Promise<void> {
  if (!revokeTarget.value || revoking.value) return
  const current = generation
  const id = revokeTarget.value.id
  revoking.value = true
  message.value = ''
  try {
    await account.authed(`/v1/developer/api-keys/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (current !== generation) return
    keys.value = keys.value.map(item => item.id === id ? { ...item, status: 'revoked' } : item)
    revokeOpen.value = false
  }
  catch (error) { if (current === generation) message.value = describe(error) }
  finally { if (current === generation) revoking.value = false }
}
function closeSecret(): void { secretOpen.value = false }
function cancelRevoke(): void { revokeOpen.value = false }
function keyState(key: DeveloperKey): string {
  if (key.status === 'revoked') return zh.value ? '已撤销' : 'Revoked'
  if (key.status === 'disabled') return zh.value ? '已停用' : 'Disabled'
  if (key.expiresAt != null && key.expiresAt <= Date.now()) return zh.value ? '已过期' : 'Expired'
  return zh.value ? '可用' : 'Active'
}
watch(secretOpen, (open) => { if (!open) { secret.value = ''; copied.value = false } })
watch(() => user.value?.id, (id) => {
  generation++
  keys.value = []
  secretOpen.value = false
  secret.value = ''
  revokeOpen.value = false
  revokeTarget.value = null
  name.value = ''
  loading.value = creating.value = revoking.value = false
  if (id) void loadKeys()
}, { immediate: true })
onMounted(account.restore)
onBeforeUnmount(() => { generation++; secret.value = '' })
useSeoMeta({ title: 'API Keys', robots: 'noindex' })
</script>
<template>
  <main class="key-page">
    <header><h1>API Keys</h1><p>{{ zh ? '生成密钥，通过兼容 OpenAI 的 API 使用 BotHub 模型。' : 'Create a key to use BotHub models through the OpenAI-compatible API.' }}</p></header>
    <ClientOnly>
      <section v-if="!user" class="key-card key-auth"><AccountAuthForm :lang="zh ? 'zh' : 'en'" /></section>
      <template v-else>
        <div class="key-account"><span>{{ user.email }}</span><NuxtLink :to="docsPath('/pay')">{{ zh ? '充值' : 'Top up' }} →</NuxtLink></div>
        <p class="key-note">{{ zh ? 'API 调用与 App 共用账号余额，按实际用量计费。' : 'API calls use the same account balance as the app and are billed by usage.' }}</p>
        <section class="key-card">
          <h2>{{ zh ? '新建 API Key' : 'Create API key' }}</h2>
          <form class="key-create" @submit.prevent="createKey">
            <label><span>{{ zh ? '密钥名称' : 'Key name' }}</span><UInput v-model="name" maxlength="120" required :placeholder="zh ? '例如：我的应用' : 'e.g. My app'" class="w-full" /></label>
            <UButton type="submit" :loading="creating" :disabled="loading || secretOpen">{{ zh ? '生成密钥' : 'Generate key' }}</UButton>
          </form>
          <p class="key-note">{{ zh ? '完整密钥仅在创建时显示一次，请保存在安全的地方。' : 'The full key is shown only once. Store it somewhere safe.' }}</p>
        </section>
        <p v-if="message" role="alert" class="key-error">{{ message }}</p>
        <section class="key-card">
          <div class="key-list-head"><h2>{{ zh ? '我的密钥' : 'My keys' }}</h2><UButton color="neutral" variant="ghost" :loading="loading" :disabled="creating || revoking" @click="loadKeys">{{ zh ? '刷新' : 'Refresh' }}</UButton></div>
          <p v-if="loading" role="status">{{ zh ? '加载中…' : 'Loading…' }}</p>
          <p v-else-if="!keys.length && !message" class="key-note">{{ zh ? '还没有 API Key，创建一个即可开始。' : 'No API keys yet. Create one to get started.' }}</p>
          <article v-for="key in keys" :key="key.id" class="key-item">
            <div><strong>{{ key.name }}</strong><code>{{ key.keyHint }}</code><small>{{ keyState(key) }} · {{ new Date(key.createdAt).toLocaleDateString(zh ? 'zh-CN' : 'en-US') }} · {{ key.scopes.join(', ') }}</small></div>
            <UButton v-if="key.status !== 'revoked'" color="error" variant="ghost" :disabled="revoking" @click="revokeTarget = key; revokeOpen = true">{{ zh ? '撤销' : 'Revoke' }}</UButton>
          </article>
        </section>
        <section class="key-card"><h2>{{ zh ? '接入 API' : 'Connect to the API' }}</h2><p class="key-note">Base URL</p><code class="key-base">{{ account.apiBaseUrl }}/v1</code><NuxtLink :to="docsPath('/api/overview')" class="key-docs">{{ zh ? '查看 API 文档' : 'Read API documentation' }} →</NuxtLink></section>
      </template>
      <UModal v-model:open="secretOpen" :dismissible="false" :close="false" :title="zh ? 'API Key 已生成' : 'API key created'" :description="zh ? '完整密钥仅显示这一次。关闭前请复制保存，不要分享给他人。' : 'This is the only time the full key is shown. Copy it before closing and keep it private.'">
        <template #body><code class="key-secret">{{ secret }}</code><p v-if="message" role="alert" class="key-error">{{ message }}</p></template>
        <template #footer><UButton :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" @click="copySecret">{{ copied ? (zh ? '已复制' : 'Copied') : (zh ? '复制密钥' : 'Copy key') }}</UButton><UButton color="neutral" variant="outline" @click="closeSecret">{{ zh ? '已保存，关闭' : 'Saved, close' }}</UButton></template>
      </UModal>
      <UModal v-model:open="revokeOpen" :dismissible="!revoking" :close="!revoking" :title="zh ? '撤销 API Key' : 'Revoke API key'" :description="zh ? `撤销「${revokeTarget?.name}」后，使用它的应用将无法继续调用 API。此操作无法撤回。` : `Applications using “${revokeTarget?.name}” will lose API access. This cannot be undone.`">
        <template #body><p v-if="message" role="alert" class="key-error">{{ message }}</p></template>
        <template #footer><UButton color="error" :loading="revoking" @click="revokeKey">{{ zh ? '确认撤销' : 'Revoke key' }}</UButton><UButton color="neutral" variant="outline" :disabled="revoking" @click="cancelRevoke">{{ zh ? '取消' : 'Cancel' }}</UButton></template>
      </UModal>
    </ClientOnly>
  </main>
</template>
<style scoped>
.key-page { max-width: 840px; margin: auto; padding: 56px 20px 96px; color: var(--text-primary); }
h1 { font-size: 32px; font-weight: 700; margin: 0; }
header p, .key-note { color: var(--text-secondary); line-height: 1.8; font-size: 14px; }
.key-card { border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-top: 24px; }
.key-auth { max-width: 440px; margin: 28px auto; }
h2 { font-size: 18px; font-weight: 650; margin: 0; }
.key-account, .key-list-head, .key-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.key-account { margin-top: 28px; overflow-wrap: anywhere; }
.key-create { display: flex; gap: 12px; align-items: end; margin-top: 20px; }
.key-create label { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
.key-note { margin: 12px 0 0; }
.key-item { border-top: 1px solid var(--border); padding: 20px 0; margin-top: 12px; }
.key-item > div { min-width: 0; display: flex; flex-direction: column; gap: 6px; overflow-wrap: anywhere; }
.key-item code, .key-item small { color: var(--text-secondary); font-size: 12px; }
.key-secret { display: block; white-space: pre-wrap; overflow-wrap: anywhere; user-select: all; font-size: 14px; line-height: 1.8; }
.key-base { display: block; overflow-wrap: anywhere; margin: 8px 0 16px; font-size: 13px; }
.key-error { color: #c0362c; margin-top: 16px; }
:global(.dark) .key-error { color: #ff8a80; }
a { text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 480px) { .key-create { align-items: stretch; flex-direction: column; } .key-card { padding: 18px; } }
</style>
