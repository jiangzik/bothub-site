import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { ref, computed, readonly } from 'vue'

const source = readFileSync(new URL('../composables/useBothubAccount.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source.replaceAll('import.meta.server', 'false'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const user = { id: 'alice', email: 'alice@example.com', name: null }
const stored = { token: 'expired', refreshToken: 'refresh-1', user }
const json = (status, value) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
const denied = () => json(401, { error: { code: 'UNAUTHORIZED', message: 'Expired' } })
function harness(fetch) {
  const state = new Map()
  const storage = new Map([['bothub.web.session', JSON.stringify(stored)]])
  const context = {
    exports: {}, computed, readonly, AbortSignal, console, fetch,
    useRuntimeConfig: () => ({ public: { cloudApiBaseUrl: 'https://api.example.com' } }),
    useState: (key, init) => { if (!state.has(key)) state.set(key, ref(init())); return state.get(key) },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
  }
  vm.runInNewContext(compiled, context)
  const first = context.exports.useBothubAccount()
  const second = context.exports.useBothubAccount()
  first.restore()
  return { first, second, storage }
}

test('concurrent requests from different components rotate the refresh token once', async () => {
  let refreshCount = 0
  const { first, second } = harness(async (url, init) => {
    if (url.endsWith('/v1/auth/refresh')) {
      refreshCount++
      await new Promise(resolve => setTimeout(resolve, 10))
      return json(200, { token: 'fresh', refreshToken: 'refresh-2' })
    }
    return init.headers.Authorization === 'Bearer fresh' ? json(200, { ok: true }) : denied()
  })
  const results = await Promise.all([first.authed('/keys'), second.authed('/balance')])
  assert.equal(refreshCount, 1)
  assert.equal(results.every(value => value.ok), true)
  assert.equal(first.session.value.refreshToken, 'refresh-2')
})

test('a second authentication rejection clears the shared session and storage', async () => {
  const { first, second, storage } = harness(async url => url.endsWith('/refresh')
    ? json(200, { token: 'still-invalid', refreshToken: 'refresh-2' }) : denied())
  await assert.rejects(first.authed('/keys'), error => error.status === 401)
  assert.equal(second.user.value, null)
  assert.equal(storage.has('bothub.web.session'), false)
})

test('an in-flight refresh cannot restore a session after sign-out', async () => {
  let finishRefresh
  let startedRefresh
  const started = new Promise(resolve => { startedRefresh = resolve })
  let protectedRequests = 0
  const { first, second } = harness(async url => {
    if (url.endsWith('/refresh')) {
      startedRefresh()
      await new Promise(resolve => { finishRefresh = resolve })
      return json(200, { token: 'fresh', refreshToken: 'refresh-2' })
    }
    if (url.endsWith('/logout')) return json(200, { ok: true })
    protectedRequests++
    return denied()
  })
  const request = first.authed('/keys')
  await started
  await second.logout()
  finishRefresh()
  await assert.rejects(request, error => error.status === 401)
  assert.equal(first.user.value, null)
  assert.equal(protectedRequests, 1)
})

test('rate-limited refresh preserves the session for a later retry', async () => {
  const { first } = harness(async url => url.endsWith('/refresh') ? json(429, { error: 'Rate limited' }) : denied())
  await assert.rejects(first.authed('/keys'), error => error.status === 429)
  assert.equal(first.user.value.id, user.id)
})

test('key creation is not replayed on a server failure', async () => {
  let requests = 0
  const { first } = harness(async () => { requests++; return json(500, { error: 'Unavailable' }) })
  await assert.rejects(first.authed('/v1/developer/api-keys', { body: { name: 'My app' } }), error => error.status === 500)
  assert.equal(requests, 1)
})


test('Google login uses the App OAuth endpoint and the same shared persisted session', async () => {
  const requests = []
  const signedIn = { token: 'google-access', refreshToken: 'google-refresh', user }
  const { first, second, storage } = harness(async (url, init) => {
    requests.push({ url, init })
    return json(200, signedIn)
  })
  await first.loginWithGoogle('signed-google-id-token', 'page-nonce')
  assert.equal(requests[0].url, 'https://api.example.com/v1/auth/google/login')
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    idToken: 'signed-google-id-token', nonce: 'page-nonce',
    clientInfo: { platform: 'web', deviceName: 'BotHub 官网' },
  })
  assert.equal(second.user.value.id, user.id)
  assert.equal(second.session.value.token, signedIn.token)
  assert.deepEqual(JSON.parse(storage.get('bothub.web.session')), signedIn)
  await second.authed('/v1/developer/api-keys')
  assert.equal(requests[1].init.headers.Authorization, 'Bearer google-access')
})

test('rejected Google credentials do not overwrite the current account session', async () => {
  const { first, storage } = harness(async () => denied())
  await assert.rejects(first.loginWithGoogle('invalid-google-id-token', 'page-nonce'), error => error.status === 401)
  assert.equal(first.session.value.token, stored.token)
  assert.deepEqual(JSON.parse(storage.get('bothub.web.session')), stored)
})

test('registration sends a register-purpose code without creating a session', async () => {
  const requests = []
  const { first, storage } = harness(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) })
    return json(200, { success: true, ttlSec: 600 })
  })
  await first.sendEmailCode('new@example.com', 'register', 'invite-123')
  assert.deepEqual(requests, [{ url: 'https://api.example.com/v1/auth/email/send-code', body: {
    email: 'new@example.com', purpose: 'register', invitationCode: 'invite-123',
  } }])
  assert.deepEqual(JSON.parse(storage.get('bothub.web.session')), stored)
})

test('email registration uses the App registration endpoint and immediately shares the session', async () => {
  const requests = []
  const newUser = { id: 'new-account', email: 'new@example.com', name: null }
  const signedIn = { token: 'registered-access', refreshToken: 'registered-refresh', user: newUser }
  const { first, second, storage } = harness(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) })
    return json(200, signedIn)
  })
  await first.register(newUser.email, 'synthetic-password', '123456')
  assert.deepEqual(requests, [{ url: 'https://api.example.com/v1/auth/register', body: {
    email: newUser.email, password: 'synthetic-password', code: '123456',
    clientInfo: { platform: 'web', deviceName: 'BotHub 官网' },
  } }])
  assert.equal(second.user.value.id, newUser.id)
  assert.deepEqual(JSON.parse(storage.get('bothub.web.session')), signedIn)
})

test('an expired code or existing email leaves the session unchanged and is not retried', async () => {
  for (const status of [400, 409]) {
    let requests = 0
    const { first, storage } = harness(async () => { requests++; return json(status, { error: { code: status === 409 ? 'CONFLICT' : 'BAD_REQUEST', message: 'Registration rejected' } }) })
    await assert.rejects(first.register('new@example.com', 'synthetic-password', '123456'), error => error.status === status)
    assert.equal(requests, 1)
    assert.deepEqual(JSON.parse(storage.get('bothub.web.session')), stored)
  }
})
