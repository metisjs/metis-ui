---
title: Drawer
description: A panel that slides out from the edge of the screen.
group: Feedback
demo:
  cols: 2
---

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic-right.tsx">Basic</code>
<code src="./demo/placement.tsx">Custom Placement</code>
<code src="./demo/loading.tsx">Loading</code>
<code src="./demo/render-in-current.tsx">Render in current dom</code>
<code src="./demo/form-in-drawer.tsx">Submit form in drawer</code>
<code src="./demo/multi-level-drawer.tsx">Multi-level drawer</code>
<code src="./demo/custom-style.tsx">Customize className for build-in module</code>
<code src="./demo/config-provider.tsx" debug>ConfigProvider</code>
<code src="./demo/no-mask.tsx" debug>No mask</code>
<code src="./demo/scroll-debug.tsx" debug>Scroll Debug</code>

## API

| Props | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | function(open) | - |  |
| autoFocus | Whether Drawer should get focused after open | boolean | true |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| closable | Whether a close (x) button is visible on top right or not | boolean \| { closeIcon?: React.ReactNode } | true |  |
| destroyOnClose | Whether to unmount child components on closing drawer or not | boolean | false |  |
| drawerRender | Custom drawer content render | (node: ReactNode) => ReactNode | - |  |
| footer | The footer for Drawer | ReactNode | - |  |
| forceRender | Pre-render Drawer component forcibly | boolean | false |  |
| getContainer | mounted node and display window for Drawer | HTMLElement \| () => HTMLElement \| Selectors \| false | body |  |
| height | Placement is `top` or `bottom`, height of the Drawer dialog | string \| number | 448 |  |
| keyboard | Whether support press esc to close | boolean | true |  |
| loading | Show the Skeleton | boolean | false |  |
| mask | Whether to show mask or not | boolean | true |  |
| maskClosable | Clicking on the mask (area outside the Drawer) to close the Drawer or not | boolean | true |  |
| open | Whether the Drawer dialog is visible or not | boolean | false |  |
| placement | The placement of the Drawer | `top` \| `right` \| `bottom` \| `left` | `right` |  |
| push | Nested drawers push behavior | boolean \| { distance: string \| number } | { distance: 180 } | + |
| style | Style of Drawer panel. Use `bodyStyle` if want to config body only | CSSProperties | - |  |
| title | The title for Drawer | ReactNode | - |  |
| width | Width of the Drawer dialog | string \| number | 448 |  |
| zIndex | The `z-index` of the Drawer | number | 1000 |  |
| onClose | Specify a callback that will be called when a user clicks mask, close button or Cancel button | function(e) | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
