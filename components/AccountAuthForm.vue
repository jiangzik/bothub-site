<script setup lang="ts">
const props = withDefaults(defineProps<{ lang?: 'zh' | 'en', showLoginTitle?: boolean }>(), { lang: 'zh', showLoginTitle: true })
const account = useBothubAccount()
const { localePath } = useDocusI18n()
const zh = computed(() => props.lang !== 'en')
const copy = computed(() => zh.value
  ? {
      loginTitle: '登录 BotHub 账号',
      loginHint: '与 App 共用同一个 BotHub 账号。',
      orEmail: '或使用邮箱登录',
      email: '邮箱',
      password: '密码',
      login: '登录',
      loggingIn: '登录中…',
      forgot: '忘记密码 / 还没设置过密码',
      noAccount: '首次使用 Google 登录将创建 BotHub 账号。',
      download: '下载 BotHub',
      resetTitle: '设置新密码',
      resetHint: '通过 Google 或 Apple 登录的账号也可以在这里设置密码，之后就能用邮箱登录。',
      code: '验证码',
      sendCode: '发送验证码',
      resendIn: (s: number) => `${s} 秒后可重发`,
      codeSent: '如果这个邮箱已注册，验证码会发到邮箱里。',
      newPassword: '新密码（至少 8 位）',
      resetSubmit: '设置并登录',
      backToLogin: '返回登录',
      errInvalidEmail: '请输入有效的邮箱地址。',
      errPassword: '请输入密码。',
      errCode: '请输入 6 位验证码。',
      errNewPassword: '新密码至少 8 位。',
    }
  : {
      loginTitle: 'Sign in to BotHub',
      loginHint: 'Use the same BotHub account as the app.',
      orEmail: 'Or sign in with email',
      email: 'Email',
      password: 'Password',
      login: 'Sign in',
      loggingIn: 'Signing in…',
      forgot: 'Forgot password / never set one',
      noAccount: 'Signing in with Google for the first time creates a BotHub account.',
      download: 'Download BotHub',
      resetTitle: 'Set a new password',
      resetHint: 'Accounts that sign in with Google or Apple can set a password here to sign in with email.',
      code: 'Verification code',
      sendCode: 'Send code',
      resendIn: (s: number) => `Resend in ${s}s`,
      codeSent: 'If this email is registered, a code has been sent.',
      newPassword: 'New password (8+ characters)',
      resetSubmit: 'Set password and sign in',
      backToLogin: 'Back to sign in',
      errInvalidEmail: 'Please enter a valid email address.',
      errPassword: 'Please enter your password.',
      errCode: 'Please enter the 6-digit code.',
      errNewPassword: 'Password must be at least 8 characters.',
    })

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const describeError = useBothubErrorMessage(zh)

const authMode = ref<'login' | 'reset'>('login')
const email = ref('')
const password = ref('')
const resetCode = ref('')
const newPassword = ref('')
const authBusy = ref(false)
const authMessage = ref('')
const authMessageTone = ref<'error' | 'info'>('error')
const cooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function normalizedEmail(): string | null {
  const value = email.value.trim().toLowerCase()
  return EMAIL_REGEX.test(value) ? value : null
}

function setAuthMessage(text: string, tone: 'error' | 'info' = 'error'): void {
  authMessage.value = text
  authMessageTone.value = tone
}

async function handleLogin(): Promise<void> {
  if (authBusy.value) return
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!password.value) return setAuthMessage(copy.value.errPassword)
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.login(value, password.value)
    password.value = ''
  }
  catch (error) {
    setAuthMessage(describeError(error, 'login'))
  }
  finally {
    authBusy.value = false
  }
}

async function handleGoogleLogin(idToken: string, nonce: string): Promise<void> {
  if (authBusy.value) return
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.loginWithGoogle(idToken, nonce)
    password.value = ''
  }
  catch (error) {
    setAuthMessage(describeError(error, 'google'))
  }
  finally { authBusy.value = false }
}

