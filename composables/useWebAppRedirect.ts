/**
 * 登录、注册、充值、API Key 都在 BotHub Web（runtimeConfig.public.webAppUrl）里只实现一份，官网只跳过去。
 * 静态页面上同时放 meta refresh，不执行脚本也能跳。
 */
export function webAppUrl(path = '/'): string {
  const base = String(useRuntimeConfig().public.webAppUrl).replace(/\/+$/, '')
  return `${base}${path}`
}

export function useWebAppRedirect(path: string): string {
  const target = webAppUrl(path)
  useHead({ meta: [{ 'http-equiv': 'refresh', content: `0;url=${target}` }] })
  onMounted(() => window.location.replace(target))
  return target
}
