export type DetectedPlatform = 'mac' | 'windows' | 'linux' | 'android' | 'ios' | 'unknown'

const detect = (): DetectedPlatform => {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const hint = `${nav.userAgentData?.platform || ''} ${nav.platform || ''} ${nav.userAgent || ''}`.toLowerCase()

  if (/android/.test(hint)) return 'android'
  if (/iphone|ipad|ipod/.test(hint)) return 'ios'
  // iPadOS reports itself as Mac; touch support gives it away.
  if (/mac/.test(hint)) return nav.maxTouchPoints > 1 ? 'ios' : 'mac'
  if (/win/.test(hint)) return 'windows'
  if (/linux|x11|cros/.test(hint)) return 'linux'
  return 'unknown'
}

// Resolved after mount so SSR and hydration always render the neutral state.
export const useDetectedPlatform = () => {
  const platform = useState<DetectedPlatform>('bothub-detected-platform', () => 'unknown')

  if (import.meta.client) {
    onMounted(() => {
      if (platform.value === 'unknown') platform.value = detect()
    })
  }

  return platform
}
