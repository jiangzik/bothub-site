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

## 账号功能

登录、注册、充值与 API Key 管理都在 BotHub Web（`https://bothub-app.bookab.info`，源码在 bothub 主仓库 `web/`）里只实现一份；官网不持有账号会话。`/zh/pay`、`/en/pay` 跳到 Web 的 `/pay`，`/zh/account`、`/en/account` 跳到 `/keys`，页头只放「充值」「网页版」入口。地址由 `nuxt.config.ts` 的 `runtimeConfig.public.webAppUrl` 决定，可用 `NUXT_PUBLIC_WEB_APP_URL` 覆盖。

FAQ 里的「账号删除说明」页保留网页自助删号表单（邮箱 + 验证码，不需要登录），页面地址不变。
