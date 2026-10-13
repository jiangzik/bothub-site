/** @typedef {{ path: string, file?: string, children?: DocusRoute[] }} DocusRoute */

/**
 * i18n already prefixes each route with /zh or /en. Docus's extra optional
 * :lang parameter would let the homepage swallow one-segment documents.
 * Run after route localization and remove that duplicate parameter.
 * @param {DocusRoute[]} pages
 */
export function normalizeDocusRoutes(pages) {
  for (const page of pages) {
    const file = page.file?.replaceAll('\\', '/') || ''
    if (file.endsWith('/docus/app/templates/landing.vue')
      || file.endsWith('/docus/app/pages/[[lang]]/[...slug].vue')) {
      page.path = page.path.replace('/:' + 'lang?', '') || '/'
    }
    if (page.children) normalizeDocusRoutes(page.children)
  }
}
