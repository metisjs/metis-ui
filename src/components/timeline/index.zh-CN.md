---
group: 数据展示
title: Timeline
subtitle: 时间轴
description: 垂直展示的时间流信息。
demo:
  cols: 2
---

## 何时使用

- 当有一系列信息需按时间排列时，可正序和倒序。
- 需要有一条时间轴进行视觉上的串联时。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/color.tsx">圆圈颜色</code>
<code src="./demo/pending.tsx">最后一个及排序</code>
<code src="./demo/custom.tsx">自定义时间轴点</code>

## API

### Timeline

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |
| items | 选项配置 | [ItemType](#itemtype)\[] |  |
| pending | 指定最后一个幽灵节点是否存在或内容 | ReactNode | false |
| pendingDot | 当最后一个幽灵节点存在時，指定其时间图点 | ReactNode | &lt;LoadingOutline /> |
| reverse | 节点排序 | boolean | false |

### ItemType

时间轴的每一个节点。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |
| color | 指定圆圈颜色 `blue`、`red`、`green`等，或自定义的色值 | string | - |
| content | 设置内容 | ReactNode | - |
| dot | 自定义时间轴点 | ReactNode | - |
| time | 设置时间 | ReactNode | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
