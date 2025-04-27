---
group:
  title: 进阶使用
  order: 1
order: 3
title: 样式覆盖
---

实际项目中，开发者往往需要对组件进行全局或局部的样式重写，以满足特定的设计需求或品牌规范。Metis UI 提供了多种方式来实现样式覆盖，既可以灵活调整组件的默认样式，也可以针对特定场景进行定制。

## 全局样式重写

### 1. 修改主题色

通过修改主题颜色，可以快速调整全局样式以适配品牌需求。具体方法请参考[主题文档](/docs/theme-cn)。

### 2. 使用 `ConfigProvider` 组件

`ConfigProvider` 组件允许开发者通过配置的方式全局覆盖组件的样式。例如：

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

### 3. 使用传统 CSS 类

Metis UI 保留了传统组件的 class 属性，允许开发者通过 CSS 文件直接覆盖样式。例如：

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';

.metis-btn.metis-btn-default {
  @apply bg-pink-300;
}
```

## 局部样式重写

对于局部样式的调整，可以通过组件的 `className` 属性进行自定义，灵活地为组件添加自定义样式，满足局部样式调整的需求，[详细介绍](/docs/semantic-class-cn)。例如：

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
