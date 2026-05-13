import type { VersionEntry, VersionManifest } from '~/types/version'

export const VERSION_MANIFEST_URL = 'https://bothub.bookab.info/version.json'

export const getVersionEntryUrl = (entry?: VersionEntry | string): string => {
  if (!entry) {
    return ''
  }
  return typeof entry === 'string' ? entry : entry.url || ''
}

export const useVersionManifest = () => useFetch<VersionManifest>(VERSION_MANIFEST_URL, {
  key: 'bothub-version-manifest',
  default: () => ({}),
  server: false,
})
