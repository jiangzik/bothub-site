import type { VersionManifest } from '~/types/version'

export type DownloadPlatform = 'android' | 'mac' | 'windows' | 'linux'

const DOWNLOAD_KEYS: Record<DownloadPlatform, keyof VersionManifest> = {
  android: 'android',
  mac: 'mac',
  windows: 'windows',
  linux: 'linux',
}

const DEFAULT_URLS: Partial<Record<DownloadPlatform, string>> = {
  android: '/downloads/app-release.apk',
}

// Shared by every download entry point: resolves the manifest URL, probes the
// fastest mirror on hover/focus and starts the download on click.
export const usePlatformDownload = (platform: MaybeRefOrGetter<DownloadPlatform | null>) => {
  const { data } = useVersionManifest()
  const { locale } = useDocusI18n()
  const isZh = computed(() => locale.value !== 'en')

  const downloadHref = computed(() => {
    const target = toValue(platform)
    if (!target) return ''
    return getVersionEntryUrl(data.value?.[DOWNLOAD_KEYS[target]]) || DEFAULT_URLS[target] || ''
  })

  const version = computed(() => data.value?.version || '')
  const selectedHref = ref('')
  const selecting = ref(false)
  const sourceState = ref<'idle' | 'probing' | 'ready' | 'downloading'>('idle')
  let selectionRequest: Promise<string> | null = null

  const effectiveHref = computed(() => selectedHref.value || downloadHref.value)

  const selectedHost = computed(() => {
    const href = effectiveHref.value
    if (!href) return ''
    try {
      return new URL(href, typeof window === 'undefined' ? 'https://bothub.bookab.info' : window.location.origin).hostname
    }
    catch {
      return ''
    }
  })

  const statusText = computed(() => {
    const host = selectedHost.value ? ` ${selectedHost.value}` : ''
    if (sourceState.value === 'probing') return isZh.value ? '正在选择最快的下载源…' : 'Finding the fastest mirror…'
    if (sourceState.value === 'downloading') return isZh.value ? `正在从${host} 开始下载…` : `Starting download from${host}…`
    return ''
  })

  watch(downloadHref, () => {
    selectedHref.value = ''
    selectionRequest = null
    sourceState.value = 'idle'
  })

  const warm = (): Promise<string> => {
    const target = toValue(platform)
    const originUrl = downloadHref.value
    if (!target || !originUrl || selectedHref.value) {
      return Promise.resolve(selectedHref.value || originUrl)
    }
    if (selectionRequest) return selectionRequest

    selectionRequest = selectBestDownloadUrl(originUrl, target, data.value?.downloadSourceConfigUrl)
      .then((url) => {
        selectedHref.value = url
        return url
      })
      .catch(() => {
        selectedHref.value = originUrl
        return originUrl
      })

    return selectionRequest
  }

  const start = async (event: MouseEvent): Promise<void> => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    if (!downloadHref.value) return

    event.preventDefault()
    if (selecting.value) return

    selecting.value = true
    sourceState.value = selectedHref.value ? 'downloading' : 'probing'
    try {
      const url = await warm()
      sourceState.value = 'downloading'
      // Navigating to an installer starts a browser download without opening a blank tab.
      window.location.assign(url)
    }
    finally {
      window.setTimeout(() => {
        selecting.value = false
        sourceState.value = 'idle'
      }, 1600)
    }
  }

  return { downloadHref, effectiveHref, version, selecting, sourceState, statusText, warm, start }
}
