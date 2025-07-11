---
group:
  title: 进阶使用
  order: 1
order: 1
title: 主题
---

Metis UI 只针对颜色进行主题定制，默认提供了两套主题：`light` 和 `dark`。您还可以创建自己的自定义主题或修改内置主题。

您可以在 CSS 文件中的 @plugin "metis-ui/plugin" 后添加括号来管理主题。

<!-- prettier-ignore -->
```css tailwind.css
@plugin 'metis-ui/plugin' {
  themes: light --default, dark --dark; /* --default: 默认主题 --dark: 默认暗色主题，适配 prefers-color-scheme: dark */
}
```

通过 `ConfigProvider` 组件来设置当前主题，默认可选值 `light`、`dark`、`system`。

```tsx app.tsx
import React from 'react';
import { ConfigProvider } from 'metis-ui';

const App: React.FC = () => <ConfigProvider theme="dark">{/* ... */}</ConfigProvider>;

export default App;
```

## 禁用主题

禁用一个主题。

<!-- prettier-ignore -->
```css
@plugin './src/plugin' {
  themes: light --default;
}
```

禁用所有主题。

<!-- prettier-ignore -->
```css
@plugin './src/plugin' {
  themes: false;
}
```

## 局部主题

可以嵌套使用 `ConfigProvider` 来实现局部主题的更换。在子主题中未被改变的 `theme` 将会继承父主题。

```tsx app.tsx
import React from 'react';
import { Button, ConfigProvider, Space } from 'metis-ui';

const App: React.FC = () => (
  <ConfigProvider theme="dark">
    <Space>
      <Button type="primary">Theme 1</Button>
      <ConfigProvider theme="light">
        <Button type="primary">Theme 2</Button>
      </ConfigProvider>
    </Space>
  </ConfigProvider>
);

export default App;
```

## 自定义主题

