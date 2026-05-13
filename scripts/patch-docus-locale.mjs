import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(rootDir, 'i18n/locales/zh.json')
const target = resolve(rootDir, 'node_modules/docus/i18n/locales/zh.json')

if (existsSync(source) && existsSync(resolve(rootDir, 'node_modules/docus'))) {
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(source, target)
}
