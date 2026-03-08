<script setup lang="ts">
import type { VersionManifest } from '~/types/version'

const props = withDefaults(defineProps<{ label?: string }>(), { label: 'Server' })

const route = useRoute()
const open = ref(false)
const copied = ref(false)
const previousBodyOverflow = ref<string | null>(null)

const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app.baseURL || '/'

const resolveSiteUrl = (value: string): string => {
  if (!value) return ''
  if (/^(?:[a-z]+:)?\/\//i.test(value)) return value
  if (appBaseURL !== '/' && value.startsWith(appBaseURL)) return value
  const normalized = value.replace(/^\/+/, '')
  if (appBaseURL === '/') return `/${normalized}`
  return `${appBaseURL}${normalized}`
}

const { data } = await useFetch<VersionManifest>('version.json', {
  baseURL: appBaseURL,
  default: () => ({}),
  server: false,
})

const serverUrl = computed(() => {
  const value = data.value?.server
  const url = typeof value === 'string' ? value : value?.url
  const downloads = runtimeConfig.public?.downloads as Record<string, string> | undefined
  return resolveSiteUrl(url || downloads?.server || '')
})

const versionText = computed(() => {
  const versions = runtimeConfig.public?.versions as Record<string, string> | undefined
  return data.value?.version || versions?.server || ''
})

const commandText = computed(() => {
  if (!serverUrl.value) return ''
  return `set -e; url="${serverUrl.value}"; workdir="\${HOME}/bothub-server"; tmp="$(mktemp -d)"; curl -fsSL "$url" -o "$tmp/bothub-server.tar.gz"; rm -rf "$workdir"; mkdir -p "$workdir"; tar -xzf "$tmp/bothub-server.tar.gz" -C "$workdir" --strip-components=1; cd "$workdir"; HOST=0.0.0.0 PORT=3000 bash serve.sh`
})

const isEn = computed(() => route.path.startsWith('/en'))

const titleText = computed(() => (isEn.value ? 'Server One-Line Install' : '服务器一条命令安装'))
const descriptionText = computed(() => {
  return isEn.value
    ? 'Run this command on Linux to download, unpack, install dependencies, and start BotHub Server.'
    : '在 Linux 服务器执行下面命令，可自动下载、解压、安装依赖并启动 BotHub Server。'
})
const copyLabel = computed(() => {
  if (isEn.value) return copied.value ? 'Copied' : 'Copy Command'
  return copied.value ? '已复制' : '复制命令'
})
const downloadLabel = computed(() => (isEn.value ? 'Download Archive' : '下载压缩包'))

const shouldRender = computed(() => !!serverUrl.value)

watch(open, (value) => {
  if (!process.client) return
  if (value) {
    previousBodyOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  if (previousBodyOverflow.value !== null) {
    document.body.style.overflow = previousBodyOverflow.value
    previousBodyOverflow.value = null
  }
})

onBeforeUnmount(() => {
  if (!process.client) return
  if (previousBodyOverflow.value !== null) {
    document.body.style.overflow = previousBodyOverflow.value
    previousBodyOverflow.value = null
  }
})

async function copyCommand() {
  if (!process.client || !commandText.value) return
  try {
    await navigator.clipboard.writeText(commandText.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  }
  catch {
    copied.value = false
  }
}
</script>

<template>
  <a
    v-if="shouldRender"
    href="#"
    class="term-download-link"
    @click.prevent="open = true"
  >
    <span class="term-prompt">&gt;</span>
    <span class="term-cmd-text">./install --platform=server</span>
    <span v-if="versionText" class="term-version">v{{ versionText }}</span>
  </a>

  <UModal
    v-model:open="open"
    :title="titleText"
    :description="descriptionText"
    :dismissible="true"
    :content="{ class: 'bothub-modal-surface bothub-modal--server w-[calc(100vw-1rem)] sm:w-[min(1080px,calc(100vw-2rem))] sm:max-w-none' }"
    :ui="{
      header: 'bothub-modal__header',
      title: 'bothub-modal__title',
      description: 'bothub-modal__description',
      close: 'bothub-modal__close',
      body: 'bothub-modal__body pt-1',
      footer: 'bothub-modal__footer justify-start gap-2'
    }"
  >
    <template #body>
      <pre class="server-command"><code>{{ commandText }}</code></pre>
    </template>

    <template #footer>
      <UButton color="neutral" variant="outline" @click="copyCommand">
        {{ copyLabel }}
      </UButton>
      <UButton color="primary" :to="serverUrl" external>
        {{ downloadLabel }}
      </UButton>
    </template>
  </UModal>
</template>

<style scoped>
.server-command {
  margin: 0;
  padding: 0.9rem;
  border: 1px solid var(--border, #e0d5c5);
  border-radius: 4px;
  background: color-mix(in srgb, var(--sand, #e8dcc8) 20%, transparent);
  box-shadow: none;
  overflow-x: auto;
}

.server-command code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-primary, #3d2b1f);
}
</style>
