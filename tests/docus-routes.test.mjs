import test from 'node:test'
import assert from 'node:assert/strict'
import { createRouter, createMemoryHistory } from 'vue-router'
import { normalizeDocusRoutes } from '../scripts/normalize-docus-routes.mjs'

const landingFile = '/project/node_modules/docus/app/templates/landing.vue'
const docsFile = '/project/node_modules/docus/app/pages/[[lang]]/[...slug].vue'
function routes() {
  return ['zh', 'en'].flatMap(locale => [
    { name: `home-${locale}`, path: `/${locale}/:lang?`, file: landingFile },
    { name: `docs-${locale}`, path: `/${locale}/:lang?/:slug(.*)*`, file: docsFile },
    { name: `models-${locale}`, path: `/${locale}/models`, file: '/project/pages/models.vue' },
  ])
}

test('one-segment documents resolve to docs, while locale roots resolve to home', () => {
  const pages = routes()
  normalizeDocusRoutes(pages)
  const router = createRouter({ history: createMemoryHistory(), routes: pages.map(page => ({ ...page, component: {} })) })
  for (const locale of ['zh', 'en']) {
    assert.equal(router.resolve(`/${locale}`).name, `home-${locale}`)
    assert.equal(router.resolve(`/${locale}/macos-install`).name, `docs-${locale}`)
    assert.equal(router.resolve(`/${locale}/faq/overview`).name, `docs-${locale}`)
    assert.equal(router.resolve(`/${locale}/models`).name, `models-${locale}`)
  }
})

test('re-running route normalization is idempotent and leaves app routes intact', () => {
  const pages = routes()
  normalizeDocusRoutes(pages)
  const expected = structuredClone(pages)
  normalizeDocusRoutes(pages)
  assert.deepEqual(pages, expected)
  assert.equal(pages.find(page => page.name === 'models-zh').path, '/zh/models')
})
