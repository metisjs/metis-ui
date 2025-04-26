---
group:
  title: 如何使用
order: 3
title: 在 Umi 中使用
---

[Umi](https://umijs.org/)，是蚂蚁集团的底层前端框架，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

本文会引导你使用 Umi、Metis UI 从 0 开始创建一个简单应用。

## 初始化项目

在开始之前，你可能需要安装 [yarn](https://github.com/yarnpkg/yarn/) 或者 [pnpm](https://pnpm.io/zh/) 或者 [bun](https://bun.sh/)。

<InstallDependencies npm='$ npx create-umi metis-ui-demo' yarn='$ yarn create umi metis-ui-demo' pnpm='$ pnpm create umi metis-ui-demo' bun='$ bun create umi metis-ui-demo'></InstallDependencies>

这里选「Simple App」。

```bash
? Pick Umi App Template › - Use arrow-keys. Return to submit.
❯   Simple App
    Ant Design Pro
    Vue Simple App
    Umi Plugin
```

其他选项可根据实际需求自行选择。

然后工具会自动安装依赖，并执行 Umi 的初始化脚本。

## 引入 metis-ui

现在从 yarn 或 npm 或 pnpm 或 bun 安装并引入 metis-ui，以及一些本教程会用到的依赖。

<InstallDependencies npm='$ npm i @metisjs/umi-plugins -D
$ npm i metis-ui tailwindcss @metisjs/icons -S' yarn='$ yarn add @metisjs/umi-plugins -D
$ yarn add metis-ui tailwindcss @metisjs/icons' pnpm='$ pnpm add @metisjs/umi-plugins -D
$ pnpm add metis-ui tailwindcss @metisjs/icons' bun='$ bun add @metisjs/umi-plugins -D
$ bun add metis-ui tailwindcss @metisjs/icons'></InstallDependencies>

其中 `@metisjs/umi-plugins` 是 metis 根据 Umi 框架研发的插件集，可让用户通过配置的方式一键开启和使用 `metis-ui`、`locale`(与[@umijs/plugins/locale](https://umijs.org/docs/max/i18n)功能类似)

完成后，执行以下命令启动项目。

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

跟着提示点击命令行里的 url，会自动打开浏览器。如果顺利，你会看到 **Yay! Welcome to Umi!**

修改 `.umirc.ts`。

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

`metisui` 支持 [ConfigProvider](/components/config-provider-cn#api) 的所有配置。

根目录下新建 `tailwind.css`

```css tailwindcss.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
```

修改 `src/pages/index.tsx`

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

好了，现在你应该能看到页面上已经有了 metis-ui 的 Alert 组件，接下来就可以继续开发应用了。

### 构建时配置

在 `.umirc.ts` 中，通过 `metisui` 配置全局 [ConfigProvider](/components/config-provider-cn#api)。

```ts .umirc.ts {5}
import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  metisui: { theme: 'system', componentSize: 'small' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
```

### 运行时配置

在 `src/app.ts(x)` 运行时配置中可以修改 ConfigProvider 的值，比如可以从 localStorage读取主题。

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

### 动态切换全局配置

通过 `useMetisUIConfig` 方法来动态获取、修改 ConfigProvider 配置，通常可用于动态修改主题。

新建 `src/components/ThemeSwitch.tsx` 组件。

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
    label: '亮色模式',
  },
  {
    name: 'dark',
    icon: <MoonSparklesOutline />,
    label: '暗色模式',
  },
  {
    name: 'system',
    icon: <ComputerDesktopOutline />,
    label: '跟随系统',
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

再次修改 `src/pages/index.tsx`，引入 `ThemeSwitch`

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

现在你应该能看到页面上已经有了样式切换的图标了，试试切换不同的样式吧。

### 国际化

如果你需要在应用中开启国际化功能，使用 `@metisjs/umi-plugins/dist/locale` 替换 `@umijs/plugins/dist/locale` 插件，使用方法可[参考](https://umijs.org/docs/max/i18n)。

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

好了，现在你可以继续选用其他组件开发应用了。其他开发流程你可以参考 Umi 的[官方文档](https://umijs.org/)。
