<script setup lang="ts">
const props = defineProps<{ lang: 'zh' | 'en', disabled: boolean }>()
const emit = defineEmits<{ credential: [idToken: string, nonce: string] }>()
const { $googleSignIn } = useNuxtApp()
const colorMode = useColorMode()
const target = ref<HTMLElement>()
const status = ref<'loading' | 'ready' | 'error'>('loading')
let dispose: (() => void) | undefined
let pending: AbortController | undefined
let revision = 0

async function render(): Promise<void> {
  const element = target.value
  if (!element) return
  const current = ++revision
  pending?.abort()
  dispose?.()
  pending = new AbortController()
  status.value = 'loading'
  try {
    const cleanup = await $googleSignIn.render(element, {
      locale: props.lang === 'zh' ? 'zh_CN' : 'en',
      dark: colorMode.value === 'dark',
      onCredential: (token, nonce) => { if (!props.disabled) emit('credential', token, nonce) },
      onError: () => { status.value = 'error' },
    }, pending.signal)
    if (current !== revision) { cleanup(); return }
    dispose = cleanup
    status.value = 'ready'
  }
  catch {
    if (current === revision) status.value = 'error'
  }
}
onMounted(render)
watch([() => props.lang, () => colorMode.value], render)
onBeforeUnmount(() => { revision++; pending?.abort(); dispose?.() })
</script>

<template>
  <div class="google-sign-in">
    <div ref="target" class="google-button" :inert="disabled || status !== 'ready'" :aria-busy="status === 'loading'" />
    <p v-if="status === 'loading'" class="google-status" role="status">{{ lang === 'zh' ? '正在加载 Google 登录…' : 'Loading Google sign-in…' }}</p>
    <div v-else-if="status === 'error'" class="google-status" role="alert">
      {{ lang === 'zh' ? '无法加载 Google 登录，请检查网络后重试。' : 'Google sign-in could not load. Check your connection and retry.' }}
      <button type="button" :disabled="disabled" @click="render">{{ lang === 'zh' ? '重试' : 'Retry' }}</button>
    </div>
  </div>
</template>

<style scoped>
.google-sign-in { margin-top: 20px; }
.google-button { display: flex; justify-content: center; width: 100%; min-height: 40px; }
.google-button[inert] { opacity: .5; }
.google-status { margin: 6px 0 0; color: var(--text-secondary); font-size: 13px; line-height: 1.6; }
.google-status button { margin-left: 6px; text-decoration: underline; cursor: pointer; }
</style>
