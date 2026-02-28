export interface VersionEntry {
  url?: string
  notes?: string
}

export interface VersionManifest {
  version?: string
  android?: VersionEntry | string
  mac?: VersionEntry | string
  windows?: VersionEntry | string
  linux?: VersionEntry | string
  server?: VersionEntry | string
}

export interface VersionJson {
  version?: string
  android?: VersionEntry
  mac?: VersionEntry
  windows?: VersionEntry
  linux?: VersionEntry
  server?: VersionEntry
}
