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

const { data } = await useVersionManifest()

const downloadHref = computed(() => {
  const value = data.value?.[config.downloadKey]
  return getVersionEntryUrl(value) || config.defaultUrl
})

const selectedHref = ref('')
const selecting = ref(false)
let selectionRequest: Promise<string> | null = null

const versionText = computed(() => data.value?.version || '')

const shouldRender = computed(() => config.alwaysRender || !!downloadHref.value)

const effectiveDownloadHref = computed(() => selectedHref.value || downloadHref.value)

watch(downloadHref, () => {
  selectedHref.value = ''
  selectionRequest = null
})

const warmBestDownloadUrl = (): Promise<string> => {
  const originUrl = downloadHref.value
  if (!originUrl || selectedHref.value) {
    return Promise.resolve(selectedHref.value || originUrl)
  }
  if (selectionRequest) return selectionRequest

  selectionRequest = selectBestDownloadUrl(
    originUrl,
    props.platform,
    data.value?.downloadSourceConfigUrl,
  ).then(url => {
    selectedHref.value = url
    return url
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
  if (selectedHref.value) return

  const originUrl = downloadHref.value
  if (!originUrl) {
    event.preventDefault()
    return
  }

  event.preventDefault()
  selecting.value = true
  const pendingWindow = window.open('', '_blank')
  try {
    openDownloadUrl(await warmBestDownloadUrl(), pendingWindow)
  } finally {
    selecting.value = false
  }
}
</script>

<template>
  <a
    v-if="shouldRender"
    :href="effectiveDownloadHref"
    class="bothub-dl-card"
    :data-platform="platform"
    :data-selecting="selecting ? 'true' : undefined"
    :aria-busy="selecting ? 'true' : undefined"
    target="_blank"
    rel="noopener"
    @pointerenter="warmBestDownloadUrl"
    @focus="warmBestDownloadUrl"
    @click="handleDownload"
  >
    <span class="bothub-dl-icon">
      <UIcon :name="config.icon" />
    </span>
    <span class="bothub-dl-body">
      <span class="bothub-dl-main">{{ config.defaultMainLabel }}</span>
      <span class="bothub-dl-sub">
        <slot>{{ props.label || config.defaultSubLabel }}</slot>
      </span>
    </span>
    <span v-if="versionText" class="bothub-dl-version">v{{ versionText }}</span>
  </a>
</template>
