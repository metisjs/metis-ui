---
title: Switch
subtitle: 开关
description: 开关选择器。
group: 数据录入
demo:
  cols: 2
---

## 何时使用

- 需要表示开关状态/两种状态之间的切换时；
- 和 `checkbox` 的区别是，切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/disabled.tsx">不可用</code>
<code src="./demo/text.tsx">文字和图标</code>
<code src="./demo/size.tsx">两种大小</code>
<code src="./demo/loading.tsx">加载中</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoFocus | 组件自动获取焦点 | boolean | false |  |
| checked | 指定当前是否选中 | boolean | false |  |
| checkedChildren | 选中时的内容 | ReactNode | - |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| defaultChecked | 初始是否选中 | boolean | false |  |
| defaultValue | `defaultChecked` 的别名 | boolean | - |  |
| disabled | 是否禁用 | boolean | false |  |
| loading | 加载中的开关 | boolean | false |  |
| size | 开关大小，可选值：`default` `small` | string | `default` |  |
| unCheckedChildren | 非选中时的内容 | ReactNode | - |  |
| value | `checked` 的别名 | boolean | - |  |
| onChange | 变化时的回调函数 | function(checked: boolean, event: Event) | - |  |
| onClick | 点击时的回调函数 | function(checked: boolean, event: Event) | - |  |

### 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
