---
title: Tooltip
subtitle: 文字提示
description: 简单的文字提示气泡框。
group: 数据展示
demo:
  cols: 2
---

## 何时使用

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 `title` 提示，提供一个 `按钮/文字/操作` 的文案解释。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/placement.tsx">位置</code>
<code src="./demo/arrow.tsx">箭头展示</code>
<code src="./demo/shift.tsx" iframe="200">贴边偏移</code>
<code src="./demo/auto-adjust-overflow.tsx" debug>自动调整位置</code>
<code src="./demo/destroy-tooltip-on-hide.tsx" debug>隐藏后销毁</code>
<code src="./demo/colorful.tsx">多彩文字提示</code>

## API

| 参数      | 说明             | 类型                         | 默认值 |
| --------- | ---------------- | ---------------------------- | ------ |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | -      |
| title     | 提示文字         | ReactNode、 () => ReactNode  | -      |

### 共同的 API

以下 API 为 Tooltip、Popconfirm、Popover 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 该值将合并到 placement 的配置中 | object | - |  |
| arrow | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean、 { pointAtCenter: boolean } | true |  |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | true |  |
| color | 背景颜色 | string | - |  |
| defaultOpen | 默认是否显隐 | boolean | false |  |
| destroyTooltipOnHide | 关闭后是否销毁 Tooltip | boolean | false |  |
| getPopupContainer | 浮层渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| mouseEnterDelay | 鼠标移入后延时多少才显示 Tooltip，单位：秒 | number | 0.1 |  |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | number | 0.1 |  |
| open | 用于手动控制浮层显隐 | boolean | false |  |
| overlayInnerStyle | 卡片内容区域的样式对象 | object | - |  |
| overlayStyle | 卡片样式 | object | - |  |
| placement | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | `top` |  |
| trigger | 触发行为，可选 `hover`、 `focus`、 `click`、 `contextMenu`，可使用数组设置多个触发行为 | string、 string\[] | `hover` |  |
| zIndex | 设置 Tooltip 的 `z-index` | number | - |  |
| onOpenChange | 显示隐藏的回调 | (open: boolean) => void | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## 注意

请确保 `Tooltip` 的子元素能接受 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。
