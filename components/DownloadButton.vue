<script setup lang="ts">
import type { VersionManifest } from '~/types/version'

type Platform = 'android' | 'mac' | 'windows' | 'linux'

const PLATFORM_CONFIG: Record<Platform, {
  icon: string
  symbol: string
  defaultMainLabel: string
  defaultSubLabel: string
  downloadKey: keyof VersionManifest
  defaultUrl: string
  alwaysRender: boolean
}> = {
  android: { icon: 'i-simple-icons-android', symbol: '⬇', defaultMainLabel: 'Android APK', defaultSubLabel: 'APK · sideload', downloadKey: 'android', defaultUrl: '/downloads/app-release.apk', alwaysRender: true },
  mac: { icon: 'i-simple-icons-apple', symbol: '', defaultMainLabel: 'macOS', defaultSubLabel: 'DMG', downloadKey: 'mac', defaultUrl: '', alwaysRender: false },
  windows: { icon: 'i-simple-icons-windows11', symbol: '', defaultMainLabel: 'Windows', defaultSubLabel: 'EXE · Win 10+', downloadKey: 'windows', defaultUrl: '', alwaysRender: false },
  linux: { icon: 'i-simple-icons-linux', symbol: '', defaultMainLabel: 'Linux', defaultSubLabel: 'AppImage · 未经测试', downloadKey: 'linux', defaultUrl: '', alwaysRender: false },
}

const props = withDefaults(defineProps<{ platform: Platform; label?: string; channel?: string }>(), {
  label: '',
  channel: '',
})

const config = PLATFORM_CONFIG[props.platform]

const { data } = useVersionManifest()
const { locale } = useDocusI18n()

const downloadHref = computed(() => {
  const value = data.value?.[config.downloadKey]
  return getVersionEntryUrl(value) || config.defaultUrl
})

const selectedHref = ref('')
const selecting = ref(false)
const sourceState = ref<'idle' | 'probing' | 'ready' | 'downloading'>('idle')
let selectionRequest: Promise<string> | null = null

const versionText = computed(() => data.value?.version || '')
const platformArg = computed(() => props.channel || props.platform)
const isZh = computed(() => locale.value === 'zh')
const commandText = computed(() => {
  return isZh.value ? `./安装 --平台=${platformArg.value}` : `./install --platform=${platformArg.value}`
})

const shouldRender = computed(() => config.alwaysRender || !!downloadHref.value)

const effectiveDownloadHref = computed(() => selectedHref.value || downloadHref.value)

const selectedHost = computed(() => {
  const href = effectiveDownloadHref.value
  if (!href) return ''
  try {
    return new URL(href, typeof window === 'undefined' ? 'https://bothub.bookab.info' : window.location.origin).hostname
  } catch {
    return ''
  }
})

const sourceStatusText = computed(() => {
  if (!downloadHref.value) return isZh.value ? '未找到可用下载地址' : 'no download URL available'
  if (sourceState.value === 'probing') {
    return isZh.value ? '正在寻找最合适的下载源...' : 'probing mirrors for the best download source...'
  }
  if (sourceState.value === 'downloading') {
    const host = selectedHost.value ? ` ${selectedHost.value}` : ''
    return isZh.value ? `已选择下载源${host}，正在开始下载...` : `selected source${host}; starting download...`
  }
  if (sourceState.value === 'ready') {
    const host = selectedHost.value ? ` ${selectedHost.value}` : ''
    return isZh.value ? `已找到最合适的下载源${host}` : `best download source ready${host}`
  }
  return ''
})

watch(downloadHref, () => {
  selectedHref.value = ''
  selectionRequest = null
  sourceState.value = 'idle'
})

const warmBestDownloadUrl = (): Promise<string> => {
  const originUrl = downloadHref.value
  if (!originUrl || selectedHref.value) {
    if (selectedHref.value) sourceState.value = 'ready'
    return Promise.resolve(selectedHref.value || originUrl)
  }
  if (selectionRequest) return selectionRequest

  sourceState.value = 'probing'
  selectionRequest = selectBestDownloadUrl(
    originUrl,
    props.platform,
    data.value?.downloadSourceConfigUrl,
  ).then(url => {
    selectedHref.value = url
    sourceState.value = 'ready'
    return url
  }).catch(() => {
    sourceState.value = 'ready'
    selectedHref.value = originUrl
    return originUrl
  })

  return selectionRequest
}

const openDownloadUrl = (url: string, pendingWindow: Window | null): void => {
  if (pendingWindow) {
    pendingWindow.opener = null
    pendingWindow.location.href = url
    return
  }
  window.location.href = url
}

const handleDownload = async (event: MouseEvent): Promise<void> => {
  const originUrl = downloadHref.value
  if (!originUrl) {
    event.preventDefault()
    return
  }

  event.preventDefault()
  selecting.value = true
  sourceState.value = selectedHref.value ? 'ready' : 'probing'
  const pendingWindow = window.open('', '_blank')
  try {
    const url = await warmBestDownloadUrl()
    sourceState.value = 'downloading'
    window.setTimeout(() => openDownloadUrl(url, pendingWindow), 180)
  } finally {
    window.setTimeout(() => {
      selecting.value = false
      sourceState.value = selectedHref.value ? 'ready' : 'idle'
    }, 800)
  }
}
</script>

<template>
  <a
    v-if="shouldRender"
    :href="effectiveDownloadHref"
    class="term-download-link"
    :data-platform="platform"
    :data-source-state="sourceState"
    :data-selecting="selecting ? 'true' : undefined"
    :aria-busy="selecting ? 'true' : undefined"
    target="_blank"
    rel="noopener"
    @pointerenter="warmBestDownloadUrl"
    @focus="warmBestDownloadUrl"
    @click="handleDownload"
  >
    <span class="term-prompt">&gt;</span>
    <span class="term-cmd-text">{{ commandText }}</span>
    <span v-if="versionText" class="term-version">v{{ versionText }}</span>
    <span class="term-label"><slot>{{ props.label || config.defaultSubLabel }}</slot></span>
    <span v-if="sourceStatusText" class="term-download-status">{{ sourceStatusText }}</span>
  </a>
</template>
