const REDIRECTS: Record<string, string> = {
  '/faq/privacy-policy': '/zh/faq/privacy-policy',
}

const normalizePath = (pathname: string): string => {
  if (pathname === '/') {
    return pathname
  }
  return pathname.replace(/\/+$/, '')
}

export default defineEventHandler((event) => {
  const pathname = normalizePath(getRequestURL(event).pathname)
  const target = REDIRECTS[pathname]

  if (!target) {
    return
  }

  return sendRedirect(event, target, 307)
})
