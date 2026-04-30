export interface VersionEntry {
  url?: string
  notes?: string
}

export interface VersionManifest {
  version?: string
  android?: VersionEntry | string
  androidGooglePlay?: VersionEntry | string
  mac?: VersionEntry | string
  windows?: VersionEntry | string
  linux?: VersionEntry | string
}
