---
group:
  title: Metis Plus
  order: 2
order: 2
title: 目录结构
---

本项目基于 [Vite](https://vitejs.dev/) 作为前端构建工具，采用了现代化的开发流程和高效的模块热更新机制。我们对目录结构进行了详细的功能划分，遵循“约定优于配置”的原则，便于团队协作和项目维护。

各目录和文件的职责如下：

- **public**：存放无需构建即可直接访问的静态资源，如 favicon、全局图片等。
- **src**：核心源码目录，按照功能模块细分，提升可读性和可维护性。
  - **apis**：统一管理所有后端接口请求，便于接口复用和维护。
  - **assets**：集中存放图片、SVG 等静态资源，方便统一管理和引用。
  - **components**：封装通用 UI 组件，实现高复用性和低耦合。
  - **hooks**：自定义 React Hooks，抽离通用逻辑，提升代码复用率。
  - **layouts**：页面布局相关组件，支持多种页面结构切换。
  - **locale**：国际化资源文件，支持多语言切换。
  - **mocks**：本地 mock 数据和服务，便于开发和测试。
  - **pages**：页面级组件，按路由划分，结构清晰。
  - **store**：基于 Zustand 的全局状态管理，简洁高效。
  - **types**：TypeScript 类型定义，提升类型安全和开发体验。
  - **utils**：通用工具函数和工具类，便于全局调用。
  - 其他入口文件和配置文件，确保项目结构清晰、职责明确。

通过这样的目录约定，能够快速定位和管理项目中的各类资源和代码，降低维护成本，提升开发效率。适合中大型团队协作开发，也便于后续功能扩展和技术升级。

## 目录

```
├── .husky                     # Husky 钩子配置目录
├── public                     # 公共静态资源目录
├── src                        # 源码目录
│   ├── apis                   # 服务端接口请求相关
│   ├── assets                 # 静态资源（图片、SVG等）
│   ├── components             # 通用组件
│   ├── hooks                  # 自定义 hooks
│   ├── layouts                # 页面布局组件
│   ├── locale                 # 国际化资源
│   ├── mocks                  # Mock 数据与服务
│   ├── pages                  # 页面组件
│   ├── store                  # Zustand 状态管理
│   ├── types                  # TypeScript 类型定义
│   ├── utils                  # 工具函数与工具类
│   ├── loading.tsx            # 全局 Loading 组件
│   ├── main.tsx               # 应用入口文件
│   ├── routes.tsx             # 路由和菜单配置
│   └── vite-env.d.ts          # Vite 环境类型声明
├── .env                       # 环境变量配置文件
├── .lintstagedrc              # lint-staged 配置文件
├── .prettierignore            # Prettier 忽略文件配置
├── .prettierrc                # Prettier 代码格式化配置
├── commitlint.config.js       # 提交规范校验配置
├── eslint.config.js           # ESLint 代码规范配置
├── index.html                 # 项目入口 HTML
├── package.json               # 项目依赖与脚本配置
├── tailwind.css               # TailwindCSS 全局样式入口
├── tsconfig.app.json          # TS 应用配置
├── tsconfig.json              # TS 根配置
├── tsconfig.node.json         # TS Node 配
```