要添加新主题，请在 CSS 文件中使用 @plugin "metis-ui/theme" {}，其结构如下:

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* 主题名称 */
  name: 'custom-theme';
  /* 默认主题*/
  default: true;
  /* 默认暗色主题，跟随系统自动切换 */
  dark: false;
  /* light 或 dark */
  color-scheme: light;

  /* 品牌色 */
  primary: 'indigo-600';
  /* 品牌悬浮色，可选属性，可由系统推导生成 */
  primary-hover: 'indigo-500';
  /* 品牌激活色，可选属性，可由系统推导生成 */
  primary-active: 'indigo-700';
  /* 品牌背景色，可选属性，可由系统推导生成 */
  primary-bg: 'indigo-50';
  /* 品牌背景悬浮色，可选属性，可由系统推导生成 */
  primary-bg-hover: 'indigo-200';
  /* 品牌边框色，可选属性，可由系统推导生成 */
  primary-border: 'indigo-300';
  /* 品牌次级边框色，可选属性，可由系统推导生成 */
  primary-border-secondary: 'indigo-600/10';

  /* 成功色 */
  success: 'green-500';
  /* 成功悬浮色，可选属性，可由系统推导生成 */
  success-hover: 'green-400';
  /* 成功激活色，可选属性，可由系统推导生成 */
  success-active: 'green-600';
  /* 成功背景色，可选属性，可由系统推导生成 */
  success-bg: 'green-50';
  /* 成功背景悬浮色，可选属性，可由系统推导生成 */
  success-bg-hover: 'green-100';
  /* 成功边框色，可选属性，可由系统推导生成 */
  success-border: 'green-300';
  /* 成功次级边框色，可选属性，可由系统推导生成 */
  success-border-secondary: 'green-500/20';

  /* 警戒色 */
  warning: 'yellow-500';
  /* 警戒悬浮色，可选属性，可由系统推导生成 */
  warning-hover: 'yellow-400';
  /* 警戒激活色，可选属性，可由系统推导生成 */
  warning-active: 'yellow-600';
  /* 警戒背景色，可选属性，可由系统推导生成 */
  warning-bg: 'yellow-50';
  /* 警戒背景悬浮色，可选属性，可由系统推导生成 */
  warning-bg-hover: 'yellow-100';
  /* 警戒边框色，可选属性，可由系统推导生成 */
  warning-border: 'yellow-300';
  /* 警戒次级边框色，可选属性，可由系统推导生成 */
  warning-border-secondary: 'yellow-500/20';

  /* 错误色 */
  error: 'red-500';
  /* 错误悬浮色，可选属性，可由系统推导生成 */
  error-hover: 'red-400';
  /* 错误激活色，可选属性，可由系统推导生成 */
  error-active: 'red-600';
  /* 错误背景色，可选属性，可由系统推导生成 */
  error-bg: 'red-50';
  /* 错误背景悬浮色，可选属性，可由系统推导生成 */
  error-bg-hover: 'red-100';
  /* 错误边框色，可选属性，可由系统推导生成 */
  error-border: 'red-300';
  /* 错误次级边框色，可选属性，可由系统推导生成 */
  error-border-secondary: 'red-500/20';

  /* 一级文本色 */
  text: 'gray-950';
  /* 二级文本色，可选属性，可由系统推导生成 */
  text-secondary: 'gray-500';
  /* 三级文本色，可选属性，可由系统推导生成 */
  text-tertiary: 'gray-400';
  /* 四级文本色，可选属性，可由系统推导生成 */
  text-quaternary: 'gray-300';

  /* 一级边框色 */
  border: 'gray-300';
  /* 二级边框色，可选属性，可由系统推导生成 */
  border-secondary: 'gray-200';
  /* 三级边框色，可选属性，可由系统推导生成 */
  border-tertiary: 'gray-100';

  /* 一级填充色 */
  fill: 'gray-950/20';
  /* 二级填充色，可选属性，可由系统推导生成 */
  fill-secondary: 'gray-950/15';
  /* 三级填充色，可选属性，可由系统推导生成 */
  fill-tertiary: 'gray-950/10';
  /* 四级填充色，可选属性，可由系统推导生成 */
  fill-quaternary: 'gray-950/5';
  /* 五级填充色，可选属性，可由系统推导生成 */
  fill-quinary: 'gray-950/2';

  /* 组件容器背景 */
  container: 'white';

  /* 引起注意的背景色 */
  spotlight: 'gray-900/85';

  /* 浮层的背景蒙层色 */
  mask: 'gray-900/45';

  /** 滚动组件滚动条颜色 */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
```

主题颜色可以是 [`Tailwindcss Color`](https://tailwindcss.com/docs/colors) 或者 [`CSS Color`](https://developer.mozilla.org/docs/Web/CSS/color)。

支持由 [`Tailwindcss Color`](https://tailwindcss.com/docs/colors) 推导生成次级颜色，你可以像这样简化主题的定制：

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* 主题名称 */
  name: 'custom-theme';
  /* 默认主题*/
  default: true;
  /* 默认暗色主题，跟随系统自动切换 */
  dark: false;
  /* light 或 dark */
  color-scheme: light;

  /* 品牌色 */
  primary: 'sky-600';
  /* 成功色 */
  success: 'green-500';
  /* 警戒色 */
  warning: 'yellow-500';
  /* 错误色 */
  error: 'red-500';
  /* 一级文本色 */
  text: 'gray-950';
  /* 一级边框色 */
  border: 'gray-300';
  /* 一级填充色 */
  fill: 'gray-950/20';
  /* 组件容器背景色 */
  container: 'white';
  /* 浮层背景色 */
  elevated: 'white';
  /* 引起注意的背景色 */
  spotlight: 'gray-900/85';
  /* 浮层的背景蒙层色 */
  mask: 'gray-900/45';
  /** 滚动组件滚动条颜色 */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
```

## 修改内置主题

要自定义内置主题，您可以使用与添加新主题相同的结构，但使用与内置主题相同的名称。

例如，要自定义 light 主题：

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* 主题名称 */
  name: 'light';
  /* 默认主题*/
  default: true;
  /* 默认暗色主题，跟随系统自动切换 */
  dark: false;
  /* light 或 dark */
  color-scheme: light;

  /* 品牌色 */
  primary: 'pink-600';
}
```

所有其他颜色将从原主题继承。
