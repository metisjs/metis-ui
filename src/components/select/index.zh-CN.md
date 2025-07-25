---
title: Select
subtitle: 选择器
description: 下拉选择器。
group: 数据录入
demo:
  cols: 2
---

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 [Radio](/components/radio-cn/) 是更好的选择。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/search.tsx">带搜索框</code>
<code src="./demo/multiple.tsx">多选</code>
<code src="./demo/size.tsx">四种大小</code>
<code src="./demo/option-render.tsx">自定义下拉选项</code>
<code src="./demo/custom-display-render.tsx">定制回填内容</code>
<code src="./demo/search-sort.tsx">带排序的搜索</code>
<code src="./demo/tags.tsx">标签</code>
<code src="./demo/optgroup.tsx">分组</code>
<code src="./demo/coordinate.tsx">联动</code>
<code src="./demo/search-box.tsx">搜索框</code>
<code src="./demo/automatic-tokenization.tsx">自动分词</code>
<code src="./demo/request.tsx">请求远程数据</code>
<code src="./demo/request-lazy-load.tsx">请求远程数据,分页懒加载</code>
<code src="./demo/suffix.tsx" debug>后缀图标</code>
<code src="./demo/custom-dropdown-menu.tsx">扩展菜单</code>
<code src="./demo/hide-selected.tsx">隐藏已选择选项</code>
<code src="./demo/variant.tsx">多种形态</code>
<code src="./demo/custom-tag-render.tsx">自定义选择标签</code>
<code src="./demo/responsive.tsx">响应式 maxTagCount</code>
<code src="./demo/big-data.tsx">大数据</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/placement.tsx">弹出位置</code>
<code src="./demo/debug-flip-shift.tsx" iframe="200" debug>翻转+偏移</code>
<code src="./demo/styles-debug.tsx" debug>Style Debug</code>

## API

