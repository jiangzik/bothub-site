import type { ServiceStatusResponse } from '~/types/service-status'

export function useModelServiceStatus() {
  const config = useRuntimeConfig()
  const base = String(config.public.cloudApiBaseUrl).replace(/\/+$/, '')
  // Status is fetched in the browser, never baked into a static build.
  const result = useAsyncData('bothub-model-service-status', (_app, { signal }) =>
    $fetch<ServiceStatusResponse>(`${base}/v1/ai/status`, { signal, timeout: 10_000, retry: 0 }),
  { server: false, immediate: false })
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    void result.execute()
    timer = setInterval(() => {
      if (document.visibilityState === 'visible' && result.status.value !== 'pending') void result.refresh()
    }, 60_000)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return result
}
