# 项目开发指南

## 开始工作

- 先阅读 `README.md`、`package.json` 和目标文件，再修改代码。通用安装与命令以 README 为准；Replit 差异见 `replit.md`。
- 使用 `.nvmrc` 指定的 Node 版本和 npm 10；安装使用 `npm ci`，维护唯一的 `package-lock.json`。
- 查看 Git 工作区，保留用户已有的改动。保持任务范围明确，避免无关的目录重命名、文章改写和依赖升级。

## 代码与内容边界

- `pages/` 放 MDX 内容与文章资源，`src/component/` 放 React 组件，`src/lib/` 放共享逻辑，`src/types/` 放必要的补充类型。
- 保留现有 URL、`Index.mdx` 大小写和文章语义。新增文章检查分类列表；新增分类检查导航与 `Layout.tsx` 的首页判断。
- 组件会在 Node.js 中静态渲染。模块顶层及初次渲染不能依赖 `window`、`document`、`navigator` 或模型加载；浏览器操作放在 Effect 或事件中，并清理订阅与定时器。
- 保持 TypeScript strict 与现有 ESLint 规则；避免显式 `any`、`@ts-ignore`、空壳模块声明或关闭规则。第三方类型补充须对应实际安装版本的 API。
- Effect 必须声明真实依赖；异步 Effect 应处理卸载。不要只修改依赖数组而忽略重复执行的行为。
- 代码高亮通过 `src/lib/highlight.ts` 调用已安装的 Shiki API。当前 React 高亮与 DOM 扫描两条路径仍共存，修改时检查两条路径及复制功能。
- 沿用现有 UnoCSS、文章排版和响应式样式。全局规则放在 `src/index.css` / `src/App.css`，局部修改优先限定作用范围。
- 依赖变更需说明原因并更新锁文件；优先使用直接声明的依赖，避免引用未声明的传递依赖。
- 不手工修改或提交 `dist/`、`node_modules/`、临时构建目录。不要在仓库中保存密钥。

## 验证与完成标准

- 提交交付结果前运行 `npm run check`：环境检查通过，lint 必须零错误、零警告，typecheck、校验器测试、静态构建、内容校验与桌面/手机冒烟必须成功。未执行或失败的检查要说明原因，不能描述为已通过。
- 只运行 `build` 不能代替类型检查；当前 typecheck 不覆盖 MDX 正文的类型。
- 修改路由、MDX、渲染插件时，检查 `dist/` 中受影响路由的 HTML 和正文。需要浏览器行为的修改，启动预览并检查受影响页面。
- 界面修改检查桌面与手机宽度；涉及导航、目录、代码块、公式、Mermaid、图片分类时，验收对应行为，并关注浏览器错误及 hydration 问题。
- 测试应验证用户行为或易出错的逻辑；不要为简单文案修改编写镜像实现的测试。内容校验器的失败场景用 Node test runner 验证，关键页面使用 Playwright；本地和 GitHub Actions 都执行 `npm run check`。
- `check:content` 与 `test:e2e` 单独运行前先构建。Playwright 自动管理 4173 端口的生产预览，初次运行需安装 Chromium；本机 Chrome 可通过 `PLAYWRIGHT_CHANNEL=chrome` 使用。
- 对新增文章补齐列表入口；无正文选题用 `draft: true`，不要发布空链接。历史空白页例外仅见 `scripts/content-policy.mjs`，发布后删除例外。
- 冒烟使用模型替身，不能声称已验证真实推理。失败时查看 `playwright-report/`、`test-results/` 的截图、trace 和浏览器错误附件，不要直接更新断言掩盖失败。
- CI 文件变更需说明本地验证与远程实际运行的区别，不能把本地通过描述为 GitHub Actions 已通过。
- 若启动了临时服务，完成后停止本次启动的进程。
- 交付说明列出修改内容、验证命令和结果、未验证项及已知限制。命令、架构或环境约定改变时同步更新文档。