### Select props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean、 { clearIcon?: ReactNode } | false |  |
| autoClearSearchValue | 是否在选中项后清空搜索框，只在 `mode` 为 `multiple` 或 `tags` 时有效 | boolean | true |  |
| autoFocus | 默认获取焦点 | boolean | false |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| defaultActiveFirstOption | 是否默认高亮第一个选项 | boolean | true |  |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - |  |
| defaultValue | 指定默认选中的条目 | string、 string\[]、<br />number、 number\[]、 <br />Option、 Option\[] | - |  |
| disabled | 是否禁用 | boolean | false |  |
| displayRender | 选择后展示的渲染函数 | (selectedOption) => ReactNode | - |  |
| dropdownStyle | 下拉菜单的 style 属性 | CSSProperties | - |  |
| fieldNames | 自定义节点 label、value、options、groupLabel 的字段 | [FileNames](#filenames) | { label: `label`, value: `value`, options: `options`, groupLabel: `label` } |  |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | function(inputValue, option) | - |  |
| filterSort | 搜索时对筛选结果项的排序函数, 类似[Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)里的 compareFunction | (optionA: Option, optionB: Option) => number | - |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | function(triggerNode) | () => document.body |  |
| lazyLoad | 远程分页懒加载请求，仅使用 `request` 配置时有效, 如果开启 `showSearch` 将使用远程搜索 | boolean | false |  |
| listHeight | 设置弹窗滚动高度 | number | 224 |  |
| loading | 加载中状态 | boolean | false |  |
| maxTagCount | 最多显示多少个 tag，响应式模式会对性能产生损耗 | number、 `responsive` | - |  |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | ReactNode、 function(omittedValues) | - |  |
| maxTagTextLength | 最大显示的 tag 文本长度 | number | - |  |
| menuItemSelectedIcon | 自定义当前选中的条目图标 | ReactNode | - |  |
| mode | 设置 Select 的模式为多选或标签 | `multiple`、 `tags` | - |  |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | `Not Found` |  |
| open | 是否展开下拉菜单 | boolean | - |  |
| optionFilterProp | 搜索时过滤对应的 `option` 属性。若通过 `options` 属性配置选项内容。若通过 `request` 属性配置获取选项内容，`optionFilterProp` 将作为 filters 属性名传递给 request 方法 | string | `fieldNames.label` |  |
| optionRender | 自定义渲染下拉选项 | (option: FlattenOptionData\\&lt;BaseOption> , info: { index: number }) => React.ReactNode | - |  |
| options | 数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能 | { label, value }\[] | - |  |
| placeholder | 选择框默认文本 | string | - |  |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean、 number | true |  |
| popupRender | 自定义下拉框内容 | (originNode: ReactNode) => ReactNode | - |  |
| removeIcon | 自定义的多选框清除图标 | ReactNode | - |  |
| request | 远程获取 options 方法 | [RequestConfig](/docs/remote-fetch-cn) | - |  |
| searchValue | 控制搜索文本 | string | - |  |
| showSearch | 配置是否可搜索 | boolean | false |  |
| size | 选择框大小 | `large`、 `middle`、 `small` | `middle` |  |
| status | 设置校验状态 | 'error'、 'warning' | - |  |
| suffixIcon | 自定义的选择框后缀图标。以防止图标被用于其他交互，替换的图标默认不会响应展开、收缩事件，可以通过添加 `pointer-events: none` 样式透传。 | ReactNode | - |  |
| tagRender | 自定义 tag 内容 render，仅在 `mode` 为 `multiple` 或 `tags` 时生效 | (props) => ReactNode | - |  |
| tokenSeparators | 自动分词的分隔符，仅在 `mode="tags"` 时生效 | string\[] | - |  |
| value | 指定当前选中的条目，多选时为一个数组。（value 数组引用未变化时，Select 不会更新） | string、 string\[]、 <br />number、 number\[]、 <br />Option、 Option\[] | - |  |
| variant | 形态变体 | `outlined`、 `borderless`、 `filled` | `outlined` |  |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true |  |
| onBlur | 失去焦点时回调 | function | - |  |
| onChange | 选中 option，或 input 的 value 变化时，调用此函数 | function(value, option:Option、 Array&lt;Option>) | - |  |
| onClear | 清除内容时回调 | function | - |  |
| onDeselect | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 `multiple` 或 `tags` 模式下生效 | function(value: string、 number) | - |  |
| onFocus | 获得焦点时回调 | function | - |  |
| onInputKeyDown | 按键按下时回调 | function | - |  |
| onMouseEnter | 鼠标移入时回调 | function | - |  |
| onMouseLeave | 鼠标移出时回调 | function | - |  |
| onPopupOpenChange | 展开下拉菜单的回调 | function(open) | - |  |
| onPopupScroll | 下拉列表滚动时的回调 | function | - |  |
| onSearch | 文本框值变化时回调 | function(value: string) | - |  |
| onSelect | 被选中时调用，参数为选中项的 value (或 key) 值 | function(value: string、 number, option: Option) | - |  |

> 注意，如果发现下拉菜单跟随页面滚动，或者需要在其他弹层中触发 Select，请尝试使用 `getPopupContainer={triggerNode => triggerNode.parentElement}` 将下拉弹层渲染节点固定在触发器的父元素中。

#### FileNames

```ts
interface FileNames {
  value?: string;
  label?: string;
  groupLabel?: string;
  options?: string;
  disabled?: string;
}
```

### Select Methods

| 名称    | 说明     | 版本 |
| ------- | -------- | ---- |
| blur()  | 取消焦点 |      |
| focus() | 获取焦点 |      |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### `mode="tags"` 模式下为何搜索有时会出现两个相同选项？

这一般是 `options` 中的 `label` 和 `value` 不同导致的，你可以通过 `optionFilterProp="label"` 将过滤设置为展示值以避免这种情况。

### 点击 `popupRender` 里的元素，下拉菜单不会自动消失？

你可以使用受控模式，手动设置 `open` 属性。

### 反过来希望点击 `popupRender` 里元素不消失该怎么办？

Select 当失去焦点时会关闭下拉框，如果你可以通过阻止默认行为避免丢失焦点导致的关闭：

```tsx
<Select
  popupRender={() => (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      Some Content
    </div>
  )}
/>
```

### 自定义 Option 样式导致滚动异常怎么办？

这是由于虚拟滚动默认选项高度为 `36px`，如果你的选项高度小于该值则需要通过 `listItemHeight` 属性调整，而 `listHeight` 用于设置滚动容器高度：

```tsx
<Select listItemHeight={10} listHeight={250} />
```

注意：`listItemHeight` 和 `listHeight` 为内部属性，如无必要，请勿修改该值。

### 为何无障碍测试会报缺失 `aria-` 属性？

Select 无障碍辅助元素仅在弹窗展开时创建，因而当你在进行无障碍检测时请先打开下拉后再进行测试。对于 `aria-label` 与 `aria-labelledby` 属性缺失警告，请自行为 Select 组件添加相应无障碍属性。

Select 虚拟滚动会模拟无障碍绑定元素。如果需要读屏器完整获取全部列表，你可以设置 `virtual={false}` 关闭虚拟滚动，无障碍选项将会绑定到真实元素上。
