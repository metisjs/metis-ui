---
group: 数据展示
title: Tabs
subtitle: 标签页
description: 选项卡切换组件。
---

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

Metis UI 依次提供了三种选项卡，分别用于不同的场景。

- 卡片式的页签，提供可关闭的样式，常用于容器顶部。
- 通用的页签，既可用于容器顶部，也可用于容器内部，是最通用的 Tabs。
- 胶囊式的页签，提供可关闭的样式，可作为更次级的页签来使用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/disabled.tsx">禁用</code>
<code src="./demo/icon.tsx">图标</code>
<code src="./demo/custom-indicator.tsx">指示条</code>
<code src="./demo/slide.tsx">滑动</code>
<code src="./demo/extra.tsx">附加内容</code>
<code src="./demo/position.tsx">位置</code>
<code src="./demo/pills.tsx">胶囊式页签</code>
<code src="./demo/card.tsx" compact>卡片式页签</code>
<code src="./demo/size.tsx">大小</code>
<code src="./demo/editable.tsx">新增、关闭、重命名页签</code>
<code src="./demo/custom-add-trigger.tsx">自定义新增页签触发器</code>
<code src="./demo/custom-tab-bar.tsx">自定义页签头</code>
<code src="./demo/custom-tab-bar-node.tsx">可拖拽标签</code>
<code src="./demo/animated.tsx" debug>动画</code>
<code src="./demo/nest.tsx" debug>嵌套</code>

## API

### Tabs

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeKey | 当前激活 tab 面板的 key | Key | - |  |
| addable | 可新增页签 | boolean | `false` |  |
| animated | 是否使用动画切换 Tabs | boolean\| { indicator: boolean, tabPane: boolean } | { indicator: true, tabPane: false } |  |
| centered | 标签居中展示 | boolean | false |  |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |
| closable | 可关闭页签 | boolean | `false` |  |
| defaultActiveKey | 初始化选中面板的 key，如果没有设置 activeKey | Key | `第一个面板的 key` |  |
| destroyInactiveTabPane | 被隐藏时是否销毁 DOM 结构 | boolean | false |  |
| icons | 图标设置 | { add?: ReactNode; remove?: ReactNode; more?: ReactNode; } | - |  |
| indicator | 自定义指示条的长度和对齐方式 | { size?: number \| (origin: number) => number; align: `start` \| `center` \| `end`; } | - |  |
| items | 配置选项卡内容 | [TabItemType](#tabitemtype) | \[] |  |
| more | 自定义折叠菜单属性 | [MoreProps](/components/dropdown-cn#api) | - |  |
| renameAfterAdd | 新增后立即触发重命名事件，仅 `addable={true}` 且 `onAdd` 事件返回了新增页签的 `Key` 值时生效 | boolean | `true` |  |
| renderTabBar | 替换 TabBar，用于二次封装标签头 | (props: DefaultTabBarProps, DefaultTabBar: ComponentClass) => ReactElement | - |  |
| renderTabContextMenu | tab bar 上右键菜单 | (tab: TabItemType) => [MenuProps](/components/menu-cn#api) | - |  |
| size | 大小，提供 `default` `middle` 和 `small` 三种大小 | string | `default` |  |
| tabBarExtraContent | tab bar 上额外的元素 | ReactNode \| {left?: ReactNode, right?: ReactNode} | - |  |
| tabPosition | 页签位置，可选值有 `top` `right` `bottom` `left` | string | `top` |  |
| type | 页签的基本样式，可选 `line`、`card` `pills` 类型 | string | `line` |  |
| onAdd | 新增页签的回调，在 `addable={true}` 时有效 | (event: MouseEvent) => void \| string \| Promise&lt;string> | - |  |
| onChange | 切换面板的回调 | (activeKey: string) => void | - |  |
| onRemove | 关闭页签的回调，在 `closable={true}` 时有效 | (key: Key, event: MouseEvent) => void | - |  |
| onRename | 重命名确定后的回调 | (key: Key, name: string) => void | - |  |
| onTabClick | tab 被点击的回调 | (key: string, event: MouseEvent) => void | - |  |
| onTabScroll | tab 滚动时触发 | ({ direction: `left` \| `right` \| `top` \| `bottom` }) => void | - |  |

### TabItemType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |
| closable | 是否显示选项卡的关闭按钮，在 Tabs `closable={true}"` 时有效 | boolean | true |  |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | ReactNode | - |  |
| content | 选项卡头显示内容 | ReactNode | - |  |
| destroyInactiveTabPane | 被隐藏时是否销毁 DOM 结构 | boolean | false |  |
| disabled | 禁用某一项 | boolean | false |  |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean | false |  |
| icon | 选项卡头显示图标 | ReactNode | - |  |
| key | 对应 activeKey | Key | - |  |
| label | 选项卡头显示文字 | ReactNode | - |  |

### Tabs 方法

| 名称                    | 说明                                            |
| ----------------------- | ----------------------------------------------- |
| triggerRename(key: Key) | 触发重命名事件，仅当 `label` 为字符串类型时有效 |
