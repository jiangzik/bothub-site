import test from 'node:test'
import assert from 'node:assert/strict'
import { createRouter, createMemoryHistory } from 'vue-router'
import { normalizeDocusRoutes } from '../scripts/normalize-docus-routes.mjs'

const landingFile = '/project/node_modules/docus/app/templates/landing.vue'
const docsFile = '/project/node_modules/docus/app/pages/[[lang]]/[...slug].vue'
function routes() {
  return [
    { name: 'home', path: '/:lang?', file: landingFile },
    { name: 'docs', path: '/:lang?/:slug(.*)*', file: docsFile },
    { name: 'models', path: '/models', file: '/project/pages/models.vue' },
  ]
}

test('Docus contributes locale-free routes before i18n localization', () => {
  const pages = routes()
  normalizeDocusRoutes(pages)
  assert.deepEqual(pages.map(page => page.path), ['/', '/:slug(.*)*', '/models'])
})

test('localized home cannot swallow one-segment documents', () => {
  const pages = routes()
  normalizeDocusRoutes(pages)
  const localized = ['zh', 'en'].flatMap(locale => pages.map(page => ({
    name: `${page.name}-${locale}`,
    path: `/${locale}${page.path === '/' ? '' : page.path}`,
    component: {},
  })))
  const router = createRouter({ history: createMemoryHistory(), routes: localized })
  for (const locale of ['zh', 'en']) {
    assert.equal(router.resolve(`/${locale}`).name, `home-${locale}`)
    assert.equal(router.resolve(`/${locale}/`).name, `home-${locale}`)
    assert.equal(router.resolve(`/${locale}/macos-install`).name, `docs-${locale}`)
    assert.equal(router.resolve(`/${locale}/faq/overview`).name, `docs-${locale}`)
    assert.equal(router.resolve(`/${locale}/models`).name, `models-${locale}`)
  }
})

test('route normalization is idempotent and leaves app routes intact', () => {
  const pages = routes()
  normalizeDocusRoutes(pages)
  const expected = structuredClone(pages)
  normalizeDocusRoutes(pages)
  assert.deepEqual(pages, expected)
  assert.equal(pages.find(page => page.name === 'models').path, '/models')
})
