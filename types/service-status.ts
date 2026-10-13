// Wire fields from cloud-api contracts/client.ts: aiServiceStatusResponseSchema.
export type ServiceState = 'idle' | 'ok' | 'degraded' | 'down'
export interface ServiceBucket {
  state: Exclude<ServiceState, 'idle'>
  successes: number
  failures: number
  firstOutputP50Ms: number | null
}
export interface ModelServiceStatus {
  id: string
  displayName: string
  kind: string
  state: ServiceState
  successRate: number | null
  firstOutputP50Ms: number | null
  buckets: (ServiceBucket | null)[]
}
export interface ServiceStatusResponse {
  generatedAt: string
  windowStart: string
  bucketMinutes: number
  bucketCount: number
  state: ServiceState
  affectedModelCount: number
  models: ModelServiceStatus[]
}
