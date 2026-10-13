import { createGoogleSignIn, loadGoogleIdentity } from '~/utils/google-sign-in'

export default defineNuxtPlugin(() => ({
  provide: {
    googleSignIn: createGoogleSignIn(
      String(useRuntimeConfig().public.googleClientId),
      crypto.randomUUID(),
      loadGoogleIdentity,
    ),
  },
}))
