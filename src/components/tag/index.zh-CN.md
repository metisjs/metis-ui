---
title: Tag
subtitle: 标签
description: 进行标记和分类的小标签。
group: 数据展示
demo:
  cols: 2
---

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/colorful.tsx">多彩标签</code>
<code src="./demo/control.tsx">动态添加和删除</code>
<code src="./demo/checkable.tsx">可选择标签</code>
<code src="./demo/icon.tsx">图标按钮</code>
<code src="./demo/status.tsx">预设状态的标签</code>
<code src="./demo/borderless.tsx">无边框</code>
<code src="./demo/draggable.tsx">可拖拽标签</code>

## API

### Tag

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否有边框 | boolean | true |  |
| className | 语义化结构 class | [SemanticDOM](#tag-1) | - |  |
| closable | 可关闭配置 | boolean、 ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| color | 标签色 | string | - |  |
| icon | 设置图标 | ReactNode | - |  |
| onClose | 关闭时的回调（可通过 `e.preventDefault()` 来阻止默认行为） | (e) => void | - |  |

### Tag.CheckableTag

| 参数      | 说明                 | 类型                              | 默认值 |
| --------- | -------------------- | --------------------------------- | ------ |
| checked   | 设置标签的选中状态   | boolean                           | false  |
| className | 语义化结构 class     | [SemanticDOM](#tagcheckabletag-1) | -      |
| onChange  | 点击标签时触发的回调 | (checked) => void                 | -      |

## Semantic DOM

### Tag

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Tag.CheckableTag

<code src="./demo/_semantic_checkable.tsx" simplify></code>
