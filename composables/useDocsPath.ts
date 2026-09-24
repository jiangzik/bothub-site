// Docs content is always generated under a locale prefix (/zh/..., /en/...),
// even for the default locale, so localePath() would point at a 404.
export const useDocsPath = () => {
  const { locale } = useDocusI18n()
  return (path: string) => `/${locale.value}${path.startsWith('/') ? path : `/${path}`}`
}
