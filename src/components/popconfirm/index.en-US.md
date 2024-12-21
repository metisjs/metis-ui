---
title: Popconfirm
description: Pop up a bubble confirmation box for an action.
group: Feedback
demo:
  cols: 2
---

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/locale.tsx">Locale text</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/dynamic-trigger.tsx">Conditional trigger</code>
<code src="./demo/icon.tsx">Customize icon</code>
<code src="./demo/async.tsx">Asynchronously close</code>
<code src="./demo/promise.tsx">Asynchronously close on Promise</code>

## API

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#api) | - |  |
| cancelText | The text of the Cancel button | string | `Cancel` |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| description | The description of the confirmation box title | ReactNode \| () => ReactNode | - |  |
| disabled | Whether show popconfirm when click its childrenNode | boolean | false |  |
| icon | Customize icon of confirmation | ReactNode | &lt;ExclamationTriangleOutline /> |  |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#api) | - |  |
| okText | The text of the Confirm button | string | `OK` |  |
| okType | Button `type` of the Confirm button | string | `primary` |  |
| showCancel | Show cancel button | boolean | true |  |
| title | The title of the confirmation box | ReactNode \| () => ReactNode | - |  |
| onCancel | A callback of cancel | function(e) | - |  |
| onConfirm | A callback of confirmation | function(e) | - |  |
| onPopupClick | A callback of popup click | function(e) | - |  |

Consult [Tooltip's documentation](/components/tooltip/#api) to find more APIs.

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## Note

Please ensure that the child node of `Popconfirm` accepts `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events.
