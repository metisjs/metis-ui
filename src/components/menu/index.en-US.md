---
title: Menu
description: A versatile menu for navigation.
group: Navigation
---

## When To Use

Navigation is an important part of any website, as a good navigation setup allows users to move around the site quickly and efficiently. Metis UI offers two navigation options: top and side. Top navigation provides all the categories and functions of the website. Side navigation provides the multi-level structure of the website.

More layouts with navigation: [Layout](/components/layout).

## Examples

<!-- prettier-ignore -->
<code src="./demo/horizontal.tsx">Top Navigation</code>
<code src="./demo/horizontal-dark.tsx" debug>Top Navigation (dark)</code>
<code src="./demo/inline.tsx">Inline menu</code>
<code src="./demo/inline-collapsed.tsx">Collapsed inline menu</code>
<code src="./demo/sider-current.tsx">Open current submenu only</code>
<code src="./demo/vertical.tsx">Vertical menu</code>
<code src="./demo/theme.tsx">Menu Themes</code>
<code src="./demo/submenu-theme.tsx">Sub-menu theme</code>
<code src="./demo/switch-mode.tsx">Switch the menu type</code>

## API

### Menu

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultOpenKeys | Array with the keys of default opened sub menus | string\[] | - |  |
| defaultSelectedKeys | Array with the keys of default selected menu items | string\[] | - |  |
| expandIcon | custom expand icon of submenu | ReactNode, `(props: SubMenuProps & { isSubMenu: boolean }) => ReactNode` | - |  |
| forceSubMenuRender | Render submenu into DOM before it becomes visible | boolean | false |  |
| inlineCollapsed | Specifies the collapsed status when menu is inline mode | boolean | - |  |
| inlineIndent | Indent (in pixels) of inline menu items on each level | number | 24 |  |
| items | Menu item content | [ItemType\[\]](#itemtype) | - | 4.20.0 |
| mode | Type of menu | `vertical`, `horizontal`, `inline` | `vertical` |  |
| multiple | Allows selection of multiple items | boolean | false |  |
| openKeys | Array with the keys of currently opened sub-menus | string\[] | - |  |
| overflowedIndicator | Customized the ellipsis icon when menu is collapsed horizontally | ReactNode | `<EllipsisOutlined />` |  |
| selectable | Allows selecting menu items | boolean | true |  |
| selectedKeys | Array with the keys of currently selected menu items | string\[] | - |  |
| style | Style of the root node | CSSProperties | - |  |
| subMenuCloseDelay | Delay time to hide submenu when mouse leaves (in seconds) | number | 0.1 |  |
| subMenuOpenDelay | Delay time to show submenu when mouse enters, (in seconds) | number | 0 |  |
| theme | Color theme of the menu | `light`, `dark` | `light` |  |
| triggerSubMenuAction | Which action can trigger submenu open/close | `hover`, `click` | `hover` |  |
| onClick | Called when a menu item is clicked | function({ item, key, keyPath, domEvent }) | - |  |
| onDeselect | Called when a menu item is deselected (multiple mode only) | function({ item, key, keyPath, selectedKeys, domEvent }) | - |  |
| onOpenChange | Called when sub-menus are opened or closed | function(openKeys: string\[]) | - |  |
| onSelect | Called when a menu item is selected | function({ item, key, keyPath, selectedKeys, domEvent }) | - |  |

### ItemType

> type ItemType = [MenuItemType](#MenuItemType), [SubMenuType](#SubMenuType), [MenuItemGroupType](#MenuItemGroupType), [MenuDividerType](#MenuDividerType);

#### MenuItemType

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| danger | Display the danger style | boolean | false |  |
| disabled | Whether menu item is disabled | boolean | false |  |
| icon | The icon of the menu item | ReactNode | - |  |
| key | Unique ID of the menu item | string | - |  |
| label | Menu label | ReactNode | - |  |
| title | Set display title for collapsed item | string | - |  |

#### SubMenuType

| Property | Description | Type | Default value | Version |  |
| --- | --- | --- | --- | --- | --- |
| children | Sub-menus or sub-menu items | [ItemType\[\]](#itemtype) | - |  |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |  |
| disabled | Whether sub-menu is disabled | boolean | false |  |  |
| icon | Icon of sub menu | ReactNode | - |  |  |
| key | Unique ID of the sub-menu | string | - |  |  |
| label | Menu label | ReactNode | - |  |  |
| popupOffset | Sub-menu offset, not working when `mode="inline"` | \[number, number] | - |  |  |
| theme | Color theme of the SubMenu (inherits from Menu by default) |  | `light`, `dark` | - |  |

#### MenuItemGroupType

Define `type` as `group` to make as group:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
};
```

| Param     | Description            | Type                              | Default value | Version |
| --------- | ---------------------- | --------------------------------- | ------------- | ------- |
| children  | Sub-menu items         | [MenuItemType\[\]](#menuitemtype) | -             |         |
| className | Semantic DOM class     | [SemanticDOM](#semantic-dom)      | -             |         |
| label     | The title of the group | ReactNode                         | -             |         |

#### MenuDividerType

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu. Need define the `type` as `divider`：

```ts
const dividerItem = {
  type: 'divider', // Must have
};
```

| Param  | Description            | Type    | Default value | Version |
| ------ | ---------------------- | ------- | ------------- | ------- |
| dashed | Whether line is dashed | boolean | false         |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### Why will Menu's children be rendered twice?

Menu collects structure info with [twice-render](https://github.com/react-component/menu/blob/f4684514096d6b7123339cbe72e7b0f68db0bce2/src/Menu.tsx#L543) to support HOC usage. Merging into one render may cause the logic to become much more complex. Contributions to help improve the collection logic are welcomed.

### Why Menu do not responsive collapse in Flex layout?

Menu will render fully item in flex layout and then collapse it. You need tell flex not consider Menu width to enable responsive:

```jsx
<div style={{ flex }}>
  <div style={{ ... }}>Some Content</div>
  <Menu style={{ minWidth: 0, flex: "auto" }} />
</div>
```
