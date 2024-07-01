---
title: Space
subtitle: 间距
description: 设置组件之间的间距。
group:
  title: 布局
  order: 1
---

## 何时使用

避免组件紧贴在一起，拉开统一的空间。

- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。
- 需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact。

## 代码演示

<!-- prettier-ignore -->
<!-- <code src="./demo/align.tsx">对齐</code> -->

## API

### Space

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `end` \|`center` \|`baseline` | - |  |
| direction | 间距方向 | `vertical` \| `horizontal` | `horizontal` |  |
| size | 间距大小 | [Size](#Size) \| [Size\[\]](#Size) | `small` |  |
| split | 设置拆分 | ReactNode | - |  |
| wrap | 是否自动换行，仅在 `horizontal` 时有效 | boolean | false |  |

### Size

`'small' | 'middle' | 'large' | number`

### Space.Compact

需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact。支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input
- Select
- TimePicker
- TreeSelect

| 参数      | 说明                         | 类型                           | 默认值       | 版本 |
| --------- | ---------------------------- | ------------------------------ | ------------ | ---- |
| block     | 将宽度调整为父元素宽度的选项 | boolean                        | false        |      |
| direction | 指定排列方向                 | `vertical` \| `horizontal`     | `horizontal` |      |
| size      | 子组件大小                   | `large` \| `middle` \| `small` | `middle`     |      |
