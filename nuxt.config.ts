import { existsSync, readFileSync } from 'node:fs'
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
  ssr: true,
  image: {
    provider: "none",
  },
  app: {
    baseURL: appBaseUrl,
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en'],
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
    github: {
      url: '',
    },
  },
})
