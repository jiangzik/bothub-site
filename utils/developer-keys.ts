import type { DeveloperKey } from '../types/developer-key'

export type DeveloperKeyState = 'available' | 'disabled' | 'expired' | 'unavailable'

// Revoked keys have no list entry. Only active, unexpired keys are available.
export function developerKeyState(key: DeveloperKey, now: number): DeveloperKeyState | null {
  if (key.status === 'revoked') return null
  if (key.status === 'disabled') return 'disabled'
  if (key.status !== 'active') return 'unavailable'
  if (key.expiresAt !== null && key.expiresAt <= now) return 'expired'
  return 'available'
}

export function groupDeveloperKeys(keys: DeveloperKey[], now: number) {
  const groups: { available: DeveloperKey[], unavailable: DeveloperKey[] } = { available: [], unavailable: [] }
  for (const key of keys) {
    const state = developerKeyState(key, now)
    if (state !== null) groups[state === 'available' ? 'available' : 'unavailable'].push(key)
  }
  return groups
}
