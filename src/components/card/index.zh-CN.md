---
title: Card
subtitle: 卡片
description: 通用卡片容器。
group: 数据展示
---

## 何时使用

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">典型卡片</code>
<code src="./demo/border-less.tsx" background="#f3f4f6">无边框</code>
<code src="./demo/simple.tsx">简洁卡片</code>
<code src="./demo/flexible-content.tsx">更灵活的内容展示</code>
<code src="./demo/in-column.tsx" background="#f3f4f6">栅格卡片</code>
<code src="./demo/loading.tsx">预加载的卡片</code>
<code src="./demo/meta.tsx">支持更多内容配置</code>

## API

### Card

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 卡片操作组，位置在卡片底部 | Array&lt;ReactNode> | - |  |
| bordered | 是否有边框 | boolean | true |  |
| className | 语义化结构 class | [SemanticDOM](#card-1) | - |  |
| cover | 卡片封面 | ReactNode | - |  |
| extra | 卡片右上角的操作区域 | ReactNode | - |  |
| hoverable | 鼠标移过时可浮起 | boolean | false |  |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | false |  |
| size | card 的尺寸 | `default`、 `small` | `default` |  |
| title | 卡片标题 | ReactNode | - |  |

### Card.Meta

| 参数        | 说明               | 类型                       | 默认值 | 版本 |
| ----------- | ------------------ | -------------------------- | ------ | ---- |
| avatar      | 头像/图标          | ReactNode                  | -      |      |
| className   | 语义化结构 class   | [SemanticDOM](#cardmeta-1) | -      |      |
| description | 描述内容           | ReactNode                  | -      |      |
| style       | 定义容器类名的样式 | CSSProperties              | -      |      |
| title       | 标题内容           | ReactNode                  | -      |      |

## Semantic DOM

### Card

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Card.Meta

<code src="./demo/_semantic_meta.tsx" simplify></code>
