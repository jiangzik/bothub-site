import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

const LEGACY_REDIRECTS: Record<string, string> = {
  '/privacy-policy': '/zh/faq/privacy-policy',
  '/faq/privacy-policy': '/zh/faq/privacy-policy',
  '/quick-start': '/zh/quick-start/overview',
  '/manual': '/zh/manual/overview',
  '/faq': '/zh/faq/overview',
  '/changelog': '/zh/changelog/overview',
  '/zh/quick-start': '/zh/quick-start/overview',
  '/zh/manual': '/zh/manual/overview',
  '/zh/faq': '/zh/faq/overview',
  '/zh/privacy-policy': '/zh/faq/privacy-policy',
  '/zh/changelog': '/zh/changelog/overview',
  '/en/quick-start': '/en/quick-start/overview',
  '/en/manual': '/en/manual/overview',
  '/en/faq': '/en/faq/overview',
  '/en/privacy-policy': '/en/faq/privacy-policy',
  '/en/changelog': '/en/changelog/overview',
}

const normalizePath = (pathname: string): string => {
  if (!pathname || pathname === '/') {
    return '/'
  }
  return pathname.replace(/\/+$/, '') || '/'
}

export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const currentPath = normalizePath(requestUrl.pathname)
  const redirectPath = LEGACY_REDIRECTS[currentPath]

  if (!redirectPath || redirectPath === currentPath) {
    return
  }

  const query = requestUrl.search || ''
  return sendRedirect(event, `${redirectPath}${query}`, 302)
})
