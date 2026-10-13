// Wire fields from cloud-api contracts/client.ts: externalAccessKeySchema.
export interface DeveloperKey {
  id: string
  name: string
  keyHint: string
  status: string
  scopes: string[]
  createdAt: number
  expiresAt: number | null
}
