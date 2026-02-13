import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

interface VersionEntry {
  version?: string
  url?: string
  notes?: string
}

interface VersionJson {
  android?: VersionEntry
  mac?: VersionEntry
  windows?: VersionEntry
  linux?: VersionEntry
}

const readVersionJson = (relativePath: string): VersionJson => {
  const fullPath = resolve(process.cwd(), relativePath)
  if (!existsSync(fullPath)) {
    return {}
  }
  try {
    const raw = readFileSync(fullPath, 'utf8')
    return JSON.parse(raw) as VersionJson
  } catch {
    return {}
  }
}

const versionJson = readVersionJson('public/version.json')

const CONTENT_ROOT = resolve(process.cwd(), 'content')
const ORDER_PREFIX_RE = /^\d+\./

const stripOrderPrefix = (segment: string): string => segment.replace(ORDER_PREFIX_RE, '')

const walkMarkdownFiles = (rootDir: string): string[] => {
  if (!existsSync(rootDir)) {
    return []
  }

  const files: string[] = []
  const stack = [rootDir]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    const entries = readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = resolve(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  return files
}

const toContentRoute = (filePath: string): string => {
  const relativePath = filePath.slice(CONTENT_ROOT.length + 1).replace(/\\/g, '/')
  const withoutExt = relativePath.replace(/\.md$/, '')
  const segments = withoutExt.split('/').map(stripOrderPrefix)
  const normalizedSegments = segments.at(-1) === 'index' ? segments.slice(0, -1) : segments
  return `/${normalizedSegments.filter(Boolean).join('/')}`
}

const prerenderRoutes = (() => {
  const routes = new Set<string>(['/', '/zh', '/en'])
  for (const filePath of walkMarkdownFiles(CONTENT_ROOT)) {
    routes.add(toContentRoute(filePath))
  }
  return Array.from(routes)
})()

const normalizeBaseUrl = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') {
    return '/'
  }
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

const isAbsoluteUrl = (value: string): boolean => /^(?:[a-z]+:)?\/\//i.test(value)

const withAppBaseUrl = (baseUrl: string, value?: string): string => {
  if (!value) {
    return ''
  }
  if (isAbsoluteUrl(value)) {
    return value
  }
  const normalized = value.replace(/^\/+/, '')
  if (baseUrl === '/') {
    return `/${normalized}`
  }
  return `${baseUrl}${normalized}`
}

const appBaseUrl = normalizeBaseUrl(process.env.NUXT_APP_BASE_URL || '/')

export default defineNuxtConfig({
  extends: ['docus'],
  hooks: {
    'pages:extend'(pages) {
      for (const page of pages) {
        if (page.file?.includes('node_modules/docus/app/templates/landing.vue')) {
          page.path = '/'
        }
      }
    },
  },
  ssr: true,
  image: {
    provider: "none",
  },
  app: {
    baseURL: appBaseUrl,
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: withAppBaseUrl(appBaseUrl, 'favicon-32.png'),
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: withAppBaseUrl(appBaseUrl, 'favicon-192.png'),
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: withAppBaseUrl(appBaseUrl, 'apple-touch-icon.png'),
        },
        {
          rel: 'shortcut icon',
          href: withAppBaseUrl(appBaseUrl, 'favicon.ico'),
        },
      ],
    },
  },
  routeRules: {
    '/privacy-policy': { redirect: '/zh/faq/privacy-policy' },
    '/privacy-policy/': { redirect: '/zh/faq/privacy-policy' },
    '/quick-start': { redirect: '/zh/quick-start/overview' },
    '/quick-start/': { redirect: '/zh/quick-start/overview' },
    '/manual': { redirect: '/zh/manual/overview' },
    '/manual/': { redirect: '/zh/manual/overview' },
    '/faq': { redirect: '/zh/faq/overview' },
    '/faq/': { redirect: '/zh/faq/overview' },
    '/changelog': { redirect: '/zh/changelog/overview' },
    '/changelog/': { redirect: '/zh/changelog/overview' },
    '/zh/quick-start': { redirect: '/zh/quick-start/overview' },
    '/zh/quick-start/': { redirect: '/zh/quick-start/overview' },
    '/zh/manual': { redirect: '/zh/manual/overview' },
    '/zh/manual/': { redirect: '/zh/manual/overview' },
    '/zh/faq': { redirect: '/zh/faq/overview' },
    '/zh/faq/': { redirect: '/zh/faq/overview' },
    '/zh/privacy-policy': { redirect: '/zh/faq/privacy-policy' },
    '/zh/privacy-policy/': { redirect: '/zh/faq/privacy-policy' },
    '/zh/changelog': { redirect: '/zh/changelog/overview' },
    '/zh/changelog/': { redirect: '/zh/changelog/overview' },
    '/en/quick-start': { redirect: '/en/quick-start/overview' },
    '/en/quick-start/': { redirect: '/en/quick-start/overview' },
    '/en/manual': { redirect: '/en/manual/overview' },
    '/en/manual/': { redirect: '/en/manual/overview' },
    '/en/faq': { redirect: '/en/faq/overview' },
    '/en/faq/': { redirect: '/en/faq/overview' },
    '/en/privacy-policy': { redirect: '/en/faq/privacy-policy' },
    '/en/privacy-policy/': { redirect: '/en/faq/privacy-policy' },
    '/en/changelog': { redirect: '/en/changelog/overview' },
    '/en/changelog/': { redirect: '/en/changelog/overview' },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
    },
  },
  runtimeConfig: {
    public: {
      appVersion: versionJson.android?.version || '',
      downloads: {
        apk: withAppBaseUrl(appBaseUrl, versionJson.android?.url || 'downloads/app-release.apk'),
        mac: withAppBaseUrl(appBaseUrl, versionJson.mac?.url),
        windows: withAppBaseUrl(appBaseUrl, versionJson.windows?.url),
        linux: withAppBaseUrl(appBaseUrl, versionJson.linux?.url),
      },
      versions: {
        android: versionJson.android?.version || '',
        mac: versionJson.mac?.version || '',
        windows: versionJson.windows?.version || '',
        linux: versionJson.linux?.version || '',
      },
    },
  },
  modules: [
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hook('modules:done', () => {
        const locales = nuxt.options.i18n?.locales || []
        const normalizedLocales = locales.map((locale) => {
          if (typeof locale === 'string') {
            return { code: locale, name: locale }
          }
          return { code: locale.code, name: locale.name || locale.code }
        })

        nuxt.options.runtimeConfig.public.docus = {
          ...(nuxt.options.runtimeConfig.public.docus || {}),
          filteredLocales: normalizedLocales,
        }
      })
    },
  ],
  imports: {
    transform: {
      include: [/node_modules[\\/]docus[\\/]app[\\/]/],
    },
  },
  css: ['~/assets/css/ui-overrides.css'],
  i18n: {
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
  },
  site: {
    name: 'BotHub',
  },
  devServer: {
    host: '0.0.0.0',
  },
  appConfig: {
    header: {
      title: 'BotHub',
      logo: {
        light: withAppBaseUrl(appBaseUrl, 'logo-mark-light.png'),
        dark: withAppBaseUrl(appBaseUrl, 'logo-mark-dark.png'),
        alt: 'BotHub',
        height: '40px',
      },
    },
    github: null,
  },
})
