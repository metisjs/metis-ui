---
group: 数据展示
title: Collapse
subtitle: 折叠面板
description: 可以折叠/展开的内容区域。
---

## 何时使用

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- `手风琴` 是一种特殊的折叠面板，只允许单个内容区域展开。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">折叠面板</code>
<code src="./demo/accordion.tsx">手风琴</code>
<code src="./demo/mix.tsx">面板嵌套</code>
<code src="./demo/borderless.tsx">简洁风格</code>
<code src="./demo/custom.tsx">自定义面板</code>
<code src="./demo/noarrow.tsx">隐藏箭头</code>
<code src="./demo/extra.tsx">额外节点</code>
<code src="./demo/ghost.tsx">幽灵折叠面板</code>
<code src="./demo/collapsible.tsx">可折叠触发区域</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| accordion | 手风琴模式 | boolean | false |  |
| activeKey | 当前激活 tab 面板的 key | string\[] \| string <br/> number\[] \| number | [手风琴模式](#collapse-demo-accordion)下默认第一个元素 |  |
| bordered | 带边框风格的折叠面板 | boolean | true |  |
| className | 语义化结构 class | string \| Record&lt;'root' \| 'panel' \| 'panelHeader' \| 'panelContent', string> | - |  |
| collapsible | 所有子面板是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | - |  |
| defaultActiveKey | 初始化选中面板的 key | string\[] \| string<br/> number\[] \| number | - |  |
| destroyInactivePanel | 销毁折叠隐藏的面板 | boolean | false |  |
| expandIcon | 自定义切换图标 | (panelProps) => ReactNode | - |  |
| expandIconPosition | 设置图标位置 | `start` \| `end` | - |  |
| ghost | 使折叠面板透明且无边框 | boolean | false |  |
| items | 折叠项目内容 | [ItemType](#itemtype) | - |  |
| onChange | 切换面板的回调 | function | - |  |

### ItemType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 l | boolean | true |  |
| className | 语义化结构 class | string \| Record&lt;'root' \| 'header' \| 'content', string> | - |  |
| collapsible | 是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | - | (icon: ) |
| destroyInactivePanel | 销毁折叠隐藏的面板 | boolean | false |  |
| extra | 自定义渲染每个面板右上角的内容 | ReactNode | - |  |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean | false |  |
| header | 面板头内容 | ReactNode | - |  |
| key | 对应 activeKey | string \| number | - |  |
| showArrow | 是否展示当前面板上的箭头（为 false 时，collapsible 不能置为 icon） | boolean | true |  |
