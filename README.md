# Jay Zou

个人网站 [jayzou.me](https://jayzou.me)，用于发布前端、算法、英语等学习笔记和交互演示。文章使用 MDX，通过 React 与 `vite-react-static` 生成静态 HTML。

## 环境与启动

- Node.js：22.22.2，记录在 `.nvmrc`；支持同一主版本内不低于该版本的更新。
- npm：10.9.7 为验证基线，支持不低于该版本的 npm 10；统一使用 npm 与 `package-lock.json`。
- `.npmrc` 保持 lockfile v2；安装前置脚本与 `check:env` 检查项目环境。
- ml5 元数据声明 yarn/Node 20，因此不全局启用 `engine-strict`。安装时可能出现其 engine/peer dependency 警告，本站使用其浏览器 API。
- 首页为数字助手，调用同级独立仓库 `jayzou-api` 提供的 Mock SSE 接口。Vite 默认代理 `/api` 到 `http://127.0.0.1:8787`，配置示例见 `.env.example`。
- 原图片分类组件、模型适配器和资源保留在源码中，首页不再导入或展示。

```sh
nvm install
nvm use
npm ci
npm run dev
```

未使用 nvm 时，安装上述版本后从 `npm ci` 开始。开发端口首选 5000，占用时 Vite 自动选择可用端口（例如 5002），以终端打印的 Local 地址为准。当前监听 `0.0.0.0`，HMR 跟随实际端口，保留 Replit 兼容性。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run check:env` | 检查 Node/npm 版本 |
| `npm run dev` | 启动开发服务器 |
| `npm run lint` | 检查代码，warning 也使检查失败 |
| `npm run typecheck` | 检查源码、构建/测试配置与浏览器测试 |
| `npm run test:checks` | 验证内容目录、标题 ID 与内容校验器 |
| `npm run build` | 按路由构建、静态生成、应用页面元数据 |
| `npm run check:content` | 检查目录、HTML、链接、资源、锚点与元数据 |
| `npm run check:performance` | 检查共享 JS/CSS 与单页 gzip 预算 |
| `npm run test:e2e` | 对已构建的站点运行桌面/手机冒烟 |
| `npm run test:e2e:report` | 查看最近的 Playwright HTML 报告 |
| `npm run check` | 环境 → lint → 类型 → 校验器测试 → 构建 → 内容 → 性能 → 冒烟 |
| `npm run preview` | 在端口 5000 预览 `dist/` |

首次运行冒烟需 `npx playwright install chromium`；Linux CI 使用 `npx playwright install --with-deps chromium`。本机已有 Chrome 时可用 `PLAYWRIGHT_CHANNEL=chrome npm run check`，无需另行下载 Chromium。

测试自动管理 `127.0.0.1:4173` 的生产预览，不复用已有服务。单独运行内容、性能或浏览器检查前先执行 `npm run build`。`build` 不执行类型检查；MDX 的编译与内容校验也不能替代正文类型检查。

## 技术栈与目录

React 19、TypeScript strict、Vite 6、React Router 7、MDX、UnoCSS。文章支持 GFM、KaTeX、Mermaid 和编译期 Shiki 高亮；AI 交互使用 Vercel AI SDK、Zod 与 react-markdown，代码 Demo 按需加载 Sandpack。浏览器构建目标为 ES2022。React 与 React DOM 统一固定为 19.1.2，以满足 AI SDK React 适配器的 peer 要求，避免版本不匹配；Shiki 版本保持不变。

```text
pages/                     MDX 正文与文章资源，路径决定 URL
src/content/catalog.ts     分类、文章顺序、发布状态与页面元数据
src/main.tsx               按环境加载页面并启动路由/静态生成
src/component/             布局、通用分类列表与交互组件
src/component/Things/      交互演示
src/lib/                   共享逻辑、路由映射与派生导航
src/styles/                tokens、基础、布局、正文与代码块样式
src/types/                 必要的第三方和虚拟模块类型
scripts/                   标题插件、静态元数据、内容与性能校验
src/component/chat/        首页对话、工具卡片和模拟联系表单
src/component/ai/          文章导读与受控脑图
src/component/artifact/    按需加载的代码面板与 Sandpack
src/lib/ai/                API 客户端及从后端生成的接口契约
vite.config.ts             页面模块策略、MDX 编译、服务与构建配置
tests/e2e/                 浏览器冒烟与图片模型替身
.github/workflows/check.yml  PR、main 推送与手动触发的 CI
docs/architecture.md       架构、维护入口及性能约束
AGENTS.md                  AI 开发约束与交付要求
dist/                      构建产物，不提交、不手工修改
```

服务端 eager 导入页面生成 HTML；浏览器先加载当前页面再 hydration，其余文章按导航加载。高亮和标题 ID 在编译期生成，浏览器仅负责复制与目录交互。详细流程见 [架构说明](./docs/architecture.md)。

## 新增或修改内容

- `pages/Index.mdx` 对应 `/`；分类 `Index.mdx` 对应目录 URL；普通文章保留现有 URL，静态主机可将其重定向到末尾带 `/` 的目录。
- 新增文章时，在 `src/content/catalog.ts` 对应分类添加 path、title、description 和 status。列表、导航、目录判断与页面信息自动读取目录，不再单独维护分类数组。
- `published` 必须有非空 MDX；`planned` 保留待写选题，不创建正文或链接；`reserved` 仅保留已有空白 URL，需注明原因且标记 noindex。
- 新增分类时，登记目录并创建使用通用 `CategoryPage` 的 `Index.mdx`。完整示例见架构说明。
- 图片放在所属分类的 `assets/` 中，用相对路径引用。代码块注明语言，数学公式使用现有 MDX 语法。
- 文章文件、目录状态不一致或遗漏元数据会导致校验失败。重命名文章必须检查所有引用。

## 验证范围与边界

内容检查覆盖目录/源文件一致性、重复路由、每个 MDX 的产物、非空正文、重复 ID、内部链接、本地资源、静态锚点、文章入口，以及 title/description/canonical/robots。资源导入与 MDX 语法由构建校验。不访问外站；CSS 内资源与客户端动态生成的链接不在 HTML 校验范围内。

执行上下文是唯一的历史空白占位页，在统一目录中记录 `reserved` 与原因；`scripts/content-policy.mjs` 只是派生导出。写入正文后需要改为 published，不要另建例外名单。

性能检查计算共享入口及静态依赖的 gzip 字节，预算为 JS 150 KiB、CSS 20 KiB、单个 MDX chunk 250 KiB。当前页面的按需 chunk 不计入共享入口，因此该数字不等同于首屏总传输量或加载耗时。模型、Mermaid 和大型文章仍可能触发大 chunk 提示，其成本由使用时承担。

AI 知识快照完整正文首次实测为 139.5 KiB gzip，因此单独设置 160 KiB gzip 的初始预算，约保留 15% 增长空间；该快照只用于后端导入，不增加浏览器首屏传输，原有共享 JS/CSS 与单页预算保持不变。内容检查同时核对其文章集合、元数据、内容版本和章节引用。沙盒按需 chunk 及外部编译资源需另外测量，不能用共享入口预算代替。

浏览器测试覆盖导航、深层 URL 刷新、静态高亮与复制、目录、公式、Mermaid、手机布局及按需资源加载，并检查简历卡片、恢复/新对话、文章来源、模拟联系、导读和 Demo 面板。默认使用接口契约替身；`E2E_REAL_API=1` 时直接连接独立后端。原图片识别不再有首页交互入口，未验证真实推理。截图/trace 位于 `test-results/`，HTML 报告位于 `playwright-report/`，均不提交。

## 前后端联调

先在本仓库运行 `npm run build`，生成静态站点和 `dist/ai/knowledge.json`。知识文件只包含已发布文章，从统一目录和静态正文生成，不会把其他文章 React 模块导入首页。

在同级后端仓库运行：

```sh
cd ../jayzou-api
npm ci
npm run build
npm run import:knowledge -- ../jayzou.me/dist/ai/knowledge.json
npm run dev
```

另一个终端在本仓库运行 `npm run dev`。正文更新后重新构建、导入并重启后端。公开简历维护在后端 `data/profile.json`；初始工作、教育与技能经历为空，页面明确显示尚未配置。

默认使用同源代理，因此浏览器 Network 显示的是前端端口 `/api/chat`（例如 `http://localhost:5002/api/chat`），实际由 Vite 转发到 8787。后端 development 模式允许本机回环地址使用不同端口；production/test 仍仅接受精确来源白名单。不要仅根据浏览器显示前端 URL 判断代理未生效。可在响应中检查 `X-Request-Id`、SSE Content-Type 或 `ORIGIN_DENIED` 错误。

后端启动后，可以运行 `E2E_REAL_API=1 PLAYWRIGHT_CHANNEL=chrome npm run check` 进行实际 HTTP 联调检查。Playwright 自动管理前端预览，后端由启动它的终端管理。纯静态部署须设置 `VITE_API_BASE_URL` 为后端地址，并在后端允许该站点来源。

当前回复、导读和工具选择均为 Mock；正文检索实际读取文章，Demo 使用预设源码，联系表单不发送通知。Sandpack 编辑器仅在点击运行后下载，依赖外部编译资源，其真实编译需要可访问相关网络。流式 AI 代码使用纯文本和复制，静态文章保留编译期高亮。

GitHub Actions 在 PR、main 推送及手动触发时执行同一 `npm run check`，保存诊断产物 7 天。工作流变更须推送后才会在远程运行；将检查设为合并必需项需配置仓库规则。

## 开发与部署

开发前阅读 [AGENTS.md](./AGENTS.md)。保持文章原意与现有 URL；沿用 `src/styles/` 的职责和设计变量，不通过关闭规则、忽略类型或新增 any 掩盖问题。

```sh
npm run check
npm run preview
```

部署 `dist/` 到静态托管服务，当前资源基路径为 `/`。主机须支持目录 index.html 与无末尾斜杠 URL 跳转；本地 preview 已模拟跳转，避免 Vite 的 SPA 回退返回首页。Replit 平台差异见 [replit.md](./replit.md)。

自动化之外，真实模型、未覆盖页面的视觉效果及 Chromium 以外浏览器仍需另外验收。

## License

[MIT](./LICENSE)
