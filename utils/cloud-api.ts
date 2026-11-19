/**
 * Cloud API 官网调用统一身份头（与 bothub 主仓 `web/src/api/http.ts` 对齐）。
 *
 * `cloud-api` 在客户端最低兼容版本越过 1.0.155 后，会把完全不带身份头的 `client` 受众请求视为旧版客户端（426 `CLIENT_UPGRADE_REQUIRED`）；
 * 声明 `web` 平台后按非桌面/移动端放行，不受客户端版本号下限约束。
 */
export const CLOUD_API_WEB_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  'x-bothub-client-platform': 'web',
})
