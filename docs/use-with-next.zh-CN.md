---
group:
  title: 如何使用
order: 2
title: 在 Next.js 中使用
---

[Next.js](https://nextjs.org/) 是目前世界上最流行的 React 服务端同构框架，本文会尝试在 Next.js 创建的工程中使用 `metis-ui` 组件。

## 安装和初始化

在开始之前，你可能需要安装 [yarn](https://github.com/yarnpkg/yarn/) 或者 [pnpm](https://pnpm.io/zh/) 或者 [bun](https://bun.sh/)。

<InstallDependencies npm='$ npx create-next-app metis-ui-demo' yarn='$ yarn create next-app metis-ui-demo' pnpm='$ pnpm create next-app metis-ui-demo' bun='$ bun create next-app metis-ui-demo'></InstallDependencies>

工具会自动初始化一个脚手架并安装项目的各种必要依赖，在安装过程中，有一些配置项需要自行选择，其中`Tailwind CSS`选择开启，如果在过程中出现网络问题，请尝试配置代理，或使用其他 npm registry，例如，你可以切换到淘宝镜像源：`npm config set registry https://registry.npmmirror.com`。

初始化完成后，我们进入项目并启动。

```bash
$ cd metis-ui-demo
$ npm run dev
```

此时使用浏览器访问 http://localhost:3000/ ，看到 NEXT 的 logo 就算成功了。

## 引入 metis-ui

现在从 yarn 或 npm 或 pnpm 或 bun 安装并引入 metis-ui。

<InstallDependencies npm='$ npm install metis-ui --save' yarn='$ yarn add metis-ui' pnpm='$ pnpm install metis-ui --save' bun='$ bun add metis-ui'></InstallDependencies>

修改 `src/app/globals.css`。

```css globals.css {3-4}
@import 'tailwindcss';

@source '../../node_modules/metis-ui/es'; /* 此处只能使用相对路径，如果没src目录，使用 ../node_modules/metis-ui/es 替换 */
@plugin 'metis-ui/plugin';
```

修改 `src/app/page.tsx`，引入 metis-ui 的按钮组件。

```tsx page.tsx
import React from 'react';
import { Button } from 'metis-ui';

const Home = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default Home;
```

好了，现在你应该能看到页面上已经有了 `metis-ui` 的蓝色按钮组件，接下来就可以继续选用其他组件开发应用了。其他开发流程你可以参考 Next.js 的[官方文档](https://nextjs.org/)。

<!-- prettier-ignore -->
:::warning
注意: Next.js App Router 当前不支持直接使用 `.` 引入的子组件，如 `<Avatar.Group />`、`<DatePicker.RangePicker />` 等，需要从路径引入这些子组件来避免错误。
:::
