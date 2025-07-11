---
title: Menu
subtitle: 导航菜单
description: 为页面和功能提供导航的菜单列表。
group: 导航
---

## 何时使用

导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。

更多布局和导航的使用可以参考：[通用布局](/components/layout-cn)。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/horizontal.tsx">顶部导航</code>
<code src="./demo/horizontal-dark.tsx" debug>顶部导航（dark）</code>
<code src="./demo/inline.tsx">内嵌菜单</code>
<code src="./demo/inline-collapsed.tsx">缩起内嵌菜单</code>
<code src="./demo/sider-current.tsx">只展开当前父级菜单</code>
<code src="./demo/vertical.tsx">垂直菜单</code>
<code src="./demo/theme.tsx">主题</code>
<code src="./demo/submenu-theme.tsx">子菜单主题</code>
<code src="./demo/switch-mode.tsx">切换菜单类型</code>

## API

### Menu

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| defaultOpenKeys | 初始展开的 SubMenu 菜单项 key 数组 | string\[] | - |  |
| defaultSelectedKeys | 初始选中的菜单项 key 数组 | string\[] | - |  |
| expandIcon | 自定义展开图标 | ReactNode、 `(props: SubMenuProps & { isSubMenu: boolean }) => ReactNode` | - |  |
| forceSubMenuRender | 在子菜单展示之前就渲染进 DOM | boolean | false |  |
| inlineCollapsed | inline 时菜单是否收起状态 | boolean | - |  |
| inlineIndent | inline 模式的菜单缩进宽度 | number | 24 |  |
| items | 菜单内容 | [ItemType\[\]](#itemtype) | - |  |
| mode | 菜单类型，现在支持垂直、水平、和内嵌模式三种 | `vertical`、 `horizontal`、 `inline` | `vertical` |  |
| multiple | 是否允许多选 | boolean | false |  |
| openKeys | 当前展开的 SubMenu 菜单项 key 数组 | string\[] | - |  |
| overflowedIndicator | 用于自定义 Menu 水平空间不足时的省略收缩的图标 | ReactNode | `<EllipsisOutlined />` |  |
| selectable | 是否允许选中 | boolean | true |  |
| selectedKeys | 当前选中的菜单项 key 数组 | string\[] | - |  |
| style | 根节点样式 | CSSProperties | - |  |
| subMenuCloseDelay | 用户鼠标离开子菜单后关闭延时，单位：秒 | number | 0.1 |  |
| subMenuOpenDelay | 用户鼠标进入子菜单后开启延时，单位：秒 | number | 0 |  |
| theme | 主题颜色 | `light`、 `dark` | `light` |  |
| triggerSubMenuAction | SubMenu 展开/关闭的触发行为 | `hover`、 `click` | `hover` |  |
| onClick | 点击 MenuItem 调用此函数 | function({ item, key, keyPath, domEvent }) | - |  |
| onDeselect | 取消选中时调用，仅在 multiple 生效 | function({ item, key, keyPath, selectedKeys, domEvent }) | - |  |
| onOpenChange | SubMenu 展开/关闭的回调 | function(openKeys: string\[]) | - |  |
| onSelect | 被选中时调用 | function({ item, key, keyPath, selectedKeys, domEvent }) | -   |  |

### ItemType

> type ItemType = [MenuItemType](#MenuItemType)、 [SubMenuType](#SubMenuType)、 [MenuItemGroupType](#MenuItemGroupType)、 [MenuDividerType](#MenuDividerType);

#### MenuItemType

| 参数      | 说明                     | 类型                         | 默认值 | 版本 |
| --------- | ------------------------ | ---------------------------- | ------ | ---- |
| className | 语义化结构 class         | [SemanticDOM](#semantic-dom) | -      |      |
| danger    | 展示错误状态样式         | boolean                      | false  |      |
| disabled  | 是否禁用                 | boolean                      | false  |      |
| icon      | 菜单图标                 | ReactNode                    | -      |      |
| key       | item 的唯一标志          | string                       | -      |      |
| label     | 菜单项标题               | ReactNode                    | -      |      |
| title     | 设置收缩时展示的悬浮标题 | string                       | -      |      |

#### SubMenuType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 子菜单的菜单项 | [ItemType\[\]](#itemtype) | - |  |
| className | 语义化结构 class | string、 Record&lt;'root'、 'icon'、 'title'、 'inner'、 "content"、 'popup', string> | - |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| disabled | 是否禁用 | boolean | false |  |
| icon | 菜单图标 | ReactNode | - |  |
| key | 唯一标志 | string | - |  |
| label | 菜单项标题 | ReactNode | - |  |
| popupOffset | 子菜单偏移量，`mode="inline"` 时无效 | \[number, number] | - |  |
| theme | 设置子菜单的主题，默认从 Menu 上继承 | `light`、 `dark` | - |  |
| onTitleClick | 点击子菜单标题 | function({ key, domEvent }) | - |  |

#### MenuItemGroupType

定义类型为 `group` 时，会作为分组处理:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
};
```

| 参数      | 说明             | 类型                              | 默认值 | 版本 |
| --------- | ---------------- | --------------------------------- | ------ | ---- |
| children  | 分组的菜单项     | [MenuItemType\[\]](#menuitemtype) | -      |      |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom)      | -      |      |
| label     | 分组标题         | ReactNode                         | -      |      |

#### MenuDividerType

菜单项分割线，只用在弹出菜单内，需要定义类型为 `divider`：

```ts
const dividerItem = {
  type: 'divider', // Must have
};
```

| 参数   | 说明     | 类型    | 默认值 | 版本 |
| ------ | -------- | ------- | ------ | ---- |
| dashed | 是否虚线 | boolean | false  |      |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### 为何 Menu 的子元素会渲染两次？

Menu 通过[二次渲染](https://github.com/react-component/menu/blob/f4684514096d6b7123339cbe72e7b0f68db0bce2/src/Menu.tsx#L543)收集嵌套结构信息以支持 HOC 的结构。合并成一个推导结构会使得逻辑变得十分复杂，欢迎 PR 以协助改进该设计。

### 在 Flex 布局中，Menu 没有按照预期响应式省略菜单？

Menu 初始化时会先全部渲染，然后根据宽度裁剪内容。当处于 Flex 布局中，你需要告知其预期宽度为响应式宽度：

```jsx
<div style={{ flex }}>
  <div style={{ ... }}>Some Content</div>
  <Menu style={{ minWidth: 0, flex: "auto" }} />
</div>
```
