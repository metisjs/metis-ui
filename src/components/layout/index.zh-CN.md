---
title: Layout
subtitle: 布局
description: 协助进行页面级整体布局。
group: 布局
---

## 组件概述

- `Layout`：布局容器，其下可嵌套 `Header` `Sider` `Content` `Footer` 或 `Layout` 本身，可以放在任何父容器中。
- `Header`：顶部布局，自带默认样式，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Sider`：侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Content`：内容部分，自带默认样式，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Footer`：底部布局，自带默认样式，其下可嵌套任何元素，只能放在 `Layout` 中。

> 注意：采用 flex 布局实现，请注意[浏览器兼容性](http://caniuse.com/#search=flex)问题。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本结构</code>
<code src="./demo/top.tsx" compact>上中下布局</code>
<code src="./demo/top-side.tsx" compact >顶部-侧边布局</code>
<code src="./demo/top-side-2.tsx" compact >顶部-侧边布局-通栏</code>
<code src="./demo/side.tsx" iframe="360">侧边布局</code>
<code src="./demo/custom-trigger.tsx" compact >自定义触发器</code>
<code src="./demo/responsive.tsx" compact >响应式布局</code>
<code src="./demo/fixed.tsx" iframe="360">固定头部</code>
<code src="./demo/fixed-sider.tsx" iframe="360">固定侧边栏</code>

## API

### Layout

布局容器。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 容器 className | string | - |
| hasSider | 表示子元素里有 Sider，一般不用指定。可用于服务端渲染时避免样式闪动 | boolean | - |
| style | 指定样式 | CSSProperties | - |

### Layout.Sider

侧边栏。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| breakpoint | 触发响应式布局的[断点](#breakpoint-width) | `sm`、 `md`、 `lg`、 `xl`、 `2xl` | - |
| className | 容器 className | string | - |
| collapsed | 当前收起状态 | boolean | - |
| collapsible | 是否可收起 | boolean | false |
| defaultCollapsed | 是否默认收起 | boolean | false |
| reverseArrow | 翻转折叠提示箭头的方向，当 Sider 在右边时可以使用 | boolean | false |
| style | 指定样式 | CSSProperties | - |
| theme | 主题颜色 | `light`、 `dark` | `dark` |
| trigger | 自定义 trigger，设置为 null 时隐藏 trigger | ReactNode | - |
| width | 宽度 | number、 string | 200 |
| onBreakpoint | 触发响应式布局，断点时的回调 | (broken) => {} | - |
| onCollapse | 展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发 | (collapsed, type) => {} | - |

#### Breakpoint width

```js
{
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
}
```
