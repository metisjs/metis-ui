---
title: Anchor
description: Hyperlinks to scroll on one page.
group:
  title: Navigation
  order: 2
---

## When To Use

For displaying anchor hyperlinks on page and jumping between them.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" iframe="200">Basic</code>
<code src="./demo/horizontal.tsx" iframe="200">Horizontal Anchor</code>
<code src="./demo/static.tsx" >Static Anchor</code>
<code src="./demo/on-click.tsx">Customize the onClick event</code>
<code src="./demo/customize-highlight.tsx">Customize the anchor highlight</code>
<code src="./demo/target-offset.tsx" iframe="200">Set Anchor scroll offset</code>
<code src="./demo/on-change.tsx">Listening for anchor link change</code>
<code src="./demo/replace.tsx" iframe="200">Replace href in history</code>

## API

### Anchor Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| affix | Fixed mode of Anchor | boolean | true |  |
| bounds | Bounding distance of anchor area | number | 5 |  |
| className | Semantic DOM class | string \| Record<'root' \| 'ink' \| 'link' \| 'title' , string> | - |  |
| getContainer | Scrolling container | () => HTMLElement | () => window |  |
| getCurrentAnchor | Customize the anchor highlight | (activeLink: string) => string | - |  |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | 0 |  |
| showInkInFixed | Whether show ink-square when `affix={false}` | boolean | false |  |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#components-anchor-demo-targetoffset) | number | - |  |
| onChange | Listening for anchor link change | (currentActiveLink: string) => void |  |  |
| onClick | Set the handler to handle `click` event | (e: MouseEvent, link: object) => void | - |  |
| items | Data configuration option content, support nesting through children | { key, href, title, target, className, children }\[] [see](#anchoritem) | - |  |
| direction | Set Anchor direction | `vertical` \| `horizontal` | `vertical` |  |
| replace | Replace items' href in browser history instead of pushing it | boolean | false |  |

### AnchorItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | string \| Record<'root' \| 'title' , string> | - |  |
| key | The unique identifier of the Anchor Link | string \| number | - |  |
| href | The target of hyperlink | string |  |  |
| target | Specifies where to display the linked URL | string |  |  |
| title | The content of hyperlink | ReactNode |  |  |
| children | Nested Anchor Link, `Attention: This attribute does not support horizontal orientation` | [AnchorItem](#anchoritem)\[] | - |  |
| replace | Replace item href in browser history instead of pushing it | boolean | false |  |
