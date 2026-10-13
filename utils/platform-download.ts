import type { DetectedPlatform } from '../composables/useDetectedPlatform'
import type { DownloadPlatform } from '../composables/usePlatformDownload'

// Each supported device uses the directly published installer. Android uses APK;
// Google Play remains a separate, optional store channel.
export function preferredDownloadPlatform(platform: DetectedPlatform): DownloadPlatform | null {
  return platform === 'unknown' || platform === 'ios' ? null : platform
}
