---
title: Transition
subtitle: 过渡动画
description: 允许您向有条件呈现的元素添加进入/离开过渡，使用 CSS 类来控制过渡不同阶段的实际过渡样式。
group: 其他
---

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">显示隐藏</code>
<code src="./demo/list.tsx">列表</code>

## API

### Transition

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterEnter | 状态切换的回调 | () => void | - |  |
| afterLeave | 状态切换的回调 | () => void | - |  |
| appear | 动画是否应在初始化时运行 | boolean | true |  |
| beforeEnter | 状态切换的回调 | () => void | - |  |
| beforeLeave | 状态切换的回调 | () => void | - |  |
| enter | `enter`阶段添加到元素`class`或`style` | string、 CSSProperties | - |  |
| enterFrom | `enter`阶段开始之前添加到元素`class`或`style` | string、 CSSProperties | - |  |
| enterTo | `enter`阶段开始后立即添加到元素`class`或`style` | string、 CSSProperties | - |  |
| leave | `leave`阶段添加到元素`class`或`style` | string、 CSSProperties | - |  |
| leaveFrom | `leave`阶段开始之前添加到元素`class`或`style` | string、 CSSProperties | - |  |
| leaveTo | `leave`阶段开始后立即添加到元素`class`或`style` | string、 CSSProperties | - |  |
| removeOnLeave | 根据显示状态是否应卸载或隐藏元素 | boolean | true | - |
| visible | 子元素应该显示还是隐藏 | boolean | - |  |
| onVisibleChanged | visible 切换的回调 | (visible: boolean) => void | - |  |

### TransitionList

继承 [Transition](#Transition) 的所有属性。

| 参数      | 说明                 | 类型                         | 默认值 | 版本 |
| --------- | -------------------- | ---------------------------- | ------ | ---- |
| component | wrapper component    | string、 React.ComponentType | div    |      |
| keys      | transition list keys | React.Key\[]                 | -      |      |
