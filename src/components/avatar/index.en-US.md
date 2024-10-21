---
title: Avatar
description: Used to represent users or things, supporting the display of images, icons, or characters.
group:
  title: Data Display
  order: 4
demo:
  cols: 2
---

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/type.tsx">Type</code>
<code src="./demo/dynamic.tsx">Autoset Font Size</code>
<code src="./demo/badge.tsx">With Badge</code>
<code src="./demo/group.tsx">Avatar.Group</code> 
<code src="./demo/toggle.tsx" debug>Calculate text style when hiding</code> 
<code src="./demo/fallback.tsx" debug>Fallback</code>

## API

### Avatar

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| alt | This attribute defines the alternative text describing the image | string | - |  |
| crossOrigin | CORS settings attributes | `'anonymous'` \| `'use-credentials'` \| `''` | - |  |
| draggable | Whether the picture is allowed to be dragged | boolean \| `'true'` \| `'false'` | true |  |
| gap | Letter type unit distance between left and right sides | number | 4 |  |
| icon | Custom icon type for an icon avatar | ReactNode | - |  |
| shape | The shape of avatar | `circle` \| `square` | `circle` |  |
| size | The size of the avatar | number \| `large` \| `small` \| `default` \| { xs: number, sm: number, ...} | `default` |  |
| src | The address of the image for an image avatar or image element | string \| ReactNode | - |  |
| srcSet | A list of sources to use for different screen resolutions | string | - |  |
| onError | Handler when img load error, return false to prevent default fallback behavior | () => boolean | - |  |

> Tip: You can set `icon` or `children` as the fallback for image load error, with the priority of `icon` > `children`

### Avatar.Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| maxCount | Max avatars to show | number | - |  |
| maxPopoverPlacement | The placement of excess avatar Popover | `top` \| `bottom` | `top` |  |
| maxPopoverTrigger | Set the trigger of excess avatar Popover | `hover` \| `focus` \| `click` | `hover` |  |
| maxStyle | The style of excess avatar style | CSSProperties | - |  |
| size | The size of the avatar | number \| `large` \| `small` \| `default` \| { xs: number, sm: number, ...} | `default` |  |
