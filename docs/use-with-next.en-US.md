---
group:
  title: Getting Started
order: 2
title: Usage with Next.js
---

[Next.js](https://nextjs.org/) is currently the most popular React server-side rendering framework in the world. This article will demonstrate how to use `metis-ui` components in a project created with Next.js.

## Installation and Initialization

Before getting started, you may need to install [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/).

<InstallDependencies npm='$ npx create-next-app metis-ui-demo' yarn='$ yarn create next-app metis-ui-demo' pnpm='$ pnpm create next-app metis-ui-demo' bun='$ bun create next-app metis-ui-demo'></InstallDependencies>

The tool will automatically scaffold a project and install the necessary dependencies. During the installation process, you will need to make some configuration choices. Make sure to enable `Tailwind CSS`. If you encounter network issues during installation, try configuring a proxy or using a different npm registry. For example, you can switch to the Taobao mirror: `npm config set registry https://registry.npmmirror.com`.

Once the initialization is complete, navigate to the project directory and start the development server.

```bash
$ cd metis-ui-demo
$ npm run dev
```

Now, open your browser and visit http://localhost:3000/. If you see the NEXT logo, the setup is successful.

## Importing metis-ui

Next, install and import `metis-ui` using yarn, npm, pnpm, or bun.

<InstallDependencies npm='$ npm install metis-ui --save' yarn='$ yarn add metis-ui' pnpm='$ pnpm install metis-ui --save' bun='$ bun add metis-ui'></InstallDependencies>

Modify `src/app/globals.css`.

```css globals.css {3-4}
@import 'tailwindcss';

@source '../../node_modules/metis-ui/es'; /* Use relative paths here. If there is no src directory, replace with ../node_modules/metis-ui/es */
@plugin 'metis-ui/plugin';
```

Update `src/app/page.tsx` to include the `metis-ui` button component.

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

Now, you should see a blue button component from `metis-ui` on the page. You can continue to use other components to develop your application. For additional development workflows, refer to the [Next.js](https://nextjs.org/).

<!-- prettier-ignore -->
:::warning
Note: The Next.js App Router currently does not support directly using subcomponents imported with `.` such as `<Avatar.Group />` or `<DatePicker.RangePicker />`. To avoid errors, import these subcomponents using their specific paths.
:::

> Translate by ChartGPT
