---
title: Alert
description: Display warning messages that require attention.
group:
  title: Feedback
  order: 5
demo:
  cols: 2
---

## When to Use

- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/style.tsx">More types</code>
<code src="./demo/closable.tsx">Closable</code>
<code src="./demo/description.tsx">Description</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/banner.tsx" iframe="250">Banner</code>
<code src="./demo/loop-banner.tsx">Looping Banner</code>
<code src="./demo/smooth-closed.tsx">Smooth Unmount</code>
<code src="./demo/error-boundary.tsx">ErrorBoundary</code>
<code src="./demo/custom-icon.tsx" debug>Custom Icon</code>
<code src="./demo/action.tsx">Custom action</code>

## API

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| action | The action of Alert | ReactNode | - |  |
| afterClose | Called when close animation is finished | () => void | - |  |
| banner | Whether to show as banner | boolean | false |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| closable | The config of closable | boolean, ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| description | Additional content of Alert | ReactNode | - |  |
| icon | Custom icon, effective when `showIcon` is true | ReactNode | - |  |
| message | Content of Alert | ReactNode | - |  |
| showIcon | Whether to show icon | boolean | false, in `banner` mode default is true |  |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | string | `info`, in `banner` mode default is `warning` |  |
| onClose | Callback when Alert is closed | (e: MouseEvent) => void | - |  |

### Alert.ErrorBoundary

| Property    | Description                      | Type      | Default           | Version |
| ----------- | -------------------------------- | --------- | ----------------- | ------- |
| description | Custom error description to show | ReactNode | {{ error stack }} |         |
| message     | Custom error message to show     | ReactNode | {{ error }}       |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
