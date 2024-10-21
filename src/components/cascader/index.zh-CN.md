---
group: 数据录入
title: Cascader
subtitle: 级联选择
description: 级联选择框。
demo:
  cols: 2
---

## 何时使用

- 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。
- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。
- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/default-value.tsx">默认值</code>
<code src="./demo/hover.tsx">移入展开</code>
<code src="./demo/disabled-option.tsx">禁用选项</code>
<code src="./demo/change-on-select.tsx">选择即改变</code>
<code src="./demo/multiple.tsx">多选</code>
<code src="./demo/show-checked-strategy.tsx">自定义回填方式</code>
<code src="./demo/size.tsx">大小</code>
<code src="./demo/search.tsx">搜索</code>
<code src="./demo/request.tsx">请求远程数据</code>
<code src="./demo/lazy.tsx">动态加载选项</code>
<code src="./demo/fields-name.tsx">自定义字段名</code>
<code src="./demo/suffix.tsx" debug>自定义图标</code>
<code src="./demo/custom-dropdown.tsx">扩展菜单</code>
<code src="./demo/placement.tsx">弹出位置</code>
<code src="./demo/status.tsx">自定义状态</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| { clearIcon?: ReactNode } | true |  |
| autoClearSearchValue | 是否在选中项后清空搜索框，只在 `multiple` 为 `true` 时有效 | boolean | true |  |
| autoFocus | 自动获取焦点 | boolean | false |  |
| changeOnSelect | （单选时生效）当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的演示 | boolean | false |  |
| className | 语义化结构 class | string \| Record&lt;'root' \| 'popup' \| 'selector', string> | - |  |
| defaultValue | 默认的选中项 | string\[] \| number\[] \|string\[]\[] \| number\[]\[] \| [Option](#option)\[] \| [Option](#option)\[]\[] | \[] |  |
| disabled | 禁用 | boolean | false |  |
| displayRender | 选择后展示的渲染函数 | (labels, selectedOptions) => ReactNode | labels => labels.join(`/`) |  |
| displayRender | 选择后展示的渲染函数 | (selectedOption) => ReactNode | - |  |
| expandIcon | 自定义次级菜单展开图标 | ReactNode | - |  |
| expandTrigger | 次级菜单的展开方式，可选 'click' 和 'hover' | string | `click` |  |
| fieldNames | 自定义 options 中 label value children 的字段 | object | { label: `label`, value: `value`, children: `children`, disabled: `disabled`, leaf: `leaf` } |  |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | function(inputValue, option) | - |  |
| filterSort | 搜索时对筛选结果项的排序函数, 类似[Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)里的 compareFunction | (optionA: Option, optionB: Option) => number | - |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | function(triggerNode) | () => document.body |  |
| lazyLoad | 懒加载，点击节点时加载，仅使用 `request` 配置时有效，如果开启 `showSearch` 将使用远程搜索 | boolean | false |  |
| maxTagCount | 最多显示多少个 tag，响应式模式会对性能产生损耗 | number \| `responsive` | - |  |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | ReactNode \| function(omittedValues) | - |  |
| maxTagTextLength | 最大显示的 tag 文本长度 | number | - |  |
| multiple | 支持多选节点 | boolean | - |  |
| notFoundContent | 当下拉列表为空时显示的内容 | string | `Not Found` |  |
| open | 控制浮层显隐 | boolean | - |  |
| optionFilterProp | 搜索时过滤对应的 `option` 属性。若通过 `options` 属性配置选项内容。若通过 `request` 属性配置获取选项内容，`optionFilterProp` 将作为 filters 属性名传递给 request 方法 | string | `fieldNames.label` |  |
| optionRender | 自定义渲染下拉选项 | (option: Option) => React.ReactNode | - |  |
| options | 可选项数据源 | [Option](#option)\[] | - |  |
| placeholder | 输入框占位文本 | string | - |  |
| placement | 浮层预设位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | `bottomLeft` |  |
| popupRender | 自定义下拉框内容 | (menus: ReactNode) => ReactNode | - |  |
| removeIcon | 自定义的多选框清除图标 | ReactNode | - |  |
| request | 远程获取 options 方法 | [RequestConfig](#requestconfig) | - |  |
| searchValue | 设置搜索的值，需要与 `showSearch` 配合使用 | string | - |  |
| showCheckedStrategy | 定义选中项回填的方式。`Cascader.SHOW_CHILD`: 只显示选中的子节点。`Cascader.SHOW_PARENT`: 只显示父节点（当父节点下所有子节点都选中时）。 | `Cascader.SHOW_PARENT` \| `Cascader.SHOW_CHILD` | `Cascader.SHOW_PARENT` |  |
| showSearch | 在选择框中显示搜索框 | boolean | false |  |
| size | 输入框大小 | `large` \| `middle` \| `small` | - |  |
| status | 设置校验状态 | 'error' \| 'warning' | - |  |
| style | 自定义样式 | CSSProperties | - |  |
| suffixIcon | 自定义的选择框后缀图标 | ReactNode | - |  |
| tagRender | 自定义 tag 内容 render，仅在多选时生效 | ({ label: string, onClose: function, value: string }) => ReactNode | - |  |
| value | 指定选中项 | string\[] \| number\[] \|string\[]\[] \| number\[]\[] \| [Option](#option)\[] \| [Option](#option)\[]\[] | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onChange | 选择完成后的回调 | (value, selectedOptions) => void | - |  |
| onPopupOpenChange | 显示/隐藏浮层的回调 | (value) => void | - |  |
| onSearch | 监听搜索，返回输入的值 | (search: string) => void | - |  |

### Option

```typescript
interface Option {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: Option[];
  // 标记是否为叶子节点，设置了 `lazyLoad` 时有效
  // 设为 `false` 时会强制标记为父节点，即使当前节点没有 children，也会显示展开图标
  leaf?: boolean;
} ｜ Record<string, any>;
```

> 注意：`Option` 支持 `Record<string, any>`，因此可以自定义任意属性，但需要使用 `fieldNames` 进行配置。

### RequestConfig

> request 使用 ahooks 的 [useRequest](https://ahooks.js.org/hooks/use-request)，因此支持所有 [useRequest](https://ahooks.js.org/hooks/use-request) 的参数。

## 方法

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

> 注意，如果需要获得中国省市区数据，可以参考 [china-division](https://gist.github.com/afc163/7582f35654fd03d5be7009444345ea17)。
