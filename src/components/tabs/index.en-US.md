---
group: Data Display
title: Tabs
description: Tabs make it easy to explore and switch between different views.
---

### When To Use

Metis UI has 3 types of Tabs for different situations.

- Card Tabs: for managing too many closeable views.
- Normal Tabs: for functional aspects of a page.
- Pills Tabs: for secondary tabs.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/custom-indicator.tsx">Indicator</code>
<code src="./demo/slide.tsx">Slide</code>
<code src="./demo/extra.tsx">Extra content</code>
<code src="./demo/position.tsx">Position</code>
<code src="./demo/pills.tsx">Pills type tab</code>
<code src="./demo/card.tsx" compact>卡片式页签</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/editable.tsx">Add & close & rename tab</code>
<code src="./demo/custom-add-trigger.tsx">Customized trigger of new tab</code>
<code src="./demo/custom-tab-bar.tsx">Customized bar of tab</code>
<code src="./demo/custom-tab-bar-node.tsx">Draggable Tabs</code>
<code src="./demo/animated.tsx" debug>Animated</code>
<code src="./demo/nest.tsx" debug>Nest</code>

## API

### Tabs

<!-- prettier-ignore -->
|Property|Description|Type|Default|Version|
|---|---|---|---|---|
|activeKey|Current TabPane's key|Key|-||
|addable|Show add|boolean|`false`||
|animated|Whether to change tabs with animation.|boolean \| { indicator: boolean, tabPane: boolean }|{ indicator: true, tabPane: false }||
|centered|Centers tabs|boolean|false||
|className|Semantic DOM class|[SemanticClassName](/docs/semantic-classname)|-||
|closable|Show close button(x)|boolean|`false`||
|defaultActiveKey|Initial active TabPane's key, if `activeKey` is not set|Key|`The key of first tab`||
|destroyInactiveTabPane|Whether destroy inactive TabPane when change tab|boolean|`false`||
|icons|Custom icons|{ add?: ReactNode; close?: ReactNode; more?: ReactNode; }|-||
|indicator|Customize `size` and `align` of indicator|{ size?: number \| (origin: number) => number; align: `start` \| `center` \| `end`; }|-||
|items|Configure tab content|[TabItemType](#tabitemtype)|\[]||
|more|自定义折叠菜单属性|[MoreProps](/components/dropdown#api)|-||
|renameAfterAdd|Trigger rename after add event, Only works while `addable={true}` and `onAdd` event returns returns the key of the added tab..|boolean|`true`||
|renderTabBar|Replace the TabBar|(props: DefaultTabBarProps, DefaultTabBar: React.ComponentClass) => React.ReactElement|-||
|renderTabContextMenu|Render tab bar context menu|(tab: TabItemType) => [MenuProps](/components/menu#api)|-||
|size|Preset tab bar size|`default` \| `middle` \| `small`|`default`||
|tabBarExtraContent|Extra content in tab bar|ReactNode \| {left?: ReactNode, right?: ReactNode}|-||
|tabPosition|Position of tabs|`top` \| `right` \| `bottom` \| `left`|`top`||
|type|Basic style of tabs|`line` \| `card` \| `pills`|`line`||
|onAdd|Callback executed when tab is added. Only works while `addable={true}`|(event: MouseEvent) => void \| string \| Promise&lt;string>|-||
|onChange|Callback executed when active tab is changed|(activeKey: string) => void|-||
|onClose|Callback executed when tab is close. Only works while  `closable={true}`|(key: Key, event: MouseEvent) => void|-||
|onRename|Callback executed when tab is renamed|(key: Key, name: string) => void|-||
|onTabScroll|Trigger when tab scroll|({ direction: `left` \| `right` \| `top` \| `bottom` }) => void|-||

### TabItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticClassName](/docs/semantic-classname) | - |  |
| closable | Whether a close (x) button is visible, Only works while Tabs `closable={true}"` | boolean | true |  |
| closeIcon | Customize close icon in TabPane's head. close button will be hidden when setting to `null` or `false` | ReactNode | - |  |
| content | TabPane's head display content | ReactNode | - |  |
| destroyInactiveTabPane | Whether destroy inactive TabPane when change tab | boolean | false |  |
| disabled | Set TabPane disabled | boolean | false |  |
| forceRender | Forced render of content in tabs, not lazy render after clicking on tabs | boolean | false |  |
| icon | TabPane's head display icon | ReactNode | - |  |
| key | TabPane's key | Key | - |  |
| label | TabPane's head display text | ReactNode | - |  |

### Tabs methods

| 名称                    | 说明                                                         |
| ----------------------- | ------------------------------------------------------------ |
| triggerRename(key: Key) | Trigger tab rename event, Only works while `label` is string |
