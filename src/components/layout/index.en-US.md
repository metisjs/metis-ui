---
title: Layout
description: Handling the overall layout of a page.
group: Layout
---

## Component Overview

- `Layout`: The layout wrapper, in which `Header` `Sider` `Content` `Footer` or `Layout` itself can be nested, and can be placed in any parent container.
- `Header`: The top layout with the default style, in which any element can be nested, and must be placed in `Layout`.
- `Sider`: The sidebar with default style and basic functions, in which any element can be nested, and must be placed in `Layout`.
- `Content`: The content layout with the default style, in which any element can be nested, and must be placed in `Layout`.
- `Footer`: The bottom layout with the default style, in which any element can be nested, and must be placed in `Layout`.

> Based on `flex layout`, please pay attention to the [compatibility](http://caniuse.com/#search=flex).

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic Structure</code>
<code src="./demo/top.tsx" compact background="oklch(13% 0.028 261.692)">Header-Content-Footer</code>
<code src="./demo/top-side.tsx" compact background="oklch(13% 0.028 261.692)">Header-Sider</code>
<code src="./demo/top-side-2.tsx" compact background="oklch(13% 0.028 261.692)">Header Sider 2</code>
<code src="./demo/side.tsx" iframe="360">Sider</code>
<code src="./demo/custom-trigger.tsx" compact background="oklch(13% 0.028 261.692)">Custom trigger</code>
<code src="./demo/responsive.tsx" compact background="oklch(13% 0.028 261.692)">Responsive</code>
<code src="./demo/fixed.tsx" iframe="360">Fixed Header</code>
<code src="./demo/fixed-sider.tsx" iframe="360">Fixed Sider</code>

## API

### Layout

The wrapper.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| className | Container className | string | - |
| hasSider | Whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering | boolean | - |
| style | To customize the styles | CSSProperties | - |

### Layout.Sider

The sidebar.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| breakpoint | [Breakpoints](#breakpoint-width) of the responsive layout | `xs`, `sm`, `md`, `lg`, `xl`, `xxl` | - |
| className | Container className | string | - |
| collapsed | To set the current status | boolean | - |
| collapsedWidth | Width of the collapsed sidebar, by setting to 0 a special trigger will appear | number | 80 |
| collapsible | Whether can be collapsed | boolean | false |
| defaultCollapsed | To set the initial status | boolean | false |
| reverseArrow | Reverse direction of arrow, for a sider that expands from the right | boolean | false |
| style | To customize the styles | CSSProperties | - |
| theme | Color theme of the sidebar | `light`, `dark` | `dark` |
| trigger | Specify the customized trigger, set to null to hide the trigger | ReactNode | - |
| width | Width of the sidebar | number, string | 200 |
| zeroWidthTriggerStyle | To customize the styles of the special trigger that appears when `collapsedWidth` is 0 | object | - |
| onBreakpoint | The callback function, executed when [breakpoints](/components/grid/#api) changed | (broken) => {} | - |
| onCollapse | The callback function, executed by clicking the trigger or activating the responsive layout | (collapsed, type) => {} | - |

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
