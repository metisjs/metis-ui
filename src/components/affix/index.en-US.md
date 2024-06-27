---
title: Affix
group:
  title: Other
  order: 6
---

Stick an element to the viewport.

## When To Use

On longer web pages, it's helpful to stick component into the viewport. This is common for menus and actions.

Please note that Affix should not cover other content on the page, especially when the size of the viewport is small.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/on-change.tsx">Callback</code>
<code src="./demo/target.tsx">Container to scroll.</code>
<code src="./demo/debug.tsx" debug>debug</code>

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| offsetBottom | Offset from the bottom of the viewport (in pixels) | number | - |
| offsetTop | Offset from the top of the viewport (in pixels) | number | 0 |
| target | Specifies the scrollable area DOM node | () => HTMLElement | () => window |
| onChange | Callback for when Affix state is changed | (affixed?: boolean) => void | - |

**Note:** Children of `Affix` must not have the property `position: absolute`, but you can set `position: absolute` on `Affix` itself:

```jsx
<Affix style={{ position: 'absolute', top: y, left: x }}>...</Affix>
```
