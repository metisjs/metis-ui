---
title: Empty
description: Empty state placeholder.
group: Data Display
---

## When To Use

- When there is no data provided, display for friendly tips.
- User tutorial to create something in fresh new situation.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/customize.tsx">Customize</code>

<!-- <code src="./demo/config-provider.tsx">ConfigProvider</code> -->

<code src="./demo/description.tsx">No description</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | string \| Record<'root' \| 'image' \| 'description' \| 'footer', string> | - |  |
| description | Customize description | ReactNode | - |  |
| image | Customize image. Will treat as image url when string provided | ReactNode | - |  |
