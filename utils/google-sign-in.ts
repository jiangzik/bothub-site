interface CredentialResponse { credential?: string; state?: string }
interface GoogleIdentity {
  initialize(options: { client_id: string; nonce: string; callback: (response: CredentialResponse) => void; auto_select: boolean }): void
  renderButton(target: HTMLElement, options: { type: string; theme: string; size: string; text: string; shape: string; width: number; locale: string; state: string }): void
}

declare global {
  interface Window { google?: { accounts?: { id?: GoogleIdentity } } }
}

/** Load the official SDK only when a sign-in form is opened; failures remain retryable. */
export function loadGoogleIdentity(): Promise<GoogleIdentity> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    const finish = (error?: Error) => {
      clearTimeout(timer)
      script.onload = null
      script.onerror = null
      const identity = window.google?.accounts?.id
      if (error || !identity) {
        script.remove()
        reject(error ?? new Error('Google sign-in SDK unavailable'))
      }
      else resolve(identity)
    }
    const timer = setTimeout(() => finish(new Error('Google sign-in SDK timed out')), 15_000)
    script.onload = () => finish()
    script.onerror = () => finish(new Error('Google sign-in SDK failed to load'))
    document.head.append(script)
  })
}

interface ButtonHandlers {
  locale: string
  dark: boolean
  onCredential: (credential: string, nonce: string) => void
  onError: () => void
}

/** GIS has one callback per page. Its button state identifies the still-mounted form. */
export function createGoogleSignIn(clientId: string, nonce: string, load: () => Promise<GoogleIdentity>) {
  let ready: Promise<GoogleIdentity> | undefined
  let nextButtonId = 0
  const buttons = new Map<string, ButtonHandlers>()
  function identity(): Promise<GoogleIdentity> {
    if (!ready) {
      ready = load().then((sdk) => {
        sdk.initialize({
          client_id: clientId, nonce, auto_select: false,
          callback: (response) => {
            const handlers = response.state ? buttons.get(response.state) : undefined
            if (!handlers) return
            if (!response.credential) handlers.onError()
            else handlers.onCredential(response.credential, nonce)
          },
        })
        return sdk
      }).catch((error) => { ready = undefined; throw error })
    }
    return ready
  }
  return {
    async render(target: HTMLElement, handlers: ButtonHandlers, signal: AbortSignal): Promise<() => void> {
      if (!clientId) throw new Error('Google client ID is not configured')
      const sdk = await identity()
      if (signal.aborted) return () => {}
      target.replaceChildren()
      const state = `bothub-google-${++nextButtonId}`
      buttons.set(state, handlers)
      sdk.renderButton(target, {
        type: 'standard', theme: handlers.dark ? 'filled_black' : 'outline', size: 'large',
        text: 'signin_with', shape: 'rectangular', locale: handlers.locale,
        width: Math.min(400, Math.max(200, Math.floor(target.clientWidth))),
        state,
      })
      const dispose = () => { buttons.delete(state); target.replaceChildren() }
      signal.addEventListener('abort', dispose, { once: true })
      return () => { signal.removeEventListener('abort', dispose); dispose() }
    },
  }
}
