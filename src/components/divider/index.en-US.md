---
title: Divider
description: A divider line separates different content.
group:
  title: Layout
  order: 1
demo:
  cols: 2
---

## When To Use

- Divide sections of article.
- Divide inline text and links such as the operation column of table.

## Examples

<!-- prettier-ignore -->
<code src="./demo/horizontal.tsx">Horizontal</code>
<code src="./demo/with-text.tsx">Divider with title</code>
<code src="./demo/plain.tsx">Text without heading style</code>
<code src="./demo/vertical.tsx">Vertical</code>
<code src="./demo/customize-style.tsx" debug>Style Customization</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | The wrapped title | ReactNode | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| dashed | Whether line is dashed | boolean | false |  |
| orientation | The position of title inside divider | `left`, `right`, `center` | `center` |  |
| plain | Divider text show as plain style | boolean | true |  |
| style | The style object of container | CSSProperties | - |  |
| type | The direction type of divider | `horizontal`, `vertical` | `horizontal` |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
