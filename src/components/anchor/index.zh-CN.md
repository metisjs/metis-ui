---
title: Anchor
subtitle: 锚点
description: 用于跳转到页面指定位置。
group:
  title: 导航
  order: 2
---

## 何时使用

需要展现当前页面上可供跳转的锚点链接，以及快速在锚点之间跳转。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" iframe="200">基本</code>
<code src="./demo/horizontal.tsx" iframe="200">横向 Anchor</code>
<code src="./demo/static.tsx">静态位置</code>
<code src="./demo/on-click.tsx">自定义 onClick 事件</code>
<code src="./demo/customize-highlight.tsx">自定义锚点高亮</code>
<code src="./demo/target-offset.tsx" iframe="200">设置锚点滚动偏移量</code>
<code src="./demo/on-change.tsx">监听锚点链接改变</code>
<code src="./demo/replace.tsx" iframe="200">替换历史中的 href</code>

## API

### Anchor Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| affix | 固定模式 | boolean | true |  |
| bounds | 锚点区域边界 | number | 5 |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| direction | 设置导航方向 | `vertical`、 `horizontal` | `vertical` |  |
| getContainer | 指定滚动的容器 | () => HTMLElement | () => window |  |
| getCurrentAnchor | 自定义高亮的锚点 | (activeLink: string) => string | - |  |
| items | 数据化配置选项内容，支持通过 children 嵌套 | { key, href, title, target, className, children }\[] [具体见](#anchoritem) | - |  |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number |  |  |
| replace | 替换浏览器历史记录中项目的 href 而不是推送它 | boolean | false |  |
| showInkInFixed | `affix={false}` 时是否显示小方块 | boolean | false |  |
| targetOffset | 锚点滚动偏移量，默认与 offsetTop 相同，[例子](#components-anchor-demo-targetoffset) | number | - |  |
| onChange | 监听锚点链接改变 | (currentActiveLink: string) => void | - |  |
| onClick | `click` 事件的 handler | (e: MouseEvent, link: object) => void | - |  |

### AnchorItem

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 嵌套的 Anchor Link，`注意：水平方向该属性不支持` | [AnchorItem](#anchoritem)\[] | - |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| href | 锚点链接 | string | - |  |
| key | 唯一标志 | string、 number | - |  |
| replace | 替换浏览器历史记录中的项目 href 而不是推送它 | boolean | false |  |
| target | 该属性指定在何处显示链接的资源 | string | - |  |
| title | 文字内容 | ReactNode | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
