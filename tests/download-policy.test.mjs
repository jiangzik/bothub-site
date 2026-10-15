import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createRequire } from 'node:module'
import { parse, compileScript } from '@vue/compiler-sfc'
import { createSSRApp, h, ref, computed, toValue, watch } from 'vue'
import { renderToString } from '@vue/server-renderer'

function loadUtility(file) {
  const source = readFileSync(new URL(`../utils/${file}.ts`, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const context = { exports: {} }
  vm.runInNewContext(compiled, context)
  return context.exports
}
const { preferredDownloadPlatform } = loadUtility('platform-download')
test('Android uses the APK platform through the shared direct-download policy', () => {
  assert.equal(preferredDownloadPlatform('android'), 'android')
  for (const platform of ['mac', 'windows', 'linux']) assert.equal(preferredDownloadPlatform(platform), platform)
  assert.equal(preferredDownloadPlatform('ios'), null)
  assert.equal(preferredDownloadPlatform('unknown'), null)
})

const require = createRequire(import.meta.url)
async function renderOnAndroid(file, props = {}) {
  const source = readFileSync(new URL(`../components/${file}.vue`, import.meta.url), 'utf8')
  const { descriptor } = parse(source, { filename: `${file}.vue` })
  const script = compileScript(descriptor, { id: 'download-policy-test', inlineTemplate: true })
  const compiled = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const context = {
    exports: {}, computed,
    require: id => id === '~/utils/platform-download' ? { preferredDownloadPlatform } : require(id),
    useDocusI18n: () => ({ locale: ref('zh'), localePath: path => `/zh${path === '/' ? '' : path}` }),
    useDocsPath: () => path => `/zh${path}`,
    useVersionManifest: () => ({ status: ref('error'), error: ref(new Error('Test release failure')), refresh: () => {} }),
    useDetectedPlatform: () => ref('android'),
    useRuntimeConfig: () => ({ app: { baseURL: '/' }, public: {} }),
    usePlatformDownload: platform => {
      assert.equal(toValue(platform), 'android')
      return {
        downloadHref: ref('/downloads/current.apk'), effectiveHref: ref('/downloads/current.apk'),
        version: ref('1.0.0'), statusText: ref(''), selecting: ref(false), sourceState: ref('idle'),
        warm: () => {}, start: () => {},
      }
    },
  }
  vm.runInNewContext(compiled, context)
  const app = createSSRApp({ render: () => h(context.exports.default, props) })
  for (const name of ['UIcon', 'HeroDownloadButton', 'NuxtLink', 'ProductDemo', 'VersionBadge', 'DownloadMacButton', 'DownloadWindowsButton', 'DownloadLinuxButton', 'DownloadApkButton', 'DownloadGooglePlayButton', 'PhoneDemo', 'JoinQqGroupButton']) app.component(name, { render: () => null })
  return renderToString(app)
}

test('Android hero renders an APK download rather than a Play Store link', async () => {
  const html = await renderOnAndroid('HeroDownloadButton')
  assert.match(html, /href="\/downloads\/current\.apk"/)
  assert.match(html, /下载 Android APK/)
  assert.doesNotMatch(html, /play\.google\.com/)
})

test('APK is the only recommended Android download card', async () => {
  const apk = await renderOnAndroid('DownloadButton', { platform: 'android', title: 'APK' })
  const store = await renderOnAndroid('DownloadGooglePlayButton')
  assert.match(apk, /data-recommended="true"/)
  assert.match(apk, /适合当前设备/)
  assert.doesNotMatch(store, /data-recommended|适合当前设备|推荐渠道/)
})

test('no Android URL is invented when the release manifest has not loaded', () => {
  const source = readFileSync(new URL('../composables/usePlatformDownload.ts', import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const context = {
    exports: {}, computed, ref, toValue, watch, URL,
    useVersionManifest: () => ({ data: ref({}) }),
    useDocusI18n: () => ({ locale: ref('zh') }),
    getVersionEntryUrl: entry => entry?.url || '',
  }
  vm.runInNewContext(compiled, context)
  const download = context.exports.usePlatformDownload(ref('android'))
  assert.equal(download.downloadHref.value, '')
  assert.equal(download.effectiveHref.value, '')
})

test('failed release loading is presented as an error with a retry action', async () => {
  const html = await renderOnAndroid('LandingPage')
  assert.match(html, /role="alert"/)
  assert.match(html, /下载信息加载失败，请重试。/)
  assert.match(html, /<button[^>]*>重试<\/button>/)
})
