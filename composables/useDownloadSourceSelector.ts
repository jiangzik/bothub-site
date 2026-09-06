type DownloadPlatform = 'android' | 'mac' | 'windows' | 'linux'

interface ReleaseDownloadMirror {
  id: string
  name: string
  enabled?: boolean
  priority: number
  urlTemplate: string
  platforms: string[]
}

interface ReleaseDownloadMirrorConfig {
  probe?: {
    timeoutMs?: number
    maxConcurrency?: number
  }
  mirrors?: ReleaseDownloadMirror[]
}

interface DownloadCandidate {
  id: string
  name: string
  url: URL
  priority: number
}

const DEFAULT_DOWNLOAD_SOURCE_CONFIG_URL = 'https://bothub-api.bookab.info/v1/release/download-mirrors'
const DEFAULT_PROBE_TIMEOUT_MS = 3000
const CONFIG_TIMEOUT_MS = 3000
const DEFAULT_PROBE_MAX_CONCURRENCY = 6
const LOOPBACK_OR_PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^\[?::1\]?$/i,
]

const configCache = new Map<string, Promise<ReleaseDownloadMirrorConfig | null>>()
const selectionCache = new Map<string, Promise<string>>()

const isBrowser = (): boolean => typeof window !== 'undefined'

const isSafePublicHttpsUrl = (url: URL): boolean => {
  if (url.protocol !== 'https:') return false
  const hostname = url.hostname.trim().toLowerCase()
  if (!hostname) return false
  return !LOOPBACK_OR_PRIVATE_HOST_PATTERNS.some(pattern => pattern.test(hostname))
}

const isUsableDownloadUrl = (url: URL): boolean => {
  if (url.protocol === 'https:') return true
  return isBrowser() && url.origin === window.location.origin && url.protocol === window.location.protocol
}

const isMirrorableGitHubUrl = (url: URL): boolean => {
  return url.protocol === 'https:' && url.hostname.toLowerCase() === 'github.com'
}

const toAbsoluteUrl = (rawUrl: string): URL | null => {
  if (!rawUrl || !isBrowser()) return null
  try {
    const url = new URL(rawUrl, window.location.origin)
    return isUsableDownloadUrl(url) ? url : null
  } catch {
    return null
  }
}

const renderMirrorTemplate = (template: string, originUrl: string): string => {
  const url = new URL(originUrl)
  const fileName = url.pathname.split('/').pop() || ''
  return template
    .replaceAll('{{url}}', originUrl)
    .replaceAll('{{encodedUrl}}', encodeURIComponent(originUrl))
    .replaceAll('{{urlNoProtocol}}', `${url.hostname}${url.pathname}${url.search}`)
    .replaceAll('{{fileName}}', fileName)
}

const normalizeConfigUrl = (rawUrl?: string): string => {
  if (!rawUrl) return DEFAULT_DOWNLOAD_SOURCE_CONFIG_URL
  try {
    const url = new URL(rawUrl)
    return isSafePublicHttpsUrl(url) ? url.toString() : DEFAULT_DOWNLOAD_SOURCE_CONFIG_URL
  } catch {
    return DEFAULT_DOWNLOAD_SOURCE_CONFIG_URL
  }
}

const fetchMirrorConfig = (rawConfigUrl?: string): Promise<ReleaseDownloadMirrorConfig | null> => {
  const configUrl = normalizeConfigUrl(rawConfigUrl)
  const cached = configCache.get(configUrl)
  if (cached) return cached

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), CONFIG_TIMEOUT_MS)
  const request = fetch(configUrl, { cache: 'no-store', signal: controller.signal })
    .then(async response => {
      if (!response.ok) return null
      const data = await response.json()
      if (!data || typeof data !== 'object') return null
      return data as ReleaseDownloadMirrorConfig
    })
    .catch(() => null)
    .finally(() => window.clearTimeout(timeout))

  configCache.set(configUrl, request)
  return request
}

