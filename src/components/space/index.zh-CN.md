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
<code src="./demo/base.tsx">基本用法</code>
<code src="./demo/vertical.tsx">垂直间距</code>
<code src="./demo/size.tsx">间距大小</code>
<code src="./demo/align.tsx">对齐</code>
<code src="./demo/wrap.tsx">自动换行</code>
<code src="./demo/split.tsx">分隔符</code>
<code src="./demo/compact.tsx">紧凑布局组合</code>
<code src="./demo/compact-buttons.tsx">Button 紧凑布局</code>
<code src="./demo/compact-button-vertical.tsx">垂直方向紧凑布局</code>
<code src="./demo/compact-debug.tsx" debug>调试 Input 前置/后置标签</code>
<code src="./demo/compact-nested.tsx" debug>紧凑布局嵌套</code>
<code src="./demo/debug.tsx" debug>多样的 Child</code>
<code src="./demo/gap-in-line.tsx" debug>Flex gap 样式</code>

## API

### Space

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 交叉轴方向上的对齐方式 | `start`、 `end`、 `center`、 `baseline` | `center`、 `vertical: start` |  |
| block | 以块级元素显示，默认为内联元素 | boolean | false |  |
| justify | 主轴方向上的对齐方式 | `start`、 `end`、 `center`、 `space-around`、 `space-between` | `start` |  |
| size | 间距大小 | [Size](#Size)、 [Size\[\]](#Size) | `small` |  |
| split | 设置拆分 | ReactNode | - |  |
| vertical | 竖向间距 | boolean | false |  |
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

| 参数     | 说明                         | 类型                         | 默认值   | 版本 |
| -------- | ---------------------------- | ---------------------------- | -------- | ---- |
| block    | 将宽度调整为父元素宽度的选项 | boolean                      | false    |      |
| size     | 子组件大小                   | `large`、 `middle`、 `small` | `middle` |      |
| vertical | 竖向间距                     | boolean                      | false    |      |
