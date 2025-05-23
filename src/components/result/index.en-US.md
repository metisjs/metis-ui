---
title: Result
description: Used to feedback the processing results of a series of operations.
group: Feedback
---

## When To Use

Use when important operations need to inform the user to process the results and the feedback is more complicated.

## Examples

<!-- prettier-ignore -->
<code src="./demo/success.tsx">Success</code>
<code src="./demo/info.tsx">Info</code>
<code src="./demo/warning.tsx">Warning</code>
<code src="./demo/403.tsx">403</code>
<code src="./demo/404.tsx">404</code>
<code src="./demo/500.tsx">500</code>
<code src="./demo/error.tsx">Error</code>
<code src="./demo/customIcon.tsx">Custom icon</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| extra | Operating area | ReactNode | - |  |
| icon | Custom back icon | ReactNode | - |  |
| status | Result status, decide icons and colors | `success`, `error`, `info`, `warning`, `404`, `403`, `500` | `info` |  |
| subTitle | The subTitle | ReactNode | - |  |
| title | The title | ReactNode | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
