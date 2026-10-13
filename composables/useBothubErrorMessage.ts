import type { Ref } from 'vue'
import { BothubApiError } from '~/composables/useBothubAccount'
export function useBothubErrorMessage(zh: Ref<boolean>) {
  return (error: unknown, context: 'login' | 'google' | 'register' | 'other' = 'other'): string => {
    if (error instanceof BothubApiError) {
      if (context === 'register' && error.status === 409) return zh.value ? '这个邮箱已注册，请直接登录；如果通过 Google 或 Apple 注册，可先设置密码。' : 'This email is already registered. Sign in, or set a password if you registered with Google or Apple.'
      if (error.status === 429) return zh.value ? '操作太频繁，请稍后再试。' : 'Too many attempts. Please try again later.'
      if (error.status === 401 && context === 'google') return zh.value ? 'Google 登录验证失败，请重试。' : 'Google sign-in verification failed. Please try again.'
      if (error.status === 401) return context === 'login'
        ? (zh.value ? '邮箱或密码不正确。' : 'Incorrect email or password.')
        : (zh.value ? '登录已过期，请重新登录。' : 'Your session expired. Sign in again.')
      if (error.status < 500 && error.message) return error.message
    }
    return zh.value ? '请求失败，请稍后重试。' : 'Request failed. Please try again later.'
  }
}
