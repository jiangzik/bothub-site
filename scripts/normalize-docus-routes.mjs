/** @typedef {{ path: string, file?: string, children?: DocusRoute[] }} DocusRoute */

/**
 * Let @nuxtjs/i18n be the sole owner of locale routing. Remove Docus's
 * optional locale segment before localization, so the landing route is /
 * and documents use /:slug(.*)*. No runtime redirects or alternate routes.
 * @param {DocusRoute[]} pages
 */
export function normalizeDocusRoutes(pages) {
  for (const page of pages) {
    const file = page.file?.replaceAll('\\', '/') || ''
    if (file.endsWith('/docus/app/templates/landing.vue')
      || file.endsWith('/docus/app/pages/[[lang]]/[...slug].vue')) {
      page.path = page.path.replace('/:lang?', '') || '/'
    }
    if (page.children) normalizeDocusRoutes(page.children)
  }
}