function startCooldown(seconds: number): void {
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldown.value = seconds
  cooldownTimer = setInterval(() => {
    cooldown.value = Math.max(0, cooldown.value - 1)
    if (cooldown.value === 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

async function handleSendCode(): Promise<void> {
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (authBusy.value || cooldown.value > 0) return
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.sendResetCode(value)
    startCooldown(60)
    setAuthMessage(copy.value.codeSent, 'info')
  }
  catch (error) {
    setAuthMessage(describeError(error))
  }
  finally {
    authBusy.value = false
  }
}

async function handleReset(): Promise<void> {
  if (authBusy.value) return
  const value = normalizedEmail()
  if (!value) return setAuthMessage(copy.value.errInvalidEmail)
  if (!/^\d{6}$/.test(resetCode.value.trim())) return setAuthMessage(copy.value.errCode)
  if (newPassword.value.length < 8) return setAuthMessage(copy.value.errNewPassword)
  authBusy.value = true
  setAuthMessage('')
  try {
    await account.resetPassword(value, resetCode.value.trim(), newPassword.value)
    resetCode.value = ''
    newPassword.value = ''
    authMode.value = 'login'
  }
  catch (error) {
    setAuthMessage(describeError(error))
  }
  finally {
    authBusy.value = false
  }
}

onBeforeUnmount(() => { if (cooldownTimer) clearInterval(cooldownTimer) })
</script>
<template>
  <div class="account-auth-form">
        <template v-if="authMode === 'login'">
          <h2 v-if="props.showLoginTitle">{{ copy.loginTitle }}</h2>
          <p class="muted">{{ copy.loginHint }}</p>
          <ClientOnly><GoogleSignInButton :lang="zh ? 'zh' : 'en'" :disabled="authBusy" @credential="handleGoogleLogin" /></ClientOnly>
          <div class="auth-divider">{{ copy.orEmail }}</div>
          <form class="form" @submit.prevent="handleLogin">
            <label class="field">
              <span>{{ copy.email }}</span>
              <input v-model="email" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com">
            </label>
            <label class="field">
              <span>{{ copy.password }}</span>
              <input v-model="password" type="password" autocomplete="current-password">
            </label>
            <button class="btn btn-primary" type="submit" :disabled="authBusy">
              {{ authBusy ? copy.loggingIn : copy.login }}
            </button>
          </form>
          <p v-if="authMessage" role="alert" class="message" :data-tone="authMessageTone">{{ authMessage }}</p>
          <div class="auth-links">
            <button type="button" class="link" @click="authMode = 'reset'; setAuthMessage('')">{{ copy.forgot }}</button>
            <span class="muted">
              {{ copy.noAccount }}
              <NuxtLink :to="`${localePath('/')}#download`">{{ copy.download }}</NuxtLink>
            </span>
          </div>
        </template>

        <template v-else>
          <h2>{{ copy.resetTitle }}</h2>
          <p class="muted">{{ copy.resetHint }}</p>
          <form class="form" @submit.prevent="handleReset">
            <label class="field">
              <span>{{ copy.email }}</span>
              <input v-model="email" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com">
            </label>
            <div class="field-row">
              <label class="field">
                <span>{{ copy.code }}</span>
                <input v-model="resetCode" type="text" maxlength="6" inputmode="numeric" autocomplete="one-time-code">
              </label>
              <button type="button" class="btn btn-secondary" :disabled="authBusy || cooldown > 0" @click="handleSendCode">
                {{ cooldown > 0 ? copy.resendIn(cooldown) : copy.sendCode }}
              </button>
            </div>
            <label class="field">
              <span>{{ copy.newPassword }}</span>
              <input v-model="newPassword" type="password" autocomplete="new-password">
            </label>
            <button class="btn btn-primary" type="submit" :disabled="authBusy">{{ copy.resetSubmit }}</button>
          </form>
          <p v-if="authMessage" role="alert" class="message" :data-tone="authMessageTone">{{ authMessage }}</p>
          <div class="auth-links">
            <button type="button" class="link" @click="authMode = 'login'; setAuthMessage('')">{{ copy.backToLogin }}</button>
          </div>
        </template>
  </div>
</template>
<style scoped>
.account-auth-form { --r-error: #c0362c; --r-success: #2f7d4f; color: var(--text-primary); }
:global(.dark) .account-auth-form { --r-error: #ff8a80; --r-success: #7fd4a0; }
h2 { margin: 0; font-size: 20px; font-weight: 650; }
.muted {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}
.auth-divider { display: flex; align-items: center; gap: 12px; margin-top: 20px; color: var(--text-secondary); font-size: 12px; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.form {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.field span {
  color: var(--text-secondary);
  font-size: 13px;
}
.field input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-size: 15px;
  padding: 10px 12px;
  outline: none;
}
.field input:focus-visible {
  border-color: var(--ink);
}
.field-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--ink);
  color: var(--cream-light);
}
.btn-primary:hover:not(:disabled) {
  opacity: 0.85;
}
.btn-secondary {
  background: transparent;
  color: var(--ink);
  border-color: var(--border);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--sand);
}
.link {
  border: none;
  background: none;
  padding: 0;
  color: var(--ink);
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.auth-links {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.auth-links a {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.message {
  margin: 14px 0 0;
  font-size: 14px;
  line-height: 1.6;
}
.message[data-tone='error'] {
  color: var(--r-error);
}
.message[data-tone='info'] {
  color: var(--text-secondary);
}
.actions .btn {
    flex: 1;
  }
</style>
