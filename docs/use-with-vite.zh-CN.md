---
group:
  title: 如何使用
order: 1
title: 在 Vite 中使用
---

[Vite](https://cn.vitejs.dev/) 是业界最优秀的 React 应用开发工具之一，本文会尝试在 Vite 创建的工程中使用 `metis-ui` 组件，并自定义 Vite 的配置以满足各类工程化需求。

## 安装和初始化

在开始之前，你可能需要安装 [yarn](https://github.com/yarnpkg/yarn/) 或者 [pnpm](https://pnpm.io/zh/) 或者 [bun](https://bun.sh/)。

<InstallDependencies npm='$ npm create vite metis-ui-demo -- --template react-ts' yarn='$ yarn create vite metis-ui-demo --template react-ts' pnpm='$ pnpm create vite metis-ui-demo --template react-ts' bun='$ bun create vite metis-ui-demo --template react-ts'></InstallDependencies>

工具会自动初始化一个脚手架并安装 React 项目的各种必要依赖，如果在过程中出现网络问题，请尝试配置代理，或使用其他 npm registry。

然后我们进入项目安装依赖并启动。

```bash
$ cd metis-ui-demo
$ npm install
$ npm run dev
```

此时使用浏览器访问 http://localhost:5173/ ，看到 `Vite + React` 的界面就算成功了。

## 引入 metis-ui

安装 `metis-ui`、`tailwindcss` 和 `@tailwindcss/vite`。

<InstallDependencies npm='$ npm install metis-ui tailwindcss @tailwindcss/vite --save' yarn='$ yarn add metis-ui tailwindcss @tailwindcss/vite' pnpm='$ pnpm install metis-ui tailwindcss @tailwindcss/vite --save' bun='$ bun add metis-ui tailwindcss @tailwindcss/vite'></InstallDependencies>

vite 配置中添加 `@tailwindcss/vite` 插件。

<!-- prettier-ignore -->
```ts vite.config.ts {3,9}
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
});
```

根目录下新建 `tailwind.css`。

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
```

修改`index.html`，引入tailwindcss。

```html index.html {7}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/tailwind.css" rel="stylesheet" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

修改 `src/App.ts`，引入 metis-ui 的按钮组件。

```tsx
import { Alert } from 'metis-ui';

const App = () => (
  <div className="h-screen w-screen">
    <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
  </div>
);

export default App;
```

好了，现在你应该能看到页面上已经有了 `metis-ui` 的 `Alert` 组件，接下来就可以继续选用其他组件开发应用了。其他开发流程你可以参考 Vite 的[官方文档](https://cn.vitejs.dev/)。

我们现在已经把 metis-ui 组件成功运行起来了，开始开发你的应用吧！
