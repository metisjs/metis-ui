## zh-CN

使用受控属性对筛选和排序状态进行控制。

> 1. columns 中定义了 `filter.filteredValue` 和 `sort.order` 属性即视为受控模式。
> 2. 只支持同时对一列进行排序，请保证只有一列的 `sort.order` 属性是生效的。
> 3. 务必指定 `column.key`。

## en-US

Control filters and sorters by `filter.filteredValue` and `sort.order`.

> 1. Defining `filter.filteredValue` or `sort.order` means that it is in the controlled mode.
> 2. Make sure `sort.order` is assigned for only one column.
> 3. `column.key` is required.
