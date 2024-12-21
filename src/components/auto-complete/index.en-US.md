---
title: AutoComplete
description: Autocomplete function of input field.
group:
  title: Data Entry
  order: 4
demo:
  cols: 2
---

## When To Use

- When you need an input box instead of a selector.
- When you need input suggestions or helping text.

The differences with Select are:

- AutoComplete is an input box with text hints, and users can type freely. The keyword is aiding **input**.
- Select is selecting among given choices. The keyword is **select**.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/options.tsx">Customized</code>
<code src="./demo/custom.tsx">Customize Input Component</code>
<code src="./demo/non-case-sensitive.tsx">Non-case-sensitive AutoComplete</code>
<code src="./demo/certain-category.tsx">Lookup-Patterns - Certain Category</code>
<code src="./demo/uncertain-category.tsx">Lookup-Patterns - Uncertain Category</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/variant.tsx">Variants</code>
<code src="./demo/allow-clear.tsx">Customize clear button</code>
<code src="./demo/request.tsx">Remote fetch</code>
<code src="./demo/request-pagination.tsx">Remote fetch with pagination</code>
<code src="./demo/form-debug.tsx" debug>Debug in Form</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| { clearIcon?: ReactNode } | false |  |
| autoFocus | If get focus when component mounted | boolean | false |  |
| children (for customize input element) | Customize input element | HTMLInputElement \| HTMLTextAreaElement \| React.ReactElement&lt;InputProps> | &lt;Input /> |  |
| children (for dataSource) | Data source to auto complete | React.ReactElement&lt;OptionProps> \| Array&lt;React.ReactElement&lt;OptionProps>> | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| defaultValue | Initial selected option | string | - |  |
| disabled | Whether disabled select | boolean | false |  |
| fieldNames | Customize node label, value, options，groupLabel field name | [FileNames](#filenames) | { label: `label`, value: `value`, options: `options`, groupLabel: `label` } |  |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| function(inputValue, option) | true |  |
| notFoundContent | Specify content to show when no result matches | ReactNode | - |  |
| open | Controlled open state of dropdown | boolean | - |  |
| optionFilterProp | Which prop value of option will be used for filter. If `options` is set, it should be set to `label`.If `request` is set, it will be pass to the request method. | string | option:`value` \| request: `keyword` |  |
| options | Select options. Will get better perf than jsx definition | { label, value }\[] | - |  |
| pagination | Remote pagination request, effective only when using the `request` configuration | boolean | false |  |
| placeholder | The placeholder of input | string | - |  |
| popupClassName | The className of dropdown menu | string | - |  |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true |  |
| request | Method to fetch remote options | [RequestConfig](#requestconfig) | - |  |
| status | Set validation status | 'error' \| 'warning' | - |  |
| value | Selected option | string | - |  |
| variant | Variants of input | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onBlur | Called when leaving the component | function() | - |  |
| onChange | Called when selecting an option or changing an input value | function(value) | - |  |
| onClear | Called when clear | function | - |  |
| onFocus | Called when entering the component | function() | - |  |
| onPopupOpenChange | Call when dropdown open | function(open) | - |  |
| onSearch | Called when searching items | function(value) | - |  |
| onSelect | Called when a option is selected. param is option's value and option instance | function(value, option) | - |  |

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

> The request property uses the useRequest hook from ahooks, so it supports all the parameters that useRequest does. For more information, you can refer to the [useRequest documentation](https://ahooks.js.org/hooks/use-request).

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

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### Why doesn't the text composition system work well with onSearch in controlled mode?

Please use `onChange` to manage control state. `onSearch` is used for searching input which is not the same as `onChange`. Besides, clicking on the option will not trigger the `onSearch` event.

### Why won't a controlled open AutoComplete display a drop-down menu when options are empty?

The AutoComplete component is essentially an extension of the Input form element. When the `options` property is empty, displaying empty text could mislead the user into believing the component is not operational, when in fact they are still able to input text. To avoid confusion, the `open` property will not display the drop-down menu when set to `true` and in combination with an empty `options` property. The `open` property must be used in conjunction with the `options` property.
