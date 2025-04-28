---
group:
  title: Advanced
  order: 1
order: 3
title: Style override
---

In real-world projects, developers often need to globally or locally override component styles to meet specific design requirements or branding guidelines. Metis UI provides multiple ways to achieve style overrides, allowing you to flexibly adjust default component styles or customize them for specific scenarios.

## Global Style Overrides

### 1. Modify Theme Colors

By modifying theme colors, you can quickly adjust global styles to fit your brand requirements. For detailed methods, refer to the [Theme Documentation](/docs/theme).

### 2. Use the `ConfigProvider` Component

The `ConfigProvider` component allows developers to globally override component styles through configuration. For example:

```tsx | demo
/**
 * readonly: true
 */
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button, ConfigProvider, Input, Space } from 'metis-ui';

export default () => (
  <ConfigProvider
    button={{ className: { root: 'outline-primary rounded-xl', icon: 'size-5' } }}
    input={{
      className: { root: 'outline-primary rounded-xl', prefix: 'text-error', suffix: 'text-error' },
    }}
  >
    <Space vertical>
      <Input prefix="￥" suffix="RMB" />
      <Button icon={<MagnifyingGlassOutline />}>Submit</Button>
    </Space>
  </ConfigProvider>
);
```

### 3. Use Traditional CSS Classes

Metis UI retains the traditional `class` attribute for components, allowing developers to directly override styles through CSS files. For example:

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';

.metis-btn.metis-btn-default {
  @apply bg-pink-300;
}
```

## Local Style Overrides

For local style adjustments, you can customize styles flexibly using the `className` property of components to meet specific needs. For more details, see the [Semantic Class Documentation](/docs/semantic-class). For example:

```tsx | demo
/**
 * readonly: true
 */
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';

export default () => (
  <Button
    type="primary"
    icon={<MagnifyingGlassOutline />}
    className="bg-pink-500 text-white enabled:hover:bg-pink-400"
  >
    Search
  </Button>
);
```

> Translate by ChartGPT
