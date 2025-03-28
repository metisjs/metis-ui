---
title: Radio
subtitle: 单选框
description: 单选框。
group: 数据录入
demo:
  cols: 2
---

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## 代码演示

<!-- prettier-ignore-start -->

<code src="./demo/basic.tsx">基本</code>
<code src="./demo/disabled.tsx">不可用</code>
<code src="./demo/radiogroup.tsx">单选组合</code>
<code src="./demo/radiogroup-more.tsx">Radio.Group 垂直</code>
<code src="./demo/radiogroup-options.tsx">Radio.Group 组合 - 配置方式</code>
<code src="./demo/radiogroup-with-name.tsx">单选组合 - 配合 name 使用</code>

<!-- prettier-ignore-end -->

## API

### Radio

<!-- prettier-ignore -->
|参数|说明|类型|默认值||
|---|---|---|---|---|
|autoFocus|自动获取焦点|boolean|false||
|checked|指定当前是否选中|boolean|false||
|className|语义化结构 class|[SemanticDOM](#radio-2)|-||
|defaultChecked|初始是否选中|boolean|false||
|disabled|禁用 Radio|boolean|false||
|value|根据 value 进行比较，判断是否选中|any|-||

### Radio.Group

单选框组合，用于包裹一组 `Radio`。

<!-- prettier-ignore -->
|参数|说明|类型|默认值|版本||
|---|---|---|---|---|---|
|className|语义化结构 class|[SemanticDOM](#radiogroup-1)|-|||
|defaultValue|默认选中的值|any|-|||
|disabled|禁选所有子单选器|boolean|false|||
|name|RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性|string|-|||
|options|以配置形式设置子元素|string\[] \| number\[] \| Option\[]>|-|||
|value|用于设置当前选中的值|any|-|||
|onChange|选项变化时的回调函数|function(e:Event)|-|||

#### Option

```typescript
interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string | { root?: string; radio?: string };
}
```

### 方法

#### Radio

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## Semantic DOM

### Radio

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Radio.Group

<code src="./demo/_semantic_group.tsx" simplify></code>
