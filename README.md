# Jay Zou

个人网站 [jayzou.me](https://jayzou.me)，用于发布前端、算法、英语等学习笔记和交互演示。文章使用 MDX 编写，通过 React 与 `vite-react-static` 生成静态 HTML。

## 环境与启动

- Node.js：22.22.2，版本记录在 `.nvmrc`；支持同一主版本内不低于该版本的更新。
- npm：10.9.7 为验证基线，支持不低于该版本的 npm 10；统一使用 npm 和 `package-lock.json`。
- `.npmrc` 保持现有 lockfile v2 格式。安装前置脚本及 `check:env` 检查项目运行时版本。
- ml5 的包元数据要求 yarn/Node 20，与本站的 npm 环境约定不同，因此不全局启用 `engine-strict`；安装时可能出现其 engine/peer dependency 警告。本站只使用浏览器端的图片分类 API。
- 常规开发和构建无需配置环境变量。图片分类演示需要浏览器联网下载模型。

```sh
nvm install
nvm use
npm ci
npx playwright install chromium
npm run dev
```

未使用 nvm 时，安装上述 Node/npm 版本后从 `npm ci` 开始。开发地址为 `http://localhost:5000`。当前 Vite 监听 `0.0.0.0`，HMR 使用端口 5000；这些设置保留了 Replit 兼容性。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run check:env` | 检查本项目要求的 Node/npm 版本 |
| `npm run dev` | 启动开发服务器 |
| `npm run lint` | 检查代码，任何 warning 都会使检查失败 |
| `npm run typecheck` | 检查应用和 Vite 配置的 TypeScript 类型 |
| `npm run build` | 构建客户端资源并为 MDX 路由生成静态 HTML |
| `npm run test:checks` | 运行内容校验器的正向与失败场景测试 |
| `npm run check:content` | 校验已构建的页面、内部链接、资源、锚点和文章入口 |
| `npm run test:e2e` | 对已有 `dist/` 运行桌面/移动端 Chromium 冒烟 |
| `npm run test:e2e:report` | 打开最近一次 Playwright HTML 报告 |
| `npm run check` | 环境 → lint → 类型 → 校验器测试 → 构建 → 内容校验 → 冒烟 |
| `npm run preview` | 在端口 5000 预览已生成的 `dist/` |

`build` 本身不执行类型检查，交付前请运行 `check`。类型检查覆盖 `src/`、Vite/Playwright 配置与浏览器测试；MDX 由构建编译，尚无 MDX 正文的类型检查。

Playwright 首次运行需安装 Chromium；Linux CI 使用 `npx playwright install --with-deps chromium`。本机已安装 Chrome 时，可用 `PLAYWRIGHT_CHANNEL=chrome npm run check`，无需另外下载 Chromium。测试自动启动并关闭 `127.0.0.1:4173` 的生产预览，端口已占用时直接失败，不复用其他服务。单独运行 `check:content` 或 `test:e2e` 前先运行 `npm run build`，避免检查旧产物。

## 技术栈与目录

React 19、TypeScript strict、Vite 6、React Router 7、MDX、UnoCSS。文章支持 GFM、KaTeX、Mermaid 和 Shiki 代码高亮；动画使用 Motion，图片分类演示使用 ml5。

```text
pages/                   MDX 页面、文章与文章资源
src/main.tsx             收集 MDX，映射路由，配置静态生成入口
src/component/           布局、导航、目录和交互组件
src/component/posts/     各分类的文章列表
src/component/Things/    交互演示
src/lib/                 共享逻辑、路由映射与导航配置
src/types/               第三方 API 和原生 MathML 的补充类型
src/index.css            全局与响应式样式
src/App.css              布局与文章排版样式
vite.config.ts           MDX 插件、服务端口及静态生成配置
uno.config.ts            UnoCSS 配置
.replit                  Replit 启动与静态部署配置
scripts/                 环境与内容校验、校验器测试
scripts/content-policy.mjs  有原因说明的历史空白页面例外
tests/e2e/               关键页面浏览器冒烟与模型测试替身
playwright.config.ts     桌面/手机测试项目、预览与失败产物
.github/workflows/check.yml  PR、main 推送与手动触发的 CI
AGENTS.md                AI 开发约束与交付要求
dist/                    构建产物，不提交、不手工修改
```

`src/main.tsx` 使用 eager glob 导入 `pages/**/*.mdx`，页面嵌套在 `Layout` 下。构建时组件会在 Node.js 中渲染，浏览器加载后再进行 hydration；依赖 DOM、剪贴板或模型加载的逻辑应放在 Effect 或事件处理器里。

## 新增或修改内容

- `pages/Index.mdx` 对应 `/`；`pages/posts/js_core/Index.mdx` 对应 `/posts/js_core/`；`pages/posts/js_core/closure.mdx` 对应 `/posts/js_core/closure`。
- `Index.mdx` 的大小写有意义。保持现有 URL 与文件命名，重命名文章需检查所有引用。
- 新增文章后，更新 `src/component/posts/` 中相应分类列表；新增分类还需更新 `src/lib/navLinks.ts` 和 `Layout.tsx` 的分类首页判断。尚无正文的选题在列表设置 `draft: true`，显示“待发布”，不生成链接。发布正文时移除该标记。
- 文章资源放在所属分类的 `assets/` 下，用相对路径引用。MDX 中可导入 React 组件；文章代码块应注明语言，数学公式使用现有 MDX 数学语法。
- 内容、路由、导航和目录判断目前分别维护，尚未自动生成统一元数据。

## 自动化验证范围

内容校验读取构建后的 HTML，用应用共享的路由映射检查：路由冲突、每个 MDX 的产物、非空正文、重复 ID、内部页面链接、本地资源、静态锚点，以及文章是否有其他页面链接到它。页面内资源导入与 MDX 语法错误由构建捕获。校验不访问外站，也不验证外部 URL 的可用性；CSS 内部资源和客户端动态生成的链接不在 HTML 校验范围内。

`pages/posts/js_core/execution_context.mdx` 是历史空白占位，保留已有 URL，在 `scripts/content-policy.mjs` 中逐项注明原因。只有此项允许无正文且不出现在列表；写入正文后校验会要求删除例外。不要通过扩大例外名单绕过新文章的问题。

Playwright 在桌面和手机尺寸分别验证：首页与图片上传、主导航、分类到文章、深层 URL 刷新、代码高亮与复制、目录显示与跳转、KaTeX、语法表格横向布局和 Mermaid。测试先等待根节点的客户端初始化标记；页面异常、console error、站内 HTTP 错误会令测试失败。图片分类适配模块用固定 ESM 测试替身替换，仍覆盖 UI 初始化和上传，但不验证真实 ml5 模型、网络下载或推理结果。截图保存于 `test-results/`，失败保留 trace；HTML 报告位于 `playwright-report/`，均不提交。

GitHub Actions 在 PR、推送到 `main` 及手动触发时安装锁定依赖与 Chromium，然后执行同一个 `npm run check`。工作流使用只读仓库权限，重复运行会取消旧任务，并保存 Playwright 诊断产物 7 天。工作流需提交推送后才会在远程实际运行；将检查设为合并必需项还需在仓库规则中配置。

## 开发约定

开发前阅读 [AGENTS.md](./AGENTS.md)。保留文章原意、现有 URL 和界面行为；为实际问题作局部修改。TypeScript 和 ESLint 规则应保持开启，不通过增加 `any`、忽略指令或关闭规则掩盖错误。补充类型应只描述已核实、实际使用的 API。

## 构建与部署

```sh
npm run check
npm run preview
```

部署 `dist/` 到静态托管服务；当前资源基路径为 `/`。本地预览会把已生成目录的无末尾斜杠 URL 重定向到目录 URL，避免 Vite 的 SPA 回退返回首页。托管服务应把目录请求映射到对应的 `index.html`，并验证文章 URL 的直接访问和刷新。Replit 使用 `.replit` 中的构建与输出目录配置；通用项目说明以本文件为准，`replit.md` 仅记录平台差异。

涉及页面或交互的修改，至少手动检查首页、一个分类页和受影响文章页；验证深层链接刷新、目录跳转、代码高亮/复制，并在手机宽度检查表格和长代码是否溢出。修改数学、Mermaid 或图片分类时，额外验证对应功能。真实模型推理、未覆盖页面的视觉效果以及 Chromium 之外的浏览器兼容性仍需另外验收。

已知构建会提示部分 JavaScript chunk 较大，包体积优化尚未纳入本批工作。

## License

[MIT](./LICENSE)
