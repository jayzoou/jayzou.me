# Replit 平台说明

项目目标、结构、安装、开发命令和交付检查统一见 [README.md](./README.md)，AI 开发约束见 [AGENTS.md](./AGENTS.md)。

- `.replit` 使用 `nodejs-22` 模块；实际运行环境须满足 `package.json` 的 Node/npm 版本要求。
- Run 工作流执行 `npm run dev`，等待本地端口 5000，并映射到外部端口 80。
- `vite.config.ts` 保留 `0.0.0.0:5000` 和 HMR 的 ws/clientPort 配置，以兼容代理环境。
- 静态部署执行 `npm run build`，输出目录为 `dist/`。部署前另行运行 `npm run check` 完成 lint 和类型检查。
- 本地验证不能证明 Replit 平台环境或代理可用；在该平台重新部署时，检查运行时版本、HMR 和深层 URL 访问。
