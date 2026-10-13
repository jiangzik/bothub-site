import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as vue from 'vue'
import { parse, compileScript } from '@vue/compiler-sfc'

const source = readFileSync(new URL('../components/AccountAuthForm.vue', import.meta.url), 'utf8')
const { descriptor } = parse(source)
const script = compileScript(descriptor, { id: 'test-auth-form' }).content
const compiled = ts.transpileModule(script, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
class ApiError extends Error {
  constructor(status, detail) { super('Request rejected'); this.status = status; this.detail = detail }
}
function harness(overrides = {}) {
  const calls = []
  const account = {
    register: async (...args) => { calls.push(['register', ...args]) },
    resetPassword: async (...args) => { calls.push(['reset', ...args]) },
    sendEmailCode: async (...args) => { calls.push(['send', ...args]) },
    ...overrides,
  }
  const context = {
    exports: {}, ref: vue.ref, computed: vue.computed, watch: vue.watch,
    onMounted() {}, onBeforeUnmount() {}, setInterval, clearInterval,
    useBothubAccount: () => account,
    useBothubErrorMessage: () => error => error.message,
    require: name => name === 'vue' ? { ...vue, useModel: () => vue.ref('login') } : { BothubApiError: ApiError },
  }
  vm.runInNewContext(compiled, context)
  const form = context.exports.default.setup({ lang: 'zh', showTitle: true }, { expose() {} })
  return { form, calls }
}
async function registration(form) {
  form.setMode('register')
  form.email.value = ' NEW@Example.com '
  await vue.nextTick()
  form.verificationCode.value = ' 123456 '
  form.newPassword.value = 'synthetic-password'
  form.confirmPassword.value = 'synthetic-password'
}

test('registration validates confirmation before sending any account mutation', async () => {
  const { form, calls } = harness()
  await registration(form)
  form.confirmPassword.value = 'different-password'
  await form.handleEmailVerification()
  assert.equal(calls.length, 0)
  assert.equal(form.authMessage.value, '两次输入的密码不一致。')
})

test('registration submits normalized fields and clears secrets after success', async () => {
  const { form, calls } = harness()
  await registration(form)
  form.invitationCode.value = ' invite-123 '
  await form.handleEmailVerification()
  assert.deepEqual(calls, [['register', 'new@example.com', 'synthetic-password', '123456', 'invite-123']])
  assert.equal(form.newPassword.value, '')
  assert.equal(form.confirmPassword.value, '')
  assert.equal(form.verificationCode.value, '')
})

test('register and reset codes have separate cooldowns; switching clears entered secrets and codes', async () => {
  const { form, calls } = harness()
  await registration(form)
  await form.handleSendCode()
  assert.equal(form.cooldown.value, 60)
  assert.match(form.authMessage.value, /注册验证码已发送/)
  form.setMode('reset')
  assert.equal(form.cooldown.value, 0)
  assert.equal(form.verificationCode.value, '')
  assert.equal(form.newPassword.value, '')
  await form.handleSendCode()
  assert.deepEqual(calls.map(call => call[2]), ['register', 'reset_password'])
  form.setMode('register')
  assert.equal(form.cooldown.value, 60)
  form.email.value = 'other@example.com'
  await vue.nextTick()
  assert.equal(form.cooldown.value, 0)
})

test('server cooldown is applied only to the matching recipient and purpose', async () => {
  const { form } = harness({ sendEmailCode: async () => { throw new ApiError(429, { retryAfterSec: 24 }) } })
  await registration(form)
  await form.handleSendCode()
  assert.equal(form.cooldown.value, 24)
  assert.equal(form.authMessageTone.value, 'error')
  form.setMode('reset')
  assert.equal(form.cooldown.value, 0)
})

test('an in-flight registration prevents mode changes and duplicate submission', async () => {
  let complete, requests = 0
  const { form } = harness({ register: async () => { requests++; await new Promise(resolve => { complete = resolve }) } })
  await registration(form)
  const pending = form.handleEmailVerification()
  form.setMode('reset')
  await form.handleEmailVerification()
  assert.equal(form.authMode.value, 'register')
  assert.equal(requests, 1)
  complete()
  await pending
  assert.equal(form.authBusy.value, false)
})

test('failed registration remains visible and preserves fields for correction', async () => {
  const { form } = harness({ register: async () => { throw new Error('Verification code expired') } })
  await registration(form)
  await form.handleEmailVerification()
  assert.equal(form.authMode.value, 'register')
  assert.equal(form.authMessage.value, 'Verification code expired')
  assert.equal(form.authMessageTone.value, 'error')
  assert.equal(form.newPassword.value, 'synthetic-password')
  assert.equal(form.authBusy.value, false)
})
