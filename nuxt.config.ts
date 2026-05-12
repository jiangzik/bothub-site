import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// 版本号 / 下载 URL 全部由 client 端从 https://bothub.bookab.info/version.json
// fetch 得到，build 阶段不需要知道任何版本信息。
// version.json 的权威源由 bothub 大仓的 release CI 在发版时写入。

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
const enableRobotsTxt = appBaseUrl === '/'

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
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
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
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
    },
  },
  runtimeConfig: {
    public: {
      cloudApiBaseUrl: (process.env.NUXT_PUBLIC_CLOUD_API_BASE_URL || 'https://bothub-api.bookab.info').trim(),
    },
  },
  modules: [
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hook('modules:done', () => {
        nuxt.options.appConfig.github = false as never

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
  robots: {
    robotsTxt: enableRobotsTxt,
  },
  devServer: {
    host: '0.0.0.0',
    port: 8090,
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
    ui: {
      colors: {
        primary: 'orange',
        neutral: 'stone',
      },
      contentSearch: {
        slots: {
          modal: 'bothub-modal-surface bothub-modal--search w-[calc(100vw-1rem)] sm:w-[min(1180px,calc(100vw-2rem))] sm:max-w-none h-[min(84vh,820px)]',
          input: '[&>input]:text-base/5',
        },
      },
    },
    github: false,
  },
})
