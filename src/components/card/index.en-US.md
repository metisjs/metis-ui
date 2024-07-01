---
title: Card
description: A container for displaying information.
group: Data Display
---

## When To Use

A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic card</code>
<code src="./demo/border-less.tsx" background="grey">No border</code>
<code src="./demo/simple.tsx">Simple card</code>
<code src="./demo/flexible-content.tsx">Customized content</code>
<code src="./demo/in-column.tsx" background="grey">Card in column</code>
<code src="./demo/loading.tsx">Loading card</code>
<code src="./demo/meta.tsx">Support more content configuration</code>

## API

### Card

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | The action list, shows at the bottom of the Card | Array&lt;ReactNode> | - |  |
| bordered | Toggles rendering of the border around the card | boolean | true |  |
| className | Semantic DOM class | string \| Record<'root' \| 'header' \| 'body' \| 'extra' \| 'title' \| 'actions' \| 'cover', string> | - |  |
| cover | Card cover | ReactNode | - |  |
| extra | Content to render in the top-right corner of the card | ReactNode | - |  |
| hoverable | Lift up when hovering card | boolean | false |  |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false |  |
| size | Size of card | `default` \| `small` | `default` |  |
| title | Card title | ReactNode | - |  |

### Card.Meta

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| avatar | Avatar or icon | ReactNode | - |  |
| className | Semantic DOM class | string \| Record<'root' \| 'avatar' \| 'title' \| 'description', string> | - |  |
| description | Description content | ReactNode | - |  |
| style | The style object of container | CSSProperties | - |  |
| title | Title content | ReactNode | - |  |
