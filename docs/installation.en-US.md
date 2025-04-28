---
group:
  title: Getting Started
  order: 0
order: 0
title: Installation
---

Before getting started, it is recommended to learn [React](https://react.dev). Please ensure your project meets the following requirements:

- [Node.js](https://nodejs.org/) v16 or above
- [React](https://reactjs.org/) v18 or above
- [Tailwind CSS](https://tailwindcss.com/) v4 or above

If you need to build a project from scratch, you can refer to the usage guides for [Vite](/docs/use-with-vite), [Next.js](/docs/use-with-vite), or [Umi](/docs/use-with-vite).

---

## Installation

It is recommended to use [pnpm](https://pnpm.io/) for development.

<InstallDependencies npm='$ npm install metis-ui --save' yarn='$ yarn add metis-ui' pnpm='$ pnpm install metis-ui --save' bun='$ bun add metis-ui'></InstallDependencies>

## Configuration

Add a `@plugin` to your entry CSS file to import Metis UI.

```css {3-4}
@import 'tailwindcss';

@source './node_modules/metis-ui/es'; /* This must use a relative path and should be adjusted based on the actual entry CSS file path */
@plugin 'metis-ui/plugin';
```

> Translate by ChartGPT
