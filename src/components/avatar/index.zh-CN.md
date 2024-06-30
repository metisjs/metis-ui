---
title: Avatar
subtitle: 头像
group:
  title: 数据展示
  order: 4
---

用来代表用户或事物，支持图片、图标或字符展示。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/type.tsx">类型</code>
<code src="./demo/dynamic.tsx">自动调整字符大小</code>
<code src="./demo/badge.tsx">带徽标的头像</code>
<code src="./demo/group.tsx">Avatar.Group</code>
<code src="./demo/toggle.tsx" debug>隐藏情况下计算字符对齐</code>
<code src="./demo/fallback.tsx" debug>图片不存在时</code>

## API

### Avatar

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| alt | 图像无法显示时的替代文本 | string | - |  |
| gap | 字符类型距离左右两侧边界单位像素 | number | 4 |  |
| icon | 设置头像的自定义图标 | ReactNode | - |  |
| shape | 指定头像的形状 | `circle` \| `square` | `circle` |  |
| size | 设置头像的大小 | number \| `large` \| `small` \| `default` | `default` |  |
| src | 图片类头像的资源地址或者图片元素 | string \| ReactNode | - |  |
| srcSet | 设置图片类头像响应式资源地址 | string | - |  |
| draggable | 图片是否允许拖动 | boolean \| `'true'` \| `'false'` | - |  |
| crossOrigin | CORS 属性设置 | `'anonymous'` \| `'use-credentials'` \| `''` | - |  |
| onError | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为 | () => boolean | - |  |

> Tip：你可以设置 `icon` 或 `children` 作为图片加载失败的默认 fallback 行为，优先级为 `icon` > `children`

### Avatar.Group

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| maxCount | 显示的最大头像个数 | number | - |  |
| maxPopoverPlacement | 多余头像气泡弹出位置 | `top` \| `bottom` | `top` |  |
| maxPopoverTrigger | 设置多余头像 Popover 的触发方式 | `hover` \| `focus` \| `click` | `hover` |  |
| maxStyle | 多余头像样式 | CSSProperties | - |  |
| size | 设置头像的大小 | number \| `large` \| `small` \| `default` | `default` |  |
