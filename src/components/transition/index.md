---
title: Transition
order: 3
group:
  title: 其他
  order: 6
---

# Transition 过渡动画

允许您向有条件呈现的元素添加进入/离开过渡，使用 CSS 类来控制过渡不同阶段的实际过渡样式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" >显示隐藏</code>

## API

### Transition

| 参数 | 说明                                   | 类型                | 默认值 | 版本 |
| ---- | -------------------------------------- | ------------------- | ------ | ---- |
| show | 子元素应该显示还是隐藏                 | boolean             | -      | -    |
| as   | 要代替 Transition 本身呈现的元素或组件 | string \| Component | `div`  | -    |

### Transition.Child

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ------ | ---- |
| -    | -    | -    | -      | -    |
