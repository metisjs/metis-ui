---
group: 数据展示
title: Tour
subtitle: 漫游式引导
description: 用于分步引导用户了解产品功能的气泡组件。
demo:
  cols: 2
---

## 何时使用

常用于引导用户了解产品功能。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/non-modal.tsx">非模态</code>
<code src="./demo/placement.tsx">位置</code>
<code src="./demo/mask.tsx">自定义遮罩样式</code>
<code src="./demo/indicator.tsx">自定义指示器</code>
<code src="./demo/gap.tsx">自定义高亮区域的样式</code>

## API

### Tour

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | `boolean`、 `{ pointAtCenter: boolean}` | `true` |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| closable | 可关闭配置 | boolean、 ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `true` |  |
| current | 当前处于哪一步 | `number` | - |  |
| defaultCurrent | 默认处于哪一步 | `number` | - |  |
| disabledInteraction | 禁用高亮区域交互 | `boolean` | `false` |  |
| gap | 控制高亮区域的圆角边框和显示间距 | `{ offset?: number、 [number, number]; radius?: number }` | `{ offset?: 6 ; radius?: 2 }` |  |
| getPopupContainer | 设置 Tour 浮层的渲染节点，默认是 body | `(node: HTMLElement) => HTMLElement` | body |  |
| indicatorsRender | 自定义指示器 | `(current: number, total: number) => ReactNode` | - |  |
| mask | 是否启用蒙层 | `boolean` | `true` |  |
| open | 打开引导 | `boolean` | - |  |
| placement | 引导卡片相对于目标元素的位置 | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数 | `boolean、 ScrollIntoViewOptions` | `true` |  |
| steps | 引导步骤 | [TourStepInfo\[\]](#tourstepinfo-引导步骤卡片) | - |  |
| type | 类型，影响底色与文字颜色 | `default`、 `primary` | `default` |  |
| zIndex | Tour 的层级 | number | 1001 |  |
| onChange | 步骤改变时的回调，current 为当前的步骤 | `(current: number) => void` | - |  |
| onClose | 关闭引导时的回调函数 | `Function` | - |  |
| onFinish | 引导完成时的回调 | `Function` | - |  |

### TourStepInfo 引导步骤卡片

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | `boolean`、 `{ pointAtCenter: boolean}` | `true` |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| closable | 可关闭配置 | boolean、 ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `true` |  |
| cover | 展示的图片或者视频 | `ReactNode` | - |  |
| description | 主要描述部分 | `ReactNode` | - |  |
| mask | 是否启用蒙层, 默认跟随 Tour 的 `mask` 属性 | `boolean` | `true` |  |
| nextButtonProps | 下一步按钮的属性 | [ButtonProps](/components/button-cn/#api) | - |  |
| placement | 引导卡片相对于目标元素的位置 | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` `bottom` |  |  |
| prevButtonProps | 上一步按钮的属性 | [ButtonProps](/components/button-cn/#api) | - |  |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数，默认跟随 Tour 的 `scrollIntoViewOptions` 属性 | `boolean、 ScrollIntoViewOptions` | `true` |  |
| target | 获取引导卡片指向的元素，为空时居中于屏幕 | `() => HTMLElement`、 `HTMLElement` | - |  |
| title | 标题 | `ReactNode` | - |  |
| type | 类型，影响底色与文字颜色 | `default`、 `primary` | `default` |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
