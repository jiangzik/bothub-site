# 官网静态路由部署

官网由 Nuxt/Nitro 生成静态文件，`autoSubfolderIndex: false`：页面为 `zh.html`、`zh/faq/macos-install.html`，同名目录只放 `_payload.json`。`@nuxtjs/i18n` 是语言前缀的唯一生成者，Docus 的可选 `:lang?` 在本地化之前移除；所有页面链接使用无尾斜杠路径。

## Nginx 配置归属

本仓库的 `nginx/site-routes.conf` 是静态页面路由的唯一配置源，安装到 `/etc/nginx/snippets/bothub-site-routes.conf`。官网 HTTPS server 块中仅引用：

```nginx
include /etc/nginx/snippets/bothub-site-routes.conf;
```

服务器继续管理 TLS、下载文件、云文件、API 代理和 `version.json`；它们不属于前端静态路由。不要另外保留首页、语言首页或 `location /` 规则。更新静态路由时，以管理员身份安装本仓库文件并校验后重载：

```sh
install -m 644 deployment/nginx/site-routes.conf /etc/nginx/snippets/bothub-site-routes.conf
nginx -t
systemctl reload nginx
```

普通页面发布只更新构建产物，无需改动 Nginx。静态路由配置变更须与源码一起发布，不能只在线上手改。

## 发布检查

CI 在同步前核对服务器安装的 Nginx 路由文件与当前提交完全一致；不一致时停止发布，按上方步骤安装正式配置后重试。CI 执行行为测试、严格预渲染（任何页面生成错误均终止构建），分别生成 GitHub Pages 和官网产物。官网同步后检查中英文首页、模型、状态、账号、充值及保留文档，最多允许一次规范化重定向；循环重定向、页面 404 或其他错误会直接令部署失败。仅作内容分组的 `/zh/api`、`/en/api` 必须返回 404 且不发生目录重定向，避免 payload 目录被当作页面。

## Google 登录

官网使用 Google Identity Services 官方按钮，将 ID Token 与本页随机 nonce 交给现有 `POST /v1/auth/google/login`，由 cloud-api 的 Google 校验与身份服务签发同一套账号会话。官网不交换授权码、不持有 Client Secret，也不使用 Electron 的本地回调。

`nuxt.config.ts` 的公开 `googleClientId` 与 Electron 默认值、生产 cloud-api 的 `GOOGLE_CLIENT_ID` 一致。需要变更时，静态构建可用 `NUXT_PUBLIC_GOOGLE_CLIENT_ID` 覆盖，必须与 API 接受的客户端一致。

在 [Google Auth Platform 客户端](https://console.cloud.google.com/auth/clients) 中选择这个 ID，确认类型为 **Web application**，在 **Authorized JavaScript origins** 中添加以下两项（无路径、无尾斜杠）：

- `https://bothub.bookab.info`
- `https://jiangzik.github.io`

第二项不能填 `/bothub-site/zh`。官网采用 JavaScript 回调，不新增 Authorized redirect URI；保留 Electron 已配置的本地回调 URI。若当前客户端类型是 Desktop app，则不能用于 GIS 网页按钮，必须创建 Web application 客户端并同步设计服务端 audience 配置，不能直接覆盖 Electron 的客户端配置。

本地 Google 登录验证可添加 `http://localhost` 与 `http://localhost:8090`。API CORS 必须允许官网两个来源；不同来源的浏览器会话独立，但账号、余额和 API Key 仍由同一后端管理。
