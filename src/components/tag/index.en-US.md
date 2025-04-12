---
title: Tag
description: Tag for categorizing or markup.
group: Data Display
demo:
  cols: 2
---

## When To Use

- It can be used to tag by dimension or property.

- When categorizing.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/colorful.tsx">Colorful Tag</code>
<code src="./demo/control.tsx">Add & Remove Dynamically</code>
<code src="./demo/checkable.tsx">Checkable</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/status.tsx">Status Tag</code>
<code src="./demo/borderless.tsx">borderless</code>
<code src="./demo/draggable.tsx">Draggable Tag</code>

## API

### Tag

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bordered | Whether has border style | boolean | true |  |
| className | Semantic DOM class | [SemanticDOM](#tag-1) | - |  |
| closable | The config of closable | boolean, ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| color | Color of the Tag | string | - |  |
| icon | Set the icon of tag | ReactNode | - |  |
| onClose | Callback executed when tag is closed | (e) => void | - |  |

### Tag.CheckableTag

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Checked status of Tag | boolean | false |
| className | Semantic DOM class | [SemanticDOM](#tagcheckabletag-1) | - |
| onChange | Callback executed when Tag is checked/unchecked | (checked) => void | - |

## Semantic DOM

### Tag

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Tag.CheckableTag

<code src="./demo/_semantic_checkable.tsx" simplify></code>
