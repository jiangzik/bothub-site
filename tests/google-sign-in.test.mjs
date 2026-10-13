import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = readFileSync(new URL('../utils/google-sign-in.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const context = { exports: {} }
vm.runInNewContext(compiled, context)
const { createGoogleSignIn } = context.exports
const target = () => ({ clientWidth: 280, replaceChildren() {} })
const button = (onCredential) => ({ locale: 'zh_CN', dark: false, onCredential, onError() {} })

function sdkHarness() {
  const buttons = new Map()
  let options
  let loads = 0
  let initializations = 0
  const sdk = {
    initialize(value) { options = value; initializations++ },
    renderButton(element, value) { buttons.set(element, value) },
  }
  const service = createGoogleSignIn('shared-app-client', 'random-page-nonce', async () => { loads++; return sdk })
  return { service, buttons, get options() { return options }, get loads() { return loads }, get initializations() { return initializations } }
}

test('multiple forms share one SDK initialization and credentials go to the clicked form', async () => {
  const h = sdkHarness()
  const one = target(), two = target(), received = []
  await Promise.all([
    h.service.render(one, button(() => received.push('one')), new AbortController().signal),
    h.service.render(two, button((token, nonce) => received.push([token, nonce])), new AbortController().signal),
  ])
  assert.equal(h.loads, 1)
  assert.equal(h.initializations, 1)
  assert.equal(h.options.client_id, 'shared-app-client')
  assert.equal(h.options.nonce, 'random-page-nonce')
  h.options.callback({ credential: 'google-id-token', state: h.buttons.get(two).state })
  assert.deepEqual(received, [['google-id-token', 'random-page-nonce']])
  h.options.callback({ credential: 'unknown-button', state: 'unmounted-button' })
  assert.equal(received.length, 1)
})

test('closing the clicked form discards a late credential', async () => {
  const h = sdkHarness(), element = target(), abort = new AbortController()
  let received = false
  await h.service.render(element, button(() => { received = true }), abort.signal)
  const state = h.buttons.get(element).state
  abort.abort()
  h.options.callback({ credential: 'late-token', state })
  assert.equal(received, false)
})

test('a form closed during SDK loading never renders a button', async () => {
  let complete
  let renders = 0
  const service = createGoogleSignIn('client', 'nonce', () => new Promise(resolve => { complete = resolve }))
  const abort = new AbortController()
  const pending = service.render(target(), button(() => {}), abort.signal)
  abort.abort()
  complete({ initialize() {}, renderButton() { renders++ } })
  await pending
  assert.equal(renders, 0)
})

test('an SDK load failure is visible to the caller and an explicit retry can succeed', async () => {
  let attempts = 0
  const service = createGoogleSignIn('client', 'nonce', async () => {
    if (++attempts === 1) throw new Error('Network unavailable')
    return { initialize() {}, renderButton() {} }
  })
  await assert.rejects(service.render(target(), button(() => {}), new AbortController().signal), /Network unavailable/)
  await service.render(target(), button(() => {}), new AbortController().signal)
  assert.equal(attempts, 2)
})

test('empty Google credential responses produce an error rather than a session', async () => {
  const h = sdkHarness(), element = target()
  let errors = 0
  await h.service.render(element, { ...button(() => assert.fail('Invalid credential accepted')), onError: () => { errors++ } }, new AbortController().signal)
  h.options.callback({ state: h.buttons.get(element).state })
  assert.equal(errors, 1)
})
