## zh-CN

默认情况下 `onChange` 里只能拿到 `value`，如果需要拿到选中的节点所有值 `option`，可以使用 `optionInValue` 属性。

选中项的 `option` 会被包装到 `value` 中传递给 `onChange` 等函数，此时 `value` 是一个对象。

## en-US

As a default behavior, the `onChange` callback can only get the `value` of the selected item. The `optionInValue` prop can be used to get the `option` property of the selected item.

The `option` of the selected item will be packed as an object for passing to the `onChange` callback.
