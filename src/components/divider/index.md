---
title: Divider
group:
  title: 布局
---

# Divider 分割线

区隔内容的分割线。

## 何时使用

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/horizontal.tsx">水平分割线</code>
<code src="./demo/with-text.tsx">带文字的分割线</code>
<code src="./demo/plain.tsx">分割文字使用正文样式</code>
<code src="./demo/vertical.tsx">垂直分割线</code>
<code src="./demo/customize-style.tsx" debug>样式自定义</code>

## API

| 参数        | 说明                       | 类型                          | 默认值       | 版本 |
| ----------- | -------------------------- | ----------------------------- | ------------ | ---- |
| children    | 嵌套的标题                 | ReactNode                     | -            |      |
| className   | 分割线样式类               | string                        | -            |      |
| dashed      | 是否虚线                   | boolean                       | false        |      |
| orientation | 分割线标题的位置           | `left` \| `right` \| `center` | `center`     |      |
| plain       | 文字是否显示为普通正文样式 | boolean                       | false        |      |
| style       | 分割线样式对象             | CSSProperties                 | -            |      |
| type        | 水平还是垂直类型           | `horizontal` \| `vertical`    | `horizontal` |      |
