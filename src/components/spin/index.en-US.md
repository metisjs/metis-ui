---
title: Spin
description: A spinner for displaying loading state of a page or a section.
group: Feedback
demo:
  cols: 2
---

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">basic Usage</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/nested.tsx">Embedded mode</code>
<code src="./demo/tip.tsx">Customized description</code>
<code src="./demo/delay-and-debounce.tsx">delay</code>
<code src="./demo/fullscreen.tsx">Fullscreen</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| delay | Specifies a delay in milliseconds for loading state (prevent flush) | number (milliseconds) | - |  |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | 5.11.0 |
| size | The size of Spin, options: `small`, `default` and `large` | string | `default` |  |
| spinning | Whether Spin is visible | boolean | true |  |
| tip | Customize description content when Spin has children | ReactNode | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
