---
group:
  title: 如何使用
  order: 0
order: 0
title: 安装使用
---

在开始之前，推荐先学习 [React](https://react.dev)，请确保项目已满足以下环境要求：

- [Node.js](https://nodejs.org/) v16 或以上
- [React](https://reactjs.org/) v18 或以上
- [Tailwind CSS](https://tailwindcss.com/) v4 或以上

如果需要从零开始构建项目，可以参考在 [Vite](/docs/use-with-vite)、[Next.js](/docs/use-with-vite)或[Umi](/docs/use-with-vite) 中使用指南。

---

## 引入

推荐使用 [pnpm](https://pnpm.io/zh/) 的方式进行开发。

<InstallDependencies npm='$ npm install metis-ui --save' yarn='$ yarn add metis-ui' pnpm='$ pnpm install metis-ui --save' bun='$ bun add metis-ui'></InstallDependencies>

## 配置

向你的入口 CSS 文件添加一个 `@plugin` 以导入 Metis UI。

```css tailwind.css {3-4}
@import 'tailwindcss';

@source "./node_modules/metis-ui/es";
@plugin './node_modules/metis-ui/es/plugin';
```
