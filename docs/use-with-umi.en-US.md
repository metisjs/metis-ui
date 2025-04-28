---
group:
  title: Getting Started
order: 3
title: Usage with Umi
---

[Umi](https://umijs.org/) is Ant Group's foundational front-end framework. It supports both configuration-based and convention-based routing, ensuring comprehensive routing functionality and enabling feature extensions. Additionally, it comes with a robust plugin system that covers every lifecycle stage from source code to build artifacts, supporting various feature extensions and business requirements.

This article will guide you through creating a simple application from scratch using Umi and Metis UI.

## Initialize the Project

Before starting, you may need to install [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/).

<InstallDependencies npm='$ npx create-umi metis-ui-demo' yarn='$ yarn create umi metis-ui-demo' pnpm='$ pnpm create umi metis-ui-demo' bun='$ bun create umi metis-ui-demo'></InstallDependencies>

Choose "Simple App" from the options.

```bash
? Pick Umi App Template › - Use arrow-keys. Return to submit.
❯   Simple App
  Ant Design Pro
  Vue Simple App
  Umi Plugin
```

You can select other options based on your actual needs.

The tool will then automatically install dependencies and execute Umi's initialization script.

## Importing Metis UI

Now, install and import Metis UI along with some dependencies required for this tutorial using yarn, npm, pnpm, or bun.

<InstallDependencies npm='$ npm i @metisjs/umi-plugins -D
$ npm i metis-ui tailwindcss @metisjs/icons -S' yarn='$ yarn add @metisjs/umi-plugins -D
$ yarn add metis-ui tailwindcss @metisjs/icons' pnpm='$ pnpm add @metisjs/umi-plugins -D
$ pnpm add metis-ui tailwindcss @metisjs/icons' bun='$ bun add @metisjs/umi-plugins -D
$ bun add metis-ui tailwindcss @metisjs/icons'></InstallDependencies>

`@metisjs/umi-plugins` is a plugin suite developed by Metis for the Umi framework. It allows users to enable and use `metis-ui` and `locale` (similar to [@umijs/plugins/locale](https://umijs.org/docs/max/i18n)) with simple configuration.

After completing the installation, start the project with the following command:

```bash
$ pnpm run dev
umi dev
info  - Umi v4.0.46
    ╔════════════════════════════════════════════════════╗
    ║ App listening at:                                  ║
    ║  >   Local: http://localhost:8000                  ║
ready - ║  > Network: http://*********:8000                  ║
    ║                                                    ║
    ║ Now you can open browser with the above addresses↑ ║
    ╚════════════════════════════════════════════════════╝
```

Click the URL in the terminal to open the browser. If successful, you will see **Yay! Welcome to Umi!**

Modify `.umirc.ts` as follows:

```ts .umirc.ts {9-10}
import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/docs', component: 'docs' },
  ],
  npmClient: 'pnpm',
  metisui: { theme: 'system' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
```

`metisui` supports all configurations of [ConfigProvider](/components/config-provider#api).

Create a new `tailwind.css` file in the root directory:

```css tailwindcss.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
```

Modify `src/pages/index.tsx`:

```tsx index.tsx
import { Alert } from 'metis-ui';

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
    </div>
  );
}
```

Now, you should see the Metis UI Alert component on the page. You can proceed with developing your application.

### Build-Time Configuration

In `.umirc.ts`, configure the global [ConfigProvider](/components/config-provider#api) using `metisui`:

```ts .umirc.ts {5}
import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  metisui: { theme: 'system', componentSize: 'small' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
```

### Runtime Configuration

In `src/app.ts(x)`, modify the ConfigProvider values at runtime. For example, you can read the theme from localStorage:

```tsx app.ts
import { RuntimeMetisUIConfig } from 'umi';

export const metisui: RuntimeMetisUIConfig = (memo) => {
  const theme = localStorage.getItem('theme');
  if (theme) {
    memo.theme = theme;
  }

  return memo;
};
```

### Dynamically Switching Global Configuration

Use the `useMetisUIConfig` method to dynamically get and modify ConfigProvider configurations, such as changing the theme dynamically.

Create a new `src/components/ThemeSwitch.tsx` component:

```tsx ThemeSwitch.tsx
import type { FC } from 'react';
import { ComputerDesktopOutline, MoonSparklesOutline, SunOutline } from '@metisjs/icons';
import { Dropdown } from 'metis-ui';
import { MenuClickEventHandler } from 'metis-ui/es/menu/interface';
import { useMetisUIConfig } from 'umi';

export type ThemeName = 'system' | 'light' | 'dark';

const themes = [
  {
    name: 'light',
    icon: <SunOutline />,
    label: 'Light Mode',
  },
  {
    name: 'dark',
    icon: <MoonSparklesOutline />,
    label: 'Dark Mode',
  },
  {
    name: 'system',
    icon: <ComputerDesktopOutline />,
    label: 'Follow System',
  },
];

const ThemeSwitch: FC = () => {
  const [config, setConfig] = useMetisUIConfig();

  const onThemeChange: MenuClickEventHandler = ({ key }) => {
    setConfig({ theme: key as ThemeName });
    localStorage.setItem('theme', key as ThemeName);
  };

  const currentTheme = themes.find((theme) => theme.name === (config.theme ?? 'system'));

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: themes.map((theme) => ({
          key: theme.name,
          label: theme.label,
          icon: theme.icon,
        })),
        selectable: true,
        selectedKeys: [currentTheme!.name],
        onClick: onThemeChange,
        className: { item: { icon: '-ms-1 size-5' } },
      }}
    >
      <button className="text-text m-6 flex items-center *:size-10">{currentTheme?.icon}</button>
    </Dropdown>
  );
};

export default ThemeSwitch;
```

Modify `src/pages/index.tsx` again to include `ThemeSwitch`:

```tsx index.tsx
import { Alert } from 'metis-ui';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
      <ThemeSwitch />
    </div>
  );
}
```

Now, you should see a theme switch icon on the page. Try switching between different themes.

### Internationalization

If you need to enable internationalization in your application, replace the `@umijs/plugins/dist/locale` plugin with `@metisjs/umi-plugins/dist/locale`. Refer to the [documentation](https://umijs.org/docs/max/i18n) for usage.

<!-- prettier-ignore -->
```ts .umirc.ts {8}
import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  locale: { metisui: true, default: 'zh-CN' },
  plugins: [
  '@metisjs/umi-plugins/dist/metisui',
  '@metisjs/umi-plugins/dist/locale'
  ],
});
```

Now you can continue developing your application with other components. For additional development workflows, refer to [UmiJS](https://umijs.org/).

> Translate by ChartGPT
