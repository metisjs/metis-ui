---
title: AutoComplete
subtitle: 自动完成
description: 输入框自动完成功能。
group:
  title: 数据录入
  order: 4
demo:
  cols: 2
---

## 何时使用

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

和 Select 的区别是：

- AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是辅助**输入**。
- Select 是在限定的可选项中进行选择，关键词是**选择**。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/options.tsx">自定义选项</code>
<code src="./demo/custom.tsx">自定义输入组件</code>
<code src="./demo/non-case-sensitive.tsx">不区分大小写</code>
<code src="./demo/certain-category.tsx">查询模式 - 确定类目</code>
<code src="./demo/uncertain-category.tsx">查询模式 - 不确定类目</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/variant.tsx">多种形态</code>
<code src="./demo/allow-clear.tsx">自定义清除按钮</code>
<code src="./demo/request.tsx">请求远程数据</code>
<code src="./demo/request-pagination.tsx">分页请求远程数据</code>
<code src="./demo/form-debug.tsx" debug>在 Form 中 Debug</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| { clearIcon?: ReactNode } | false |  |
| autoFocus | 自动获取焦点 | boolean | false |  |
| children | 自定义输入框 | HTMLInputElement \| HTMLTextAreaElement \| React.ReactElement&lt;InputProps> | &lt;Input /> |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| defaultActiveFirstOption | 是否默认高亮第一个选项 | boolean | true |  |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - |  |
| defaultValue | 指定默认选中的条目 | string | - |  |
| disabled | 是否禁用 | boolean | false |  |
| fieldNames | 自定义节点 label、value、options、groupLabel 的字段 | [FileNames](#filenames) | { label: `label`, value: `value`, options: `options`, groupLabel: `label` } |  |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | boolean \| function(inputValue, option) | true |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | function(triggerNode) | () => document.body |  |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | - |  |
| open | 是否展开下拉菜单 | boolean | - |  |
| optionFilterProp | 搜索时过滤对应的 `option` 属性。若通过 `options` 属性配置选项内容，建议设置 `optionFilterProp="label"` 来对内容进行搜索。若通过 `request` 属性配置获取选项内容，`optionFilterProp` 将作为 filters 属性名传递给 request 方法 | string | option:`value` \| request: `keyword` |  |
| options | 数据化配置选项内容 | { label, value }\[] | - |  |
| pagination | 远程分页请求，仅使用 `request` 配置时有效 | boolean | false |  |
| placeholder | 输入框提示 | string | - |  |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true |  |
| popupRender | 自定义下拉框内容 | (menus: ReactNode) => ReactNode | - |  |
| request | 远程获取 options 方法 | [RequestConfig](#requestconfig) | - |  |
| status | 设置校验状态 | 'error' \| 'warning' | - |  |
| value | 指定当前选中的条目 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onBlur | 失去焦点时的回调 | function() | - |  |
| onChange | 选中 option，或 input 的 value 变化时，调用此函数 | function(value) | - |  |
| onClear | 清除内容时的回调 | function | - |  |
| onFocus | 获得焦点时的回调 | function() | - |  |
| onPopupOpenChange | 展开下拉菜单的回调 | function(open) | - |  |
| onSearch | 搜索补全项的时候调用 | function(value) | - |  |
| onSelect | 被选中时调用，参数为选中项的 value 值 | function(value, option) | - |  |

#### FileNames

```ts
interface FileNames {
  value?: string | ((option: OptionType) => RawValueType);
  label?: string | ((option: OptionType) => React.ReactNode);
  groupLabel?: string | ((option: OptionType) => React.ReactNode);
  options?: string;
  disabled?: string | ((option: OptionType) => boolean);
}
```

#### RequestConfig

> request 使用 ahooks 的 [useRequest](https://ahooks.js.org/hooks/use-request)，因此支持所有 [useRequest](https://ahooks.js.org/hooks/use-request) 的参数。

```ts
export type RequestConfig<TData, ParamsType extends any[]> =
  | RequestService<{ data: TData[]; total?: number }, ParamsType>
  | {
      service: RequestService<{ data: TData[]; total?: number }, ParamsType>;
      options?: Omit<
        RequestOptions<{ data: TData[]; total?: number }, ParamsType>,
        'manual' | 'refreshDepsAction'
      >;
    };
```

## 方法

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### 为何受控状态下使用 onSearch 无法输入中文？

请使用 `onChange` 进行受控管理。`onSearch` 触发于搜索输入，与 `onChange` 时机不同。此外，点击选项时也不会触发 `onSearch` 事件。

### 为何 options 为空时，受控 open 展开不会显示下拉菜单？

AutoComplete 组件本质上是 Input 输入框的一种扩展，当 `options` 为空时，显示空文本会让用户误以为该组件不可操作，实际上它仍然可以进行文本输入操作。因此，为了避免给用户带来困惑，当 `options` 为空时，`open` 属性为 `true` 也不会展示下拉菜单，需要与 `options` 属性配合使用。
