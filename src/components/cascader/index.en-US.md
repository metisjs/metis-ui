---
group: Data Entry
title: Cascader
description: Cascade selection box.
demo:
  cols: 2
---

## When To Use

- When you need to select from a set of associated data set. Such as province/city/district, company level, things classification.
- When selecting from a large data set, with multi-stage classifications separated for easy selection.
- Chooses cascade items in one float layer for better user experience.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/default-value.tsx">Default value</code>
<code src="./demo/hover.tsx">Hover</code>
<code src="./demo/disabled-option.tsx">Disabled option</code>
<code src="./demo/change-on-select.tsx">Change on select</code>
<code src="./demo/multiple.tsx">Multiple</code>
<code src="./demo/show-checked-strategy.tsx">ShowCheckedStrategy</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/custom-render.tsx">Custom render</code>
<code src="./demo/search.tsx">Search</code>
<code src="./demo/request.tsx">Remote fetch</code>
<code src="./demo/lazy.tsx">Load Options Lazily</code>
<code src="./demo/fields-name.tsx">Custom Field Names</code>
<code src="./demo/suffix.tsx" debug>Custom Icons</code>
<code src="./demo/custom-dropdown.tsx">Custom popup</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/status.tsx">Status</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean, { clearIcon?: ReactNode } | true |  |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `multiple` is `true` | boolean | true |  |
| autoFocus | If get focus when component mounted | boolean | false |  |
| changeOnSelect | (Work on single select) Change value on each selection if set to true, see above demo for details | boolean | false |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultValue | Initial selected value | string\[], number\[],string\[]\[], number\[]\[], [Option](#option)\[], [Option](#option)\[]\[] | \[] |  |
| disabled | Whether disabled select | boolean | false |  |
| displayRender | The render function of displaying selected options | (label, selectedOptions) => ReactNode | label => label.join(`/`) |  |
| expandIcon | Customize the current item expand icon | ReactNode | - |  |
| expandTrigger | expand current item when click or hover, one of `click` `hover` | string | `click` |  |
| fieldNames | Custom field name for label and value and children | object | { label: `label`, value: `value`, children: `children`, disabled: `disabled`, leaf: `leaf` } |  |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. | function(triggerNode) | () => document.body |  |
| lazyLoad | Remote laze load request, effective only when using the `request` configuration. if `showSearch` is true, will search by remote service | boolean | false |  |
| loadingIcon | The appearance of lazy loading (now is useless) | ReactNode | - |  |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number, `responsive` | - |  |
| maxTagPlaceholder | Placeholder for not showing tags | ReactNode, function(omittedValues) | - |  |
| maxTagTextLength | Max tag text length to show | number | - |  |
| multiple | Support multiple or not | boolean | - |  |
| notFoundContent | Specify content to show when no result matches | string | `Not Found` |  |
| open | Set visible of cascader popup | boolean | - |  |
| optionRender | Customize the rendering dropdown options | (option: Option) => React.ReactNode | - |  |
| options | The data options of cascade | [Option](#option)\[] | - |  |
| placeholder | The input placeholder | string | - |  |
| placement | Use preset popup align config from builtinPlacements | `bottomLeft` `bottomRight` `topLeft` `topRight` | `bottomLeft` |  |
| popupRender | Customize popup content | (menus: ReactNode) => ReactNode | - |  |
| removeIcon | The custom remove icon | ReactNode | - |  |
| request | Method to fetch remote options | [RequestConfig](#requestconfig) | - |  |
| searchValue | Set search value, Need work with `showSearch` | string | - |  |
| showCheckedStrategy | The way show selected item in box. ** `SHOW_CHILD`: ** just show child treeNode. **`Cascader.SHOW_PARENT`:** just show parent treeNode (when all child treeNode under the parent treeNode are checked) | `Cascader.SHOW_PARENT`, `Cascader.SHOW_CHILD` | `Cascader.SHOW_PARENT` |  |
| showSearch | Whether show search input in single mode | boolean | false |  |
| size | The input size | `large`, `middle`, `small` | - |  |
| status | Set validation status | 'error', 'warning' | - |  |
| style | The additional style | CSSProperties | - |  |
| suffixIcon | The custom suffix icon | ReactNode | - |  |
| tagRender | Custom render function for tags in `multiple` mode | (label: string, onClose: function, value: string) => ReactNode | - |  |
| value | The selected value | string\[], number\[],string\[]\[], number\[]\[], [Option](#option)\[], [Option](#option)\[]\[] | - |  |
| variant | Variants of selector | `outlined`, `borderless`, `filled` | `outlined` |  |
| onChange | Callback when finishing cascader select | (value, selectedOptions) => void | - |  |
| onPopupOpenChange | Callback when popup shown or hidden | (value) => void | - |  |
| onSearch | The callback function triggered when input changed | (search: string) => void | - |  |

### Option

```typescript
interface Option {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: Option[];
  // Determines if this is a leaf node(effective when `lazyLoad` is specified).
  // `false` will force trade TreeNode as a parent node.
  // Show expand icon even if the current node has no children.
  leaf?: boolean;
} ｜ Record<string, any>;
```

> Note: `Option` support `Record<string, any>`, which means you can customize any attributes, but need to configure it through `fieldNames`.

### RequestConfig

> The request property uses the useRequest hook from ahooks, so it supports all the parameters that useRequest does. For more information, you can refer to the [useRequest documentation](https://ahooks.js.org/hooks/use-request).

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
