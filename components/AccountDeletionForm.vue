<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    lang?: 'zh' | 'en'
  }>(),
  {
    lang: 'en',
  }
)

const runtimeConfig = useRuntimeConfig()
const apiBaseUrl = computed(() => {
  const raw = String(runtimeConfig.public.cloudApiBaseUrl ?? '').trim()
  return raw.replace(/\/+$/, '')
})

const email = ref('')
const code = ref('')
const confirmDeletion = ref(false)
const sendingCode = ref(false)
const deletingAccount = ref(false)
const cooldownSec = ref(0)
const message = ref('')
const messageTone = ref<'info' | 'error' | 'success'>('info')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const copy = computed(() => {
  if (props.lang === 'zh') {
    return {
      title: '网页自助删号',
      subtitle: '输入账号邮箱并完成验证码校验后，可直接删除云端账号。',
      emailLabel: '账号邮箱',
      emailPlaceholder: 'you@example.com',
      sendCode: '发送验证码',
      sendingCode: '发送中...',
      resendIn: (sec: number) => `${sec}s 后可重发`,
      codeLabel: '验证码',
      codePlaceholder: '请输入 6 位验证码',
      checkboxLabel: '我已知晓：删号会删除云端账号数据且不可撤销。',
      submit: '确认删除账号',
      submitting: '删除中...',
      invalidEmail: '请输入有效邮箱地址。',
      invalidCode: '请输入 6 位验证码。',
      needConfirm: '请先勾选不可撤销确认项。',
      codeSent: '若该邮箱已注册，验证码将发送到邮箱。',
      deleteSuccess: '账号删除请求已处理完成。',
      apiMissing: '未配置云服务地址，请稍后重试。',
      fallbackError: '请求失败，请稍后重试。',
    }
  }
  return {
    title: 'Web Self-Service Deletion',
    subtitle: 'Enter your account email and verification code to delete your cloud account directly.',
    emailLabel: 'Account email',
    emailPlaceholder: 'you@example.com',
    sendCode: 'Send code',
    sendingCode: 'Sending...',
    resendIn: (sec: number) => `Resend in ${sec}s`,
    codeLabel: 'Verification code',
    codePlaceholder: 'Enter 6-digit code',
    checkboxLabel: 'I understand this permanently deletes cloud account data and cannot be undone.',
    submit: 'Delete account now',
    submitting: 'Deleting...',
    invalidEmail: 'Please enter a valid email address.',
    invalidCode: 'Please enter a 6-digit verification code.',
    needConfirm: 'Please confirm the irreversible deletion notice first.',
    codeSent: 'If this email is registered, a verification code has been sent.',
    deleteSuccess: 'Account deletion has been processed.',
    apiMissing: 'Cloud API base URL is not configured.',
    fallbackError: 'Request failed. Please try again later.',
  }
})

function setMessage(tone: 'info' | 'error' | 'success', text: string) {
  messageTone.value = tone
  message.value = text
}

function stopCooldownTimer() {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
}

function startCooldown(seconds: number) {
  stopCooldownTimer()
  cooldownSec.value = Math.max(0, Math.floor(seconds))
  if (cooldownSec.value <= 0) {
    return
  }

  cooldownTimer = setInterval(() => {
    cooldownSec.value = Math.max(0, cooldownSec.value - 1)
    if (cooldownSec.value <= 0) {
      stopCooldownTimer()
    }
  }, 1000)
}

