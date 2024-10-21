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
| closeIcon | Custom close icon. close button will be hidden when setting to `null` or `false` | ReactNode | false |  |
| color | Color of the Tag | string | - |  |
| icon | Set the icon of tag | ReactNode | - |  |
| onClose | Callback executed when tag is closed | (e) => void | - |  |

### Tag.CheckableTag

| Property | Description                                     | Type              | Default |
| -------- | ----------------------------------------------- | ----------------- | ------- |
| checked  | Checked status of Tag                           | boolean           | false   |
| onChange | Callback executed when Tag is checked/unchecked | (checked) => void | -       |
