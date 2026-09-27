/**
 * 官网上的 BotHub 账号会话：邮箱密码登录、access token 过期时用 refresh token 换一次、登出。
 *
 * 会话只存在这台浏览器的 localStorage 里，和 App 的登录互不影响（服务端的「登录设备」列表里会多一条「BotHub 官网」）。
 * 所有调用都是跨域打到 cloud-api，CORS 白名单里已有官网域名。
 */

export interface BothubUser {
  id: string
  email: string
  name: string | null
}

interface StoredSession {
  token: string
  refreshToken: string
  user: BothubUser
}

export class BothubApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null,
    readonly detail: unknown,
  ) {
    super(message)
  }
}

const SESSION_STORAGE_KEY = 'bothub.web.session'
const WEB_CLIENT_INFO = { platform: 'web', deviceName: 'BotHub 官网' }

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredSession>
    if (typeof parsed.token !== 'string' || typeof parsed.refreshToken !== 'string' || !parsed.user?.id) return null
    return parsed as StoredSession
  }
  catch {
    return null
  }
}

function writeStoredSession(session: StoredSession | null): void {
  try {
    if (session) localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_STORAGE_KEY)
  }
  catch {
    // 隐私模式下写不进去：这次打开页面期间照样能用，只是刷新后要重新登录。
  }
}

async function parseResponse(response: Response): Promise<unknown> {
  const data = await response.json().catch(() => null) as Record<string, unknown> | null
  if (response.ok) return data
  const error = (data?.error ?? null) as { code?: unknown; message?: unknown; detail?: unknown } | string | null
  const message = typeof error === 'string'
    ? error
    : typeof error?.message === 'string' ? error.message : `HTTP ${response.status}`
  const code = typeof error === 'object' && typeof error?.code === 'string' ? error.code : null
  const detail = typeof error === 'object' ? error?.detail : undefined
  throw new BothubApiError(message, response.status, code, detail)
}

export function useBothubAccount() {
  const runtimeConfig = useRuntimeConfig()
  const apiBaseUrl = String(runtimeConfig.public.cloudApiBaseUrl ?? '').trim().replace(/\/+$/, '')

  // 同一页面里多个组件共用一份会话。
  const session = useState<StoredSession | null>('bothub-web-session', () => null)
  const restored = useState('bothub-web-session-restored', () => false)

  function restore(): void {
    if (restored.value || import.meta.server) return
    session.value = readStoredSession()
    restored.value = true
  }

  function setSession(next: StoredSession | null): void {
    session.value = next
    writeStoredSession(next)
  }

  async function request(path: string, init: { method?: string; body?: unknown; token?: string | null } = {}): Promise<unknown> {
    const headers: Record<string, string> = {}
    if (init.body !== undefined) headers['Content-Type'] = 'application/json'
    if (init.token) headers.Authorization = `Bearer ${init.token}`
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: init.method ?? (init.body !== undefined ? 'POST' : 'GET'),
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
    return parseResponse(response)
  }

  /** 并发的几个请求同时撞上过期，只换一次 token。 */
  let refreshing: Promise<boolean> | null = null

  async function refreshSession(): Promise<boolean> {
    const current = session.value
    if (!current) return false
    if (!refreshing) {
      refreshing = (async () => {
        try {
          const data = await request('/v1/auth/refresh', {
            body: { refreshToken: current.refreshToken, clientInfo: WEB_CLIENT_INFO },
          }) as { token: string; refreshToken: string }
          setSession({ ...current, token: data.token, refreshToken: data.refreshToken })
          return true
        }
        catch (error) {
          // refresh 被拒（过期、被撤销、账号停用）= 这份会话没用了；网络错误则保留，下次再试。
          if (error instanceof BothubApiError && error.status >= 400 && error.status < 500) setSession(null)
          throw error
        }
        finally {
          refreshing = null
        }
      })()
    }
    return refreshing
  }

  /** 带登录态的请求：401 时换一次 token 再试，还是 401 就当作已登出。 */
  async function authed<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
    const current = session.value
    if (!current) throw new BothubApiError('Not signed in', 401, 'AUTH_REQUIRED', undefined)
    try {
      return await request(path, { ...init, token: current.token }) as T
    }
    catch (error) {
      if (!(error instanceof BothubApiError) || error.status !== 401) throw error
      await refreshSession()
      return await request(path, { ...init, token: session.value?.token ?? null }) as T
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const data = await request('/v1/auth/login', {
      body: { email, password, clientInfo: WEB_CLIENT_INFO },
    }) as { token: string; refreshToken: string; user: BothubUser }
    setSession({ token: data.token, refreshToken: data.refreshToken, user: data.user })
  }

  async function sendResetCode(email: string): Promise<void> {
    await request('/v1/auth/email/send-code', { body: { email, purpose: 'reset_password' } })
  }

  async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const data = await request('/v1/auth/reset-password', {
      body: { email, code, newPassword, clientInfo: WEB_CLIENT_INFO },
    }) as { token: string; refreshToken: string; user: BothubUser }
    setSession({ token: data.token, refreshToken: data.refreshToken, user: data.user })
  }

  async function logout(): Promise<void> {
    const current = session.value
    setSession(null)
    if (!current) return
    try {
      await request('/v1/auth/logout', { body: { refreshToken: current.refreshToken } })
    }
    catch (error) {
      // 本地已经登出；服务端那条会话会按 refresh token 的有效期自然失效。
      console.warn('[bothub] logout request failed', error)
    }
  }

  return {
    apiBaseUrl,
    session: readonly(session),
    user: computed(() => session.value?.user ?? null),
    restore,
    request,
    authed,
    login,
    sendResetCode,
    resetPassword,
    logout,
  }
}
