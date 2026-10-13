import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

const LEGACY_REDIRECTS: Record<string, string> = {
  '/privacy-policy': '/zh/faq/privacy-policy',
  '/faq/privacy-policy': '/zh/faq/privacy-policy',
  '/faq': '/zh/faq/overview',
  '/zh/faq': '/zh/faq/overview',
  '/zh/privacy-policy': '/zh/faq/privacy-policy',
  '/en/faq': '/en/faq/overview',
  '/en/privacy-policy': '/en/faq/privacy-policy',
  '/pay': '/zh/pay',
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