const buildCandidates = (
  origin: URL,
  platform: DownloadPlatform,
  config: ReleaseDownloadMirrorConfig | null,
): DownloadCandidate[] => {
  const candidates = new Map<string, DownloadCandidate>()
  const addCandidate = (candidate: DownloadCandidate): void => {
    if (!candidates.has(candidate.url.toString())) {
      candidates.set(candidate.url.toString(), candidate)
    }
  }

  addCandidate({
    id: 'origin',
    name: 'GitHub 原版',
    url: origin,
    priority: 0,
  })

  if (!isMirrorableGitHubUrl(origin)) {
    return [...candidates.values()]
  }

  for (const mirror of config?.mirrors ?? []) {
    if (mirror.enabled === false || !mirror.urlTemplate || (mirror.platforms?.length && !mirror.platforms.includes(platform))) continue
    try {
      const mirrorUrl = new URL(renderMirrorTemplate(mirror.urlTemplate, origin.toString()))
      if (!isSafePublicHttpsUrl(mirrorUrl)) continue
      addCandidate({
        id: mirror.id || mirrorUrl.hostname,
        name: mirror.name || mirrorUrl.hostname,
        url: mirrorUrl,
        priority: Number.isFinite(mirror.priority) ? mirror.priority : 0,
      })
    } catch {
      // Ignore broken mirror templates; the original URL remains available.
    }
  }

  return [...candidates.values()].sort((a, b) => a.priority - b.priority)
}

const probeCandidate = async (
  candidate: DownloadCandidate,
  timeoutMs: number,
): Promise<{ candidate: DownloadCandidate, ok: boolean, latencyMs: number }> => {
  const startedAt = performance.now()
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(candidate.url.toString(), {
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
    })
    // Opaque responses hide HTTP errors; a fast error page is not a download source.
    const contentType = response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() || ''
    const isErrorDocument = contentType.startsWith('text/')
      || /(?:html|json|xml)/.test(contentType)
    if (!response.ok || response.type === 'opaque' || !contentType || isErrorDocument) {
      return { candidate, ok: false, latencyMs: Number.POSITIVE_INFINITY }
    }
    return { candidate, ok: true, latencyMs: performance.now() - startedAt }
  } catch {
    return { candidate, ok: false, latencyMs: Number.POSITIVE_INFINITY }
  } finally {
    window.clearTimeout(timeout)
  }
}

const selectBestCandidate = async (
  candidates: DownloadCandidate[],
  timeoutMs: number,
  maxConcurrency: number,
): Promise<DownloadCandidate> => {
  const queue = [...candidates]
  const results: Array<{ candidate: DownloadCandidate, ok: boolean, latencyMs: number }> = []
  const deadline = performance.now() + timeoutMs

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const remainingMs = deadline - performance.now()
      if (remainingMs <= 0) return
      const candidate = queue.shift()
      if (!candidate) return
      results.push(await probeCandidate(candidate, remainingMs))
    }
  }

  await Promise.all(Array.from({ length: Math.min(maxConcurrency, queue.length) }, () => worker()))

  return results
    .filter(result => result.ok)
    .sort((a, b) => a.latencyMs - b.latencyMs || a.candidate.priority - b.candidate.priority)[0]
    ?.candidate ?? candidates.find(candidate => candidate.id === 'origin') ?? candidates[0]
}

export const selectBestDownloadUrl = (
  originUrl: string,
  platform: DownloadPlatform,
  configUrl?: string,
): Promise<string> => {
  const origin = toAbsoluteUrl(originUrl)
  if (!origin) return Promise.resolve(originUrl)
  if (!isMirrorableGitHubUrl(origin)) return Promise.resolve(origin.toString())

  const cacheKey = `${platform}:${origin.toString()}:${normalizeConfigUrl(configUrl)}`
  const cached = selectionCache.get(cacheKey)
  if (cached) return cached

  const request = fetchMirrorConfig(configUrl)
    .then(async config => {
      const candidates = buildCandidates(origin, platform, config)
      if (candidates.length <= 1) return candidates[0]?.url.toString() ?? origin.toString()
      const timeoutMs = Math.min(15000, Math.max(500, config?.probe?.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS))
      const maxConcurrency = Math.min(16, Math.max(1, config?.probe?.maxConcurrency ?? DEFAULT_PROBE_MAX_CONCURRENCY))
      return (await selectBestCandidate(candidates, timeoutMs, maxConcurrency)).url.toString()
    })
    .catch(() => origin.toString())

  selectionCache.set(cacheKey, request)
  return request
}
