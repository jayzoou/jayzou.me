# 架构与维护入口

## 内容只有一份目录

`src/content/catalog.ts` 是分类、文章标题/摘要、显示顺序和发布状态的唯一来源。分类列表、栏目导航、文章页目录判断、静态 HTML 的 title/description/canonical、客户端导航后的页面信息，以及内容校验都读取它。正文仍在 `pages/`，文件路径仍决定 URL。

- `published`：必须有非空 MDX，生成可点击的列表项。
- `planned`：保留待写选题，显示“待发布”，没有 MDX 文件、链接或生成页面。
- `reserved`：只用于已有空白 URL 的兼容保留，必须有原因；不在列表出现，静态页面标记 noindex。当前只有执行上下文占位页。

新增文章只需添加 MDX 和相应分类的目录项。例如：

```ts
{ path: '/posts/js_core/new-topic', title: '新主题', description: '文章摘要', status: 'published' }
```

新增分类时，在目录中添加分类和文章，并创建 `Index.mdx`：导入通用 `CategoryPage`，传入该分类的 `id`。无需再添加专属列表组件、重复导航配置或修改 Layout 的路径判断。`navigation: false` 的分类不会出现在分类导航中，可在已有页面通过 `CategoryList` 展示；英文阅读沿用 `/posts/english/` 作为入口。

`check:content` 会检查元数据遗漏、状态/源文件矛盾、重复路径、分类首页缺失及静态 head 与目录不一致。`scripts/content-policy.mjs` 只是目录中 reserved 项的兼容导出，不单独维护例外。

## MDX、路由与静态生成

1. `vite.config.ts` 的 `virtual:pages` 插件在服务端输出 eager glob，在浏览器输出 lazy glob，两者使用同一组 `pages/**/*.mdx`。
2. `src/main.tsx` 在服务端同步创建完整路由，供 `vite-react-static` 逐页生成 HTML。
3. 浏览器先加载当前 URL 的页面模块，再启动 hydration；其他正文由 React Router 的 `lazy` 在导航时加载。
4. 浏览器入口先完成模块求值，再异步导入当前页面。不要改成对页面导入使用顶层 await：动态页面可能引用共享入口导出，形成无法完成求值的循环依赖。
5. `scripts/enrich-html.mjs` 仅补充静态 head，不修改 React 正文。

保留服务端/浏览器导入策略的分离，避免把 eager glob 放回浏览器。当前浏览器构建目标为 ES2022；Node 版本约定见 README。静态部署仍需支持目录 index.html 和无末尾斜杠 URL 的跳转；本地 preview 已模拟该行为。

## 代码块只有一条渲染路径

MDX 在构建/开发编译时运行 `@shikijs/rehype`，输出带 token 颜色的 HTML/React 节点。未知语言回退纯文本，未标语言的代码块和行内代码保持原样。Shiki 与插件精确使用 3.21.0，均为开发依赖；浏览器不加载高亮器、语言包、主题包或高亮 WASM。

MDX 编译通过 `providerImportSource` 使用 `MDXProvider`；其唯一的 `pre` 映射是 `CodeBlock`。这个组件仅渲染高亮节点和复制按钮，不进行 DOM 扫描、innerHTML 改写或异步高亮。复制保留代码缩进，仅去掉 fenced code 自带的最后一个换行。

`rehype-headings.ts` 在编译时生成稳定的标题 ID，保留显式 ID 并避开冲突。目录组件在页面挂载后读取标题一次，仅保留 IntersectionObserver，不观察整个 document，也不使用延时重扫。Mermaid 仅在相关文章挂载后导入和渲染，导航离开会取消尚未开始的渲染。

## 样式职责

`src/styles/index.css` 是唯一全局样式入口；UnoCSS 保留用于 MDX 中的局部工具类。

| 文件 | 职责 |
| --- | --- |
| `tokens.css` | 颜色、字体、间距、圆角、页面宽度 |
| `base.css` | 基础元素、焦点、无障碍辅助类、减少动画偏好 |
| `layout.css` | 页头、分类导航、内容容器、目录、列表和图片演示 |
| `prose.css` | 正文、表格、公式和内容组件 |
| `code.css` | 代码块滚动、复制按钮及触屏状态 |

响应式断点只在相应职责文件中维护：1024px 以下隐藏目录，640px 以下使用手机排版。不要重新引入重复的 App/index CSS、全局工具类覆盖或第二套代码块样式。

## 性能约束与验证

`check:performance` 读取 Vite manifest，计算共享入口及其静态依赖的 gzip 字节；当前页面是额外按需加载的资源，不计入共享入口数字。预算为共享 JS 150 KiB gzip、共享 CSS 20 KiB gzip、单个 MDX 页面 chunk 250 KiB gzip。预算不能通过调整警告阈值替代优化；如确需修改，需说明实际用户影响。

知识导出初始实测为 139.5 KiB gzip，单独限制为 160 KiB gzip（约 15% 增长空间），用于约束同步与服务端加载成本，不能解释为首页资源。浏览器不下载这份正文快照；Sandpack 与外部 bundler 的加载也独立于原共享入口预算。原共享 JS/CSS 与单页预算不变。

首页不再导入图片分类组件；其代码、资源与 ml5 依赖保留供后续使用。Mermaid 的大依赖只在相关文章或用户打开 AI 脑图后使用。

`npm run check` 包含类型、校验器测试、构建、内容/静态元数据校验、性能预算和浏览器冒烟。浏览器测试验证静态高亮、单页模块加载、不加载无关重依赖、复制、目录、AI 交互及桌面/手机排版。默认接口替身与真实后端联调分别运行，不将 Mock 视作真实模型验收。

## 独立 AI 后端与内容快照

同级 `jayzou-api` 是独立 Git/npm 项目。开发与预览代理 `/api` 到其 8787 端口，静态部署通过 `VITE_API_BASE_URL` 指定地址。公开简历与模型/通知配置属于后端，浏览器不保存服务端密钥。服务首期仅为 Hono + Zod + AI SDK 的 Mock 实现。

代理使用同源相对 URL，浏览器看到前端端口是预期行为；后端接收原始 Origin。development 允许精确回环主机的任意端口，production/test 只接受配置白名单。Vite HMR 使用实际监听端口，不固定为 5000，避免端口占用后出现 API 来源拒绝或热更新连接错误。

构建在静态生成与 head 补充完成后执行 `export-knowledge.mjs`，从 catalog 选择 published 文章，再用已有 parse5 提取 main 中的正文与实际 h1–h3 锚点，排除 AI 导读、导航、复制按钮和图表源码。生成的 `dist/ai/knowledge.json` 由后端导入，不手工维护文章元数据。内容版本由快照哈希确定。开发时内容变化需要重新构建、导入并重启 API，避免把旧快照误当成最新正文。

`src/lib/ai/contracts.ts` 由后端 `src/contracts.ts` 生成，契约版本为 1。两个仓库不跨目录导入源码。聊天使用 AI SDK UI Message Stream，按 parts 映射固定工具组件，校验结果后才能展示卡片。历史记录在 Effect 中读取并校验，恢复不会重新执行工具；停止或离开页面会取消请求。

文章静态正文保持现有 MDX 渲染，AI 导读按需加载。动态回复使用 react-markdown 的 AST 渲染，不启用原始 HTML 或客户端高亮器。脑图从校验后的章节树构造，使用独立容器和 strict 安全级别。代码面板先展示预设源码，点击运行后才加载 Sandpack；外部 bundler 的网络成本独立于本地 JS 预算。
