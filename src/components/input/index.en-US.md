---
title: Input
group:
  title: Data Entry
  order: 3
---

Through mouse or keyboard input content, it is the most basic form field wrapper.

## When To Use

- A user input in a form field is needed.
- A search input is required.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic usage</code>
<code src="./demo/size.tsx">Three sizes of Input</code>
<code src="./demo/addon.tsx">Pre / Post tab</code>
<code src="./demo/compact-style.tsx">Compact Style</code>
<code src="./demo/textarea.tsx">TextArea</code>
<code src="./demo/autosize-textarea.tsx">Autosizing the height to fit the content</code>
<code src="./demo/tooltip.tsx">Format Tooltip Input</code>
<code src="./demo/presuffix.tsx">prefix and suffix</code>
<code src="./demo/password-input.tsx">Password box</code>
<code src="./demo/allow-clear.tsx">With clear icon</code>
<code src="./demo/show-count.tsx">With character counting</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/variant.tsx">Variants</code>
<code src="./demo/focus.tsx">Focus</code>
<code src="./demo/styles-debug.tsx" debug>Style Debug</code>
<code src="./demo/textarea-resize-debug.tsx" debug>TextArea</code>

## API

### Input

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| addonAfter | The label text displayed after (on the right side of) the input field | ReactNode | - |  |
| addonBefore | The label text displayed before (on the left side of) the input field | ReactNode | - |  |
| allowClear | If allow to remove input content with clear icon | boolean \| { clearIcon: ReactNode } | false |  |
| bordered | Whether has border style | boolean | true |  |
| className | Semantic DOM class | string \|Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'count', string> | - |  |
| defaultValue | The initial input content | string | - |  |
| disabled | Whether the input is disabled | boolean | false |  |
| id | The ID for input | string | - |  |
| maxLength | The maximum number of characters in Input | number | - |  |
| prefix | The prefix icon for the Input | ReactNode | - |  |
| showCount | Whether to show character count | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => ReactNode } | false |  |
| status | Set validation status | 'error' \| 'warning' | - |  |
| size | The size of the input box. Note: in the context of a form, the `middle` size is used | `large` \| `middle` \| `small` | - |  |
| suffix | The suffix icon for the Input | ReactNode | - |  |
| type | The type of input, see: [MDN](https://developer.mozilla.org/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)( use `Input.TextArea` instead of `type="textarea"`) | string | `text` |  |
| value | The input content value | string | - |  |
| onChange | Callback when user input | function(e) | - |  |
| onPressEnter | The callback function that is triggered when Enter key is pressed | function(e) | - |  |

> When `Input` is used in a `Form.Item` context, if the `Form.Item` has the `id` props defined then `value`, `defaultValue`, and `id` props of `Input` are automatically set.

The rest of the props of Input are exactly the same as the original [input](https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes).

### Input.TextArea

Same as Input, and more:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoSize | Height auto size feature, can be set to true \| false or an object { minRows: 2, maxRows: 6 } | boolean \| object | false |  |
| className | Semantic DOM class | string \| Record<'root' \| 'textarea' \| 'count', string> | - |  |

The rest of the props of `Input.TextArea` are the same as the original [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

### Input.Password

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| iconRender | Custom toggle button | (visible) => ReactNode | (visible) => (visible ? &lt;EyeOutlined /> : &lt;EyeInvisibleOutlined />) |  |
| visibilityToggle | Whether show toggle button or control password visible | boolean \| [VisibilityToggle](#visibilitytoggle) | true |  |

#### VisibilityToggle

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| visible | Whether the password is show or hide | boolean | false |  |
| onVisibleChange | Callback executed when visibility of the password is changed | (visible) => void | - | 4.24.0 |

#### Input Methods

| Name | Description | Parameters | Version |
| --- | --- | --- | --- |
| blur | Remove focus | - |  |
| focus | Get focus | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) |  |

## FAQ

### Why Input lose focus when change `prefix/suffix/showCount`

When Input dynamic add or remove `prefix/suffix/showCount` will make React recreate the dom structure and new input will be not focused. You can set an empty `<span />` element to keep the dom structure:

```jsx
const suffix = condition ? <Icon type="smile" /> : <span />;

<Input suffix={suffix} />;
```

### Why TextArea in control can make `value` exceed `maxLength`?

When in control, component should show as what it set to avoid submit value not align with store value in Form.
