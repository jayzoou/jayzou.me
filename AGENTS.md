# 项目开发指南

## 开始工作

- 先阅读 README、`docs/architecture.md`、package.json 与目标文件，再修改代码。
- 使用 `.nvmrc` 指定的 Node 与 npm 10；安装用 `npm ci`，只维护 package-lock.json。
- 查看工作区并保留用户已有改动。避免无关重命名、文章改写和依赖升级。

## 内容与代码边界

- `pages/` 放正文与文章资源，`src/component/` 放 React 组件，`src/lib/` 放共享逻辑，`src/types/` 放必要类型。
- 分类与文章元数据只维护在 `src/content/catalog.ts`。列表、导航、目录判断、页面元数据和占位策略从它派生，不重复维护数组。
- 保留现有 URL、Index.mdx 大小写和文章语义。新分类使用通用 CategoryPage，新文章添加正文与目录项。
- 状态为 published/planned/reserved：planned 无正文文件，reserved 仅用于已有空白 URL 且必须有原因，发布后改为 published。
- 组件会在 Node.js 中静态渲染。模块顶层和初次渲染不访问浏览器 API；浏览器操作放在 Effect/事件中并清理异步任务、订阅和定时器。
- 浏览器只按需加载当前页面，其他正文交给路由 lazy。不要在浏览器入口用顶层 await 等待页面导入，避免共享模块的异步循环依赖；服务端/客户端模块策略见架构说明。
- 高亮由编译期 Shiki rehype 插件生成，CodeBlock 仅渲染与复制。不得重新加入客户端高亮器、延时扫描或 innerHTML 改写。复制需保留缩进；行内代码不生成复制按钮。
- 全局样式入口为 `src/styles/index.css`，按 tokens/base/layout/prose/code 分工；UnoCSS 用于局部工具类，避免重复断点及全局工具类覆盖。
- 保持 TypeScript strict 与 ESLint 规则，不通过 any、ts-ignore、空壳声明或关闭规则绕过错误。补充类型须对应实际版本 API。
- Effect 声明真实依赖，异步操作处理卸载与路由切换；不要只修依赖数组而忽略行为。
- 依赖变化说明原因并更新锁文件，避免引用未声明的传递依赖。Shiki 与其 rehype 插件保持同一精确版本。
- 不手工修改或提交 dist、node_modules、临时构建目录和测试报告；仓库不保存密钥。

## 验证与完成标准

- 交付前运行 `npm run check`：环境、零警告 lint、类型、校验器测试、构建、内容、性能预算、桌面/手机冒烟均需通过。
- 单独运行内容、性能或 E2E 检查前先构建，避免读到旧产物。build 不能替代类型检查，MDX 正文尚无独立类型检查。
- 核对受影响路由的静态正文及 head 元数据；页面交互在生产预览中验证，关注 hydration、控制台和资源错误。
- 界面改动检查桌面/手机，按功能验证导航、目录、高亮/复制、公式、Mermaid、图片分类。不要仅以 SSR 文本可见判定客户端正常。
- 内容与预算脚本的测试验证真实失败场景，浏览器测试验证用户行为，不编写镜像实现的测试。
- 初次冒烟安装 Chromium；已有 Chrome 时使用 `PLAYWRIGHT_CHANNEL=chrome`。Playwright 自动管理 4173 端口预览，测试后停止本次启动的其他服务。
- 图片模型使用替身，不声称已验证真实推理。失败时查看报告、截图、trace 与错误附件，不用降低断言或扩大预算掩盖问题。
- 性能预算计算共享资源与单页 chunk，不能当作首屏耗时。修改预算须说明实际用户影响，不能只调大 Vite 警告阈值。
- 区分本地验证与远程 CI 状态。交付说明列出改动、检查结果、未验证项与限制；命令、架构、环境变化同步更新文档。
