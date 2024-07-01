---
title: Input
subtitle: 输入框
description: 通过鼠标或键盘输入内容，是最基础的表单域的包装。
group:
  title: 数据录入
  order: 3
demo:
  cols: 2
---

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/size.tsx">三种大小</code>
<code src="./demo/addon.tsx">前置/后置标签</code>
<code src="./demo/compact-style.tsx">紧凑模式</code>
<code src="./demo/textarea.tsx">文本域</code>
<code src="./demo/autosize-textarea.tsx">适应文本高度的文本域</code>
<code src="./demo/tooltip.tsx">输入时格式化展示</code>
<code src="./demo/presuffix.tsx">前缀和后缀</code>
<code src="./demo/password-input.tsx">密码框</code>
<code src="./demo/allow-clear.tsx">带移除图标</code>
<code src="./demo/show-count.tsx">带字数提示</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/variant.tsx">变体</code>
<code src="./demo/focus.tsx">聚焦</code>
<code src="./demo/styles-debug.tsx" debug>Style Debug</code>
<code src="./demo/textarea-resize-debug.tsx" debug>文本域</code>

## API

### Input

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| addonAfter | 带标签的 input，设置后置标签 | ReactNode | - |  |
| addonBefore | 带标签的 input，设置前置标签 | ReactNode | - |  |
| allowClear | 可以点击清除图标删除内容 | boolean \| { clearIcon: ReactNode } | - |  |
| className | 语义化结构 class | string \|Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'count', string> | - |  |
| defaultValue | 输入框默认内容 | string | - |  |
| disabled | 是否禁用状态，默认为 false | boolean | false |  |
| id | 输入框的 id | string | - |  |
| maxLength | 最大长度 | number | - |  |
| prefix | 带有前缀图标的 input | ReactNode | - |  |
| showCount | 是否展示字数 | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => ReactNode } | false |  |
| status | 设置校验状态 | 'error' \| 'warning' | - |  |
| size | 控件大小。注：标准表单内的输入框大小限制为 `middle` | `large` \| `middle` \| `small` | - |  |
| suffix | 带有后缀图标的 input | ReactNode | - |  |
| type | 声明 input 类型，同原生 input 标签的 type 属性，见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#属性)(请直接使用 `Input.TextArea` 代替 `type="textarea"`) | string | `text` |  |
| value | 输入框内容 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onChange | 输入框内容变化时的回调 | function(e) | - |  |
| onPressEnter | 按下回车的回调 | function(e) | - |  |

> 如果 `Input` 在 `Form.Item` 内，并且 `Form.Item` 设置了 `id` 和 `options` 属性，则 `value` `defaultValue` 和 `id` 属性会被自动设置。

Input 的其他属性和 React 自带的 [input](https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes) 一致。

### Input.TextArea

同 Input 属性，外加：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：{ minRows: 2, maxRows: 6 } | boolean \| object | false |  |
| className | 语义化结构 class | string \| Record<'root' \| 'textarea' \| 'count', string> | - |  |

`Input.TextArea` 的其他属性和浏览器自带的 [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) 一致。

#### Input.Password

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| iconRender | 自定义切换按钮 | (visible) => ReactNode | (visible) => (visible ? &lt;EyeOutlined /> : &lt;EyeInvisibleOutlined />) |  |
| visibilityToggle | 是否显示切换按钮或者控制密码显隐 | boolean \| [VisibilityToggle](#visibilitytoggle) | true |  |

#### VisibilityToggle

| Property        | Description          | Type    | Default | Version |
| --------------- | -------------------- | ------- | ------- | ------- |
| visible         | 用于手动控制密码显隐 | boolean | false   |         |
| onVisibleChange | 显隐密码的回调       | boolean | -       |         |

#### Input Methods

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| blur | 取消焦点 | - |  |
| focus | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) |  |

## FAQ

### 为什么我动态改变 `prefix/suffix/showCount` 时，Input 会失去焦点？

当 Input 动态添加或者删除 `prefix/suffix/showCount` 时，React 会重新创建 DOM 结构而新的 input 是没有焦点的。你可以预设一个空的 `<span />` 来保持 DOM 结构不变：

```jsx
const suffix = condition ? <Icon type="smile" /> : <span />;

<Input suffix={suffix} />;
```

### 为何 TextArea 受控时，`value` 可以超过 `maxLength`？

受控时，组件应该按照受控内容展示。以防止在表单组件内使用时显示值和提交值不同的问题。
