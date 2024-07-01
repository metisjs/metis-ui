---
title: Space
subtitle: 间距
description: 设置组件之间的间距。
group: 布局
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
| justify | 主轴方向上的对齐方式 | `start` \| `end` \| `center` \| `space-around` \| `space-between` | `start` |  |
| align | 交叉轴方向上的对齐方式 | `start` \| `end` \| `center` \| `baseline` | `center` \| `vertical: start` |  |
| vertical | 竖向间距 | boolean | false |  |
| size | 间距大小 | [Size](#Size) \| [Size\[\]](#Size) | `small` |  |
| split | 设置拆分 | ReactNode | - |  |
| block | 以块级元素显示，默认为内联元素 | boolean | false |  |
| wrap | 是否自动换行 | boolean | false |  |

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

| 参数     | 说明                         | 类型                           | 默认值   | 版本 |
| -------- | ---------------------------- | ------------------------------ | -------- | ---- |
| block    | 将宽度调整为父元素宽度的选项 | boolean                        | false    |      |
| vertical | 竖向间距                     | boolean                        | false    |      |
| size     | 子组件大小                   | `large` \| `middle` \| `small` | `middle` |      |
