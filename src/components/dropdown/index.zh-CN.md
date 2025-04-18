---
title: Dropdown
subtitle: 下拉菜单
description: 向下弹出的列表。
group: 导航
demo:
  cols: 2
---

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

- 用于收罗一组命令操作。
- Select 用于选择，而 Dropdown 是命令集合。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/placement.tsx">弹出位置</code>
<code src="./demo/arrow.tsx">箭头</code>
<code src="./demo/item.tsx">其他元素</code>
<code src="./demo/arrow-center.tsx">箭头指向</code>
<code src="./demo/trigger.tsx">触发方式</code>
<code src="./demo/event.tsx">触发事件</code>
<code src="./demo/dropdown-button.tsx">带下拉框的按钮</code>
<code src="./demo/custom-dropdown.tsx">扩展菜单</code>
<code src="./demo/sub-menu.tsx">多级菜单</code>
<code src="./demo/overlay-open.tsx">菜单隐藏方式</code>
<code src="./demo/context-menu.tsx">右键菜单</code>
<code src="./demo/loading.tsx">加载中状态</code>
<code src="./demo/selectable.tsx">菜单可选选择</code>
<code src="./demo/menu-full.tsx" debug>Menu 完整样式</code>
<code src="./demo/icon-debug.tsx" debug>Icon debug</code>

## API

属性如下

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| arrow | 下拉框箭头是否显示 | boolean、 { pointAtCenter: boolean } | false |  |
| autoAdjustOverflow | 下拉框被遮挡时自动调整位置 | boolean | true |  |
| autoDestroy | 关闭后是否销毁 Dropdown | boolean | false |  |
| autoFocus | 打开后自动聚焦下拉框 | boolean | false |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| disabled | 菜单是否禁用 | boolean | - |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| menu | 菜单配置项 | [MenuProps](/components/menu-cn#api) | - |  |
| open | 菜单是否显示 | boolean | - |  |
| placement | 菜单弹出位置：`bottom` `bottomLeft` `bottomRight` `top` `topLeft` `topRight` | string | `bottomLeft` |  |
| popupRender | 自定义下拉框内容 | (menus: ReactNode) => ReactNode | - |  |
| trigger | 触发下拉的行为, 移动端不支持 hover | Array&lt;`click`\|`hover`\|`contextMenu`> | \[`hover`] |  |
| onOpenChange | 菜单显示状态改变时调用，点击菜单按钮导致的消失不会触发。 | (open: boolean, info: { source: 'trigger'、 'menu' }) => void | - |  |

### Dropdown.Button

属性与 Dropdown 的相同。还包含以下属性：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| buttonsRender | 自定义左右两个按钮 | (buttons: ReactNode\[]) => ReactNode\[] | - |  |
| danger | 设置危险按钮 | boolean | - |  |
| icon | 右侧的 icon | ReactNode | - |  |
| loading | 设置按钮载入状态 | boolean、 { delay: number } | false |  |
| size | 按钮大小，和 [Button](/components/button-cn#api) 一致 | string | `default` |  |
| type | 按钮类型，和 [Button](/components/button-cn#api) 一致 | string | `default` |  |
| onClick | 点击左侧按钮的回调，和 [Button](/components/button-cn#api) 一致 | (event) => void | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## 注意

请确保 `Dropdown` 的子元素能接受 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。

## FAQ

### Dropdown 在水平方向超出屏幕时会被挤压该怎么办？

你可以通过 `width: max-content` 来解决这个问题。