async function postJson(path: string, payload: Record<string, unknown>) {
  if (!apiBaseUrl.value) {
    throw new Error(copy.value.apiMissing)
  }

  const response = await fetch(`${apiBaseUrl.value}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({} as Record<string, unknown>))
  if (!response.ok) {
    const apiError = typeof data.error === 'string' ? data.error : ''
    throw new Error(apiError || copy.value.fallbackError)
  }
  return data
}

async function handleSendCode() {
  const normalizedEmail = email.value.trim().toLowerCase()
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    setMessage('error', copy.value.invalidEmail)
    return
  }
  if (cooldownSec.value > 0 || sendingCode.value || deletingAccount.value) {
    return
  }

  sendingCode.value = true
  setMessage('info', '')
  try {
    await postJson('/v1/auth/email/send-code', {
      email: normalizedEmail,
      purpose: 'account_delete',
    })
    email.value = normalizedEmail
    startCooldown(60)
    setMessage('success', copy.value.codeSent)
  } catch (error) {
    setMessage('error', (error as Error).message || copy.value.fallbackError)
  } finally {
    sendingCode.value = false
  }
}

async function handleDeleteAccount() {
  const normalizedEmail = email.value.trim().toLowerCase()
  const normalizedCode = code.value.trim()

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    setMessage('error', copy.value.invalidEmail)
    return
  }
  if (!/^\d{6}$/.test(normalizedCode)) {
    setMessage('error', copy.value.invalidCode)
    return
  }
  if (!confirmDeletion.value) {
    setMessage('error', copy.value.needConfirm)
    return
  }
  if (deletingAccount.value) {
    return
  }

  deletingAccount.value = true
  setMessage('info', '')
  try {
    await postJson('/v1/auth/account-deletion/confirm', {
      email: normalizedEmail,
      code: normalizedCode,
    })
    code.value = ''
    confirmDeletion.value = false
    setMessage('success', copy.value.deleteSuccess)
  } catch (error) {
    setMessage('error', (error as Error).message || copy.value.fallbackError)
  } finally {
    deletingAccount.value = false
  }
}

onBeforeUnmount(() => {
  stopCooldownTimer()
})
</script>

<template>
  <section class="account-delete-card">
    <header class="account-delete-header">
      <h3>{{ copy.title }}</h3>
      <p>{{ copy.subtitle }}</p>
    </header>

    <div class="account-delete-body">
      <label class="field">
        <span>{{ copy.emailLabel }}</span>
        <input
          v-model="email"
          type="email"
          :placeholder="copy.emailPlaceholder"
          autocomplete="email"
          inputmode="email"
        >
      </label>

      <button
        type="button"
        class="account-delete-btn account-delete-btn--secondary"
        :disabled="sendingCode || deletingAccount || cooldownSec > 0"
        @click="handleSendCode"
      >
        <template v-if="sendingCode">
          {{ copy.sendingCode }}
        </template>
        <template v-else-if="cooldownSec > 0">
          {{ copy.resendIn(cooldownSec) }}
        </template>
        <template v-else>
          {{ copy.sendCode }}
        </template>
      </button>

      <label class="field">
        <span>{{ copy.codeLabel }}</span>
        <input
          v-model="code"
          type="text"
          maxlength="6"
          :placeholder="copy.codePlaceholder"
          inputmode="numeric"
          autocomplete="one-time-code"
        >
      </label>

      <label class="checkbox-row">
        <input v-model="confirmDeletion" type="checkbox">
        <span>{{ copy.checkboxLabel }}</span>
      </label>

      <button
        type="button"
        class="account-delete-btn account-delete-btn--danger"
        :disabled="deletingAccount || sendingCode"
        @click="handleDeleteAccount"
      >
        <template v-if="deletingAccount">
          {{ copy.submitting }}
        </template>
        <template v-else>
          {{ copy.submit }}
        </template>
      </button>

      <p v-if="message" class="form-message" :data-tone="messageTone">
        {{ message }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.account-delete-card {
  margin: 1rem 0;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--cream-light);
  padding: 1rem;
}

.account-delete-header h3 {
  margin: 0;
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.account-delete-header p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.account-delete-body {
  margin-top: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field span {
  color: var(--text-muted);
  font-size: 11px;
}

.field input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 2px;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.4;
  padding: 0.58rem 0.7rem;
  outline: none;
}

.field input::placeholder {
  color: var(--text-muted);
  opacity: 0.9;
}

.field input:focus,
.field input:focus-visible {
  border-color: var(--terra);
  outline: 2px solid rgba(198, 122, 75, 0.2);
  outline-offset: 1px;
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.6;
}

.checkbox-row input {
  margin-top: 0.1rem;
  accent-color: var(--terra);
}

.account-delete-btn {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
  padding: 0.68rem 0.7rem;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}

.account-delete-btn:focus-visible {
  outline: 2px solid var(--terra);
  outline-offset: 1px;
}

.account-delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.account-delete-btn--secondary {
  background: transparent;
  color: var(--terra);
  border-color: var(--terra);
}

.account-delete-btn--secondary:hover:not(:disabled) {
  background: rgba(198, 122, 75, 0.08);
}

.account-delete-btn--danger {
  background: var(--state-error);
  color: #fff;
  border-color: var(--state-error-border);
}

.account-delete-btn--danger:hover:not(:disabled) {
  background: var(--state-error-hover);
  border-color: var(--state-error-hover);
}

.account-delete-btn--danger:focus-visible {
  outline-color: var(--state-error-border);
}

.form-message {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
}

.form-message[data-tone="success"] {
  color: var(--state-success);
}

.form-message[data-tone="error"] {
  color: var(--state-error);
}

.form-message[data-tone="info"] {
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .account-delete-card {
    padding: 0.9rem;
  }
}
</style>
