---
title: Checkbox
subtitle: 多选框
description: 收集用户的多项选择。
group: 数据录入
demo:
  cols: 2
---

## 何时使用

- 在一组可选项中进行多项选择时；
- 单独使用可以表示两种状态之间的切换，和 `switch` 类似。区别在于切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/disabled.tsx">不可用</code>
<code src="./demo/controller.tsx">受控的 Checkbox</code>
<code src="./demo/group.tsx">Checkbox 组</code>
<code src="./demo/check-all.tsx">全选</code>
<code src="./demo/layout.tsx">布局</code>

## API

### Checkbox

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoFocus | 自动获取焦点 | boolean | false |  |
| checked | 指定当前是否选中 | boolean | false |  |
| className | 语义化结构 class | [SemanticDOM](#checkbox-2) | - |  |
| defaultChecked | 初始是否选中 | boolean | false |  |
| disabled | 失效状态 | boolean | false |  |
| indeterminate | 设置 indeterminate 状态，只负责样式控制 | boolean | false |  |
| onChange | 变化时的回调函数 | (e: CheckboxChangeEvent) => void | - |  |

### Checkbox Group

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#checkbox-group-1) | - |  |
| defaultValue | 默认选中的选项 | (string、 number)\[] | \[] |  |
| disabled | 整组失效 | boolean | false |  |
| name | CheckboxGroup 下所有 `input[type="checkbox"]` 的 `name` 属性 | string | - |  |
| options | 指定可选项 | string\[]、 number\[]、 Option\[] | \[] |  |
| value | 指定选中的选项 | (string、 number、 boolean)\[] | \[] |  |
| onChange | 变化时的回调函数 | (checkedValue: CheckboxValueType\[]) => void | - |  |

#### Option

```typescript
interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string | { root?: string; checkbox?: string };
}
```

### 方法

#### Checkbox

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

## Semantic DOM

### Checkbox

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Checkbox Group

<code src="./demo/_semantic_group.tsx" simplify></code>
