---
group:
  title: Advanced
  order: 1
order: 1
title: Theme
---

Metis UI only customizes themes based on colors and provides two default themes: `light` and `dark`. You can also create your own custom themes or modify the built-in themes.

You can manage themes by adding parentheses after `@plugin "metis-ui/plugin"` in the CSS file.

<!-- prettier-ignore -->
```css tailwind.css
@plugin 'metis-ui/plugin' {
  themes: light --default, dark --dark; /* --default: Default theme --dark: Default dark theme, adapts to prefers-color-scheme: dark */
}
```

Set the current theme using the `ConfigProvider` component. The default options are `light`, `dark`, and `system`.

```tsx app.tsx
import React from 'react';
import { ConfigProvider } from 'metis-ui';

const App: React.FC = () => <ConfigProvider theme="dark">{/* ... */}</ConfigProvider>;

export default App;
```

## Disable Themes

Disable a specific theme.

<!-- prettier-ignore -->
```css
@plugin './src/plugin' {
  themes: light --default;
}
```

Disable all themes.

<!-- prettier-ignore -->
```css
@plugin './src/plugin' {
  themes: false;
}
```

## Scoped Themes

You can use nested `ConfigProvider` components to switch themes locally. The `theme` values not changed in the child theme will inherit from the parent theme.

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

## Custom Themes

To add a new theme, use `@plugin "metis-ui/theme" {}` in the CSS file with the following structure:

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* Theme name */
  name: 'custom-theme';
  /* Default theme */
  default: true;
  /* Default dark theme, switches automatically with the system */
  dark: false;
  /* light or dark */
  color-scheme: light;

  /* Brand color */
  primary: 'indigo-600';
  /* Brand hover color (optional, can be derived)  */
  primary-hover: 'indigo-500';
  /* Brand active color */
  primary-active: 'indigo-700';
  /* Brand background color (optional, can be derived) */
  primary-bg: 'indigo-50';
  /* Brand background hover color (optional, can be derived) */
  primary-bg-hover: 'indigo-200';
  /* Brand border color (optional, can be derived)  */
  primary-border: 'indigo-300';
  /* Secondary brand border color (optional, can be derived) */
  primary-border-secondary: 'indigo-600/10';

  /* Success color */
  success: 'green-500';
  /* Success hover color (optional, can be derived) */
  success-hover: 'green-400';
  /* Success active color (optional, can be derived) */
  success-active: 'green-600';
  /* Success background color (optional, can be derived) */
  success-bg: 'green-50';
  /* Success background hover color (optional, can be derived) */
  success-bg-hover: 'green-100';
  /* Success border color (optional, can be derived) */
  success-border: 'green-300';
  /* Secondary success border color (optional, can be derived) */
  success-border-secondary: 'green-500/20';

  /* Warning color */
  warning: 'yellow-500';
  /* Warning hover color (optional, can be derived) */
  warning-hover: 'yellow-400';
  /* Warning active color (optional, can be derived) */
  warning-active: 'yellow-600';
  /* Warning background color (optional, can be derived) */
  warning-bg: 'yellow-50';
  /* Warning background hover color (optional, can be derived) */
  warning-bg-hover: 'yellow-100';
  /* Warning border color (optional, can be derived) */
  warning-border: 'yellow-300';
  /* Secondary warning border color (optional, can be derived) */
  warning-border-secondary: 'yellow-500/20';

  /* Error color */
  error: 'red-500';
  /* Error hover color (optional, can be derived) */
  error-hover: 'red-400';
  /* Error active color (optional, can be derived) */
  error-active: 'red-600';
  /* Error background color (optional, can be derived) */
  error-bg: 'red-50';
  /* Error background hover color (optional, can be derived) */
  error-bg-hover: 'red-100';
  /* Error border color (optional, can be derived) */
  error-border: 'red-300';
  /* Secondary error border color (optional, can be derived) */
  error-border-secondary: 'red-500/20';

  /* Primary text color */
  text: 'gray-950';
  /* Secondary text color (optional, can be derived) */
  text-secondary: 'gray-500';
  /* Tertiary text color (optional, can be derived) */
  text-tertiary: 'gray-400';
  /* Quaternary text color (optional, can be derived) */
  text-quaternary: 'gray-300';

  /* Primary border color */
  border: 'gray-300';
  /* Secondary border color (optional, can be derived) */
  border-secondary: 'gray-200';
  /* Tertiary border color (optional, can be derived) */
  border-tertiary: 'gray-100';

  /* Primary fill color */
  fill: 'gray-950/20';
  /* Secondary fill color (optional, can be derived) */
  fill-secondary: 'gray-950/15';
  /* Tertiary fill color (optional, can be derived) */
  fill-tertiary: 'gray-950/10';
  /* Quaternary fill color (optional, can be derived) */
  fill-quaternary: 'gray-950/5';
  /* Quinary fill color (optional, can be derived) */
  fill-quinary: 'gray-950/2';

  /* Component container background */
  container: 'white';

  /* Attention-grabbing background color */
  spotlight: 'gray-900/85';

  /* Background mask color for overlays */
  mask: 'gray-900/45';

  /** Scrollbar colors for scrollable components */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
```

Theme colors can be [`Tailwindcss Colors`](https://tailwindcss.com/docs/colors) or [`CSS Colors`](https://developer.mozilla.org/docs/Web/CSS/color).

You can simplify theme customization by deriving secondary colors from [`Tailwindcss Colors`](https://tailwindcss.com/docs/colors):

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* Theme name */
  name: 'custom-theme';
  /* Default theme */
  default: true;
  /* Default dark theme, switches automatically with the system */
  dark: false;
  /* light or dark */
  color-scheme: light;

  /* Brand color */
  primary: 'sky-600';
  /* Success color */
  success: 'green-500';
  /* Warning color */
  warning: 'yellow-500';
  /* Error color */
  error: 'red-500';
  /* Primary text color */
  text: 'gray-950';
  /* Primary border color */
  border: 'gray-300';
  /* Primary fill color */
  fill: 'gray-950/20';
  /* Component container background */
  container: 'white';
  /* Floating layers background*/
  elevated: 'white';
  /* Attention-grabbing background color */
  spotlight: 'gray-900/85';
  /* Background mask color for overlays */
  mask: 'gray-900/45';
  /** Scrollbar colors for scrollable components */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
```

## Modify Built-in Themes

To customize a built-in theme, use the same structure as adding a new theme but with the name of the built-in theme.

For example, to customize the `light` theme:

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* Theme name */
  name: 'light';
  /* Default theme */
  default: true;
  /* Default dark theme, switches automatically with the system */
  dark: false;
  /* light or dark */
  color-scheme: light;

  /* Brand color */
  primary: 'pink-600';
}
```

All other colors will inherit from the original theme.

> Translate by ChartGPT
