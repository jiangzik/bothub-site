export interface VersionEntry {
  url?: string
  notes?: string
  sha256?: string
}

export interface VersionManifest {
  version?: string
  downloadSourceConfigUrl?: string
  android?: VersionEntry | string
  androidGooglePlay?: VersionEntry | string
  mac?: VersionEntry | string
  windows?: VersionEntry | string
  linux?: VersionEntry | string
}
