---
group: 数据展示
title: Table
subtitle: 表格
description: 展示行列数据。
---

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/toolbar.tsx">工具栏</code>
<code src="./demo/value-type.tsx">值类型</code>
<code src="./demo/row-selection.tsx">可选择</code>
<code src="./demo/row-selection-and-operation.tsx">选择和操作</code>
<code src="./demo/row-selection-custom.tsx">自定义选择项</code>
<code src="./demo/row-selection-debug.tsx" debug>选择性能</code>
<code src="./demo/head.tsx">筛选和排序</code>
<code src="./demo/filter-value-type.tsx">默认筛选菜单</code>
<code src="./demo/filter-in-tree.tsx">树型筛选菜单</code>
<code src="./demo/filter-search.tsx">自定义筛选的搜索</code>
<code src="./demo/multiple-sorter.tsx">多列排序</code>
<code src="./demo/reset-filter.tsx">可控的筛选和排序</code>
<code src="./demo/custom-filter-panel.tsx">自定义筛选菜单</code>
<code src="./demo/search-form.tsx">表单搜索</code>
<code src="./demo/request.tsx">远程加载数据</code>
<code src="./demo/sync-to-url.tsx">同步状态到URL</code>
<code src="./demo/size.tsx">紧凑型</code>
<code src="./demo/narrow.tsx" debug>紧凑型</code>
<code src="./demo/vertical-line.tsx">带分隔线</code>
<code src="./demo/expand.tsx">可展开</code>
<code src="./demo/order-column.tsx">特殊列排序</code>
<code src="./demo/colspan-rowspan.tsx">表格行/列合并</code>
<code src="./demo/tree-data.tsx">树形数据展示</code>
<code src="./demo/tree-table-ellipsis.tsx" debug>树形数据省略情况测试</code>
<code src="./demo/tree-table-preserveSelectedRowKeys.tsx" debug>树形数据保留key测试</code>
<code src="./demo/fixed-header.tsx">固定表头</code>
<code src="./demo/fixed-columns.tsx">固定列</code>
<code src="./demo/fixed-gapped-columns.tsx">堆叠固定列</code>
<code src="./demo/fixed-columns-header.tsx">固定头和列</code>
<code src="./demo/hidden-columns.tsx" >隐藏列</code>
<code src="./demo/grouping-columns.tsx">表头分组</code>
<code src="./demo/edit-row.tsx">行编辑</code>
<code src="./demo/nested-table.tsx">嵌套子表格</code>
<code src="./demo/drag-sorting.tsx">拖拽排序</code>
<code src="./demo/drag-column-sorting.tsx">列拖拽排序</code>
<code src="./demo/resizable-column.tsx" debug>可伸缩列</code>
<code src="./demo/ellipsis.tsx">单元格自动省略</code>
<code src="./demo/ellipsis-custom-tooltip.tsx">自定义单元格省略提示</code>
<code src="./demo/custom-empty.tsx">自定义空状态</code>
<code src="./demo/summary.tsx">总结栏</code>
<code src="./demo/responsive.tsx">响应式</code>
<code src="./demo/nest-table-border-debug.tsx" debug>嵌套带边框的表格 Debug</code>
<code src="./demo/pagination.tsx">分页设置</code>
<code src="./demo/row-selection-custom-debug.tsx" debug>自定义选择项组</code>
<code src="./demo/sticky.tsx">随页面滚动的固定表头和滚动条</code>
<code src="./demo/extra-content.tsx">扩展内容展示</code>
<code src="./demo/dynamic-settings.tsx">动态控制表格属性</code>
<code src="./demo/selections-debug.tsx" debug>带下拉箭头的表头</code>

## API

### Table

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| columns | 表格列的配置描述，具体项见下表 | [ColumnsType](#column)\[] | - |  |
| columnsState | 配置列设置属性 | [columnsState](#columnsstate) | - |  |
| components | 覆盖默认的 table 元素 | [TableComponents](https://github.com/metisjs/metis-ui/blob/main/src/components/table/interface.ts#L129) | - |  |
| dataSource | 数据数组 | object\[] | - |  |
| editable | 配置行编辑属性 | [editable](#editable) | - |  |
| expandable | 配置展开属性 | [expandable](#expandable) | - |  |
| extraRender | 搜索表格中间区域的渲染 | (currentDataSource: RecordType\[], action: TableActionType) => ReactNode | - |  |
| getPopupContainer | 设置表格内各类浮层的渲染节点，如筛选菜单 | (triggerNode) => HTMLElement | () => TableHtmlElement |  |
| headerTitle | 表格标题 | ReactNode | - |  |
| loading | 页面是否加载中 | boolean、 [Spin Props](/components/spin-cn#api) | false |  |
| locale | 默认文案设置，目前包括排序、过滤、空数据文案 | object |  |  |
| pagination | 分页器，参考[配置项](#pagination)或 [pagination](/components/pagination-cn) 文档，设为 false 时不展示和进行分页 | object、 `false` | - |  |
| rowHoverable | 表格行是否开启 hover 交互 | boolean | false |  |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string、 function(record): string | `key` |  |
| rowSelection | 表格行是否可选择，[配置项](#rowselection) | object | - |  |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll) | object | - |  |
| search | 配置搜索表单属性 | [search](#search) | - |  |
| showHeader | 是否显示表头 | boolean | true |  |
| showSorterTooltip | 表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性 | boolean、 [Tooltip props](/components/tooltip-cn) & `{target?: 'full-header'、 'sorter-icon' }` | { target: 'full-header' } |  |
| size | 表格大小 | `default`、 `middle`、 `small` | `default` |  |
| sortDirections | 支持的排序方式，取值为 `ascend` `descend` | Array | \[`ascend`, `descend`] |  |
| sticky | 设置粘性头部和滚动条 | boolean、 `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - |  |
| summary | 总结栏 | (currentData) => ReactNode | - |  |
| syncToUrl | 同步分页、过滤、排序参数到URL | boolean、 [syncToUrl](#synctourl) | - |  |
| tableLayout | 表格元素的 [table-layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout) 属性，设为 `fixed` 表示内容不会影响列的布局 | `auto`、 `fixed` | 固定表头/列或使用了 `column.ellipsis` 时，默认值为 `fixed` |  |
| toolbar | 配置工具栏属性 | [toolbar](#toolbar) | - |  |
| verticalLine | 显示竖向分割线 | boolean | false |  |
| onChange | 分页、排序、筛选变化时触发 | function(pagination, filters, sorter, extra: { currentDataSource: \[], action: `paginate`、 `sort`、 `filter` }) | - |  |
| onHeaderRow | 设置头部行属性 | function(columns, index) | - |  |
| onRow | 设置行属性 | function(record, index) | - |  |
| onScroll | 表单内容滚动时触发 | function(event) | - |  |

### Table ref

| 参数 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| cancelEdit | 触发取消行编辑，仅使用 `editable` 时有效 | () => boolean |  |
| fullScreen | 表格全屏展示 | () => void |  |
| nativeElement | 最外层 div 元素 | HTMLDivElement |  |
| reload | 重新加载数据，仅使用 `request` 获取远程数据时有效 | (resetPageIndex?: boolean) => void |  |
| scrollTo | 滚动到目标位置（设置 `key` 时为 Record 对应的 `rowKey`） | (config: { index?: number, key?: Key, top?: number, align?: `start`、 `end`、 `center`, behavior?: `auto`、 `instant`、 `smooth` }) => void |  |
| setDataSource | 设置表格数据源 | (data: TData\[] \| ((oldData: TData\[]) => TData\[] \| undefined)) => void |  |
| startEdit | 触发行编辑，仅使用 `editable` 时有效 | (key: Key) => boolean |  |

### Column

列描述数据对象，是 columns 中的一项。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 设置列的对齐方式 | `left`、 `right`、 `center` | `left` |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| colSpan | 表头列合并，设置为 0 时，不渲染 | number | - |  |
| dataIndex | 列数据在数据项中对应的路径，支持通过数组查询嵌套路径 | string、 string\[] | - |  |
| editable | 可编辑列，需要开启 `Table.editable` | boolean、 [editable](#column-ediable) | - |  |
| ellipsis | 超过宽度将自动省略，暂不支持和排序筛选一起使用。<br />设置为 `true` 或 `{ showTitle?: boolean }` 时，表格布局将变成 `tableLayout="fixed"`。 | boolean、 { showTitle?: boolean } | false |  |
| filter | 筛选配置 | boolean、 [filter](#column-filter) | - |  |
| fixed | （列是否固定，可选 `true` (等效于 `left`) `left` `right` | boolean、 string | false |  |
| hidden | 隐藏列 | boolean | false |  |
| key | React 需要的 key，如果已经设置了唯一的 `dataIndex`，可以忽略这个属性 | Key | - |  |
| minWidth | 最小列宽度，只在 `tableLayout="auto"` 时有效 | number | - |  |
| render | 生成复杂数据的渲染函数，参数分别为当前单元格的值，当前行数据，行索引 | function(value, record, index, action) {} | - |  |
| request | 远程获取数据方法 | [RequestConfig](/docs/remote-fetch-cn) | - |  |
| responsive | 响应式 breakpoint 配置列表。未设置则始终可见。 | [Breakpoint](https://github.com/metisjs/metis-ui/blob/main/src/components/_util/responsiveObserver.ts#L1)\[] | - |  |
| rowScope | 设置列范围 | `row`、 `rowgroup` | - |  |
| search | 配置列的搜索 | boolean、 [search](#column-search) | - |  |
| shouldCellUpdate | 自定义单元格渲染时机 | (record, prevRecord) => boolean | - |  |
| sorter | 排序配置 | boolean、 [sorter](#column-sorter) | - |  |
| title | 列头显示文字 | ReactNode、 ({ sortOrder, sortColumn, filters }) => ReactNode | - |  |
| valueEnum | 列值枚举,会自动转化把值当成 key 来取出要显示的内容 | [ValueEnum](/components/form/#valueenum) | - |  |
| valueType | 列值类型，会生成不同的渲染器 | [ValueType](/components/form/#valuetype-列表) | `text` |  |
| width | 列宽度 | string、 number | - |  |
| onCell | 设置单元格属性 | function(record, rowIndex) | - |  |
| onHeaderCell | 设置头部单元格属性 | function(column) | - |  |

`valueType` 支持多种类型，可[参考](https://github.com/metisjs/metis-ui/blob/main/src/components/table/interface.ts#L259)。你可以这样使用：

```tsx
// valueType 支持传入 object
const columns = {
  title: '金额',
  key: 'money',
  dataIndex: 'money',
  valueType: {
    type: 'money',
    precision: 4,
  },
};

// valueType 支持传入 function
const columns = {
  title: '进度',
  key: 'progress',
  dataIndex: 'progress',
  valueType: (item: T) => ({
    type: 'progress',
    status: item.status !== 'error' ? 'active' : 'exception',
  }),
};
```

### ColumnGroup

| 参数  | 说明         | 类型      | 默认值 |
| ----- | ------------ | --------- | ------ |
| title | 列头显示文字 | ReactNode | -      |

### pagination

分页的配置项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 指定分页显示的位置， 取值为`topLeft`、 `topCenter`、 `topRight`、`bottomLeft`、 `bottomCenter`、 `bottomRight` | Array | \[`bottomRight`] |

更多配置项，请查看 [`Pagination`](/components/pagination-cn)。

### expandable

展开功能的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| childrenColumnName | 指定树形结构的列名 | string | children |  |
| columnTitle | 自定义展开列表头 | ReactNode | - |  |
| columnWidth | 自定义展开列宽度 | string、 number | - |  |
| defaultExpandAllRows | 初始时，是否展开所有行 | boolean | false |  |
| defaultExpandedRowKeys | 默认展开的行 | string\[] | - |  |
| expandedRowKeys | 展开的行，控制属性 | string\[] | - |  |
| expandedRowRender | 额外的展开行 | function(record, index, indent, expanded): ReactNode | - |  |
| expandIcon | 自定义展开图标 | function(props): ReactNode | - |  |
| expandRowByClick | 通过点击行来展开子行 | boolean | false |  |
| fixed | 控制展开图标是否固定，可选 `true` `left` `right` | boolean、 string | false |  |
| indentSize | 展示树形数据时，每层缩进的宽度，以 px 为单位 | number | 15 |  |
| rowExpandable | 设置是否允许行展开（`dataSource` 若存在 `children` 字段将不生效） | (record) => boolean | - |  |
| showExpandColumn | 是否显示展开图标列 | boolean | true |  |
| onExpand | 点击展开图标时触发 | function(expanded, record) | - |  |
| onExpandedRowsChange | 展开的行变化时触发 | function(expandedRows) | - |  |

### editable

行编辑功能的配置，支持[Form](/components/form-cn/#form)的相关属性。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actionRender | 编辑状态下事件渲染方法 | string | (record: RecordType, defaultDoms: { save: ReactNode; cancel: ReactNode}) => ReactNode\[] |  |
| editingRowKey | 正在编辑中的rowKey | Key |  |  |
| onChange | 行编辑状态变化方法 | (editingRowKey?: Key, editingRecord?: RecordType) => void |  |  |
| onSave | 保存行编辑数据方法 | (record: RecordType, index: number) => Promise |  |  |

### search

搜索功能的配置，支持[Form](/components/form-cn/#form)的相关属性。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| collapsed | 是否收起 | boolean | true |  |
| defaultCollapsed | 默认是否收起 | boolean | true |  |
| defaultItemsNumber | 收起状态下默认显示的搜索项数量 | number | - |  |
| items | 搜索项 | [FormItemConfig](/components/form-cn/#itemtype) & { order?: number } | - |  |
| onCollapsedChange | 收起按钮的事件 | (collapsed: boolean) => void | - |  |
| onSearch | 搜索按钮的事件 | (params: Record&lt;Key, any>) => void | - |  |

### toolbar

工具栏的配置，支持直接 `ReactNode[]` 类型，此时值会作业 `actions` 渲染。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 操作区 | ReactNode\[] |  |  |
| options | 设置区 | boolean、 { fullScreen?: boolean, reload?: boolean, setting?: boolean } | - |  |
| optionsRender | 自定义设置区 | (defaultDom: ReactNode\[]) => ReactNode\[] | - |  |
| search | 查询区 | boolean、 [InputProps](/components/input-cn/#input) | - |  |

### rowSelection

选择功能的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| cellRender | 渲染勾选框，用法与 Column 的 `render` 相同 | function(checked, record, index, originNode) {} | - |  |
| checkStrictly | checkable 状态下节点选择完全受控（父子数据选中状态不再关联） | boolean | true |  |
| columnTitle | 自定义列表选择框标题 | ReactNode、 (originalNode: ReactNode) => ReactNode | - |  |
| columnWidth | 自定义列表选择框宽度 | string、 number | `32px` |  |
| defaultSelectedRowKeys | 默认选中项的 key 数组 | string\[]、 number\[] | \[] |  |
| fixed | 把选择框列固定在左边 | boolean | - |  |
| getCheckboxProps | 选择框的默认属性配置 | function(record) | - |  |
| hideSelectAll | 隐藏全选勾选框与自定义选择项 | boolean | false |  |
| optionRender | 批量操作区渲染 | ({ selectedRowKeys: Key\[], selectedRows: RecordType\[], clearSelected: () => void}) => ReactNode | - |  |
| preserveSelectedRowKeys | 当数据被删除时仍然保留选项的 `key` | boolean | true |  |
| selectedRowKeys | 指定选中项的 key 数组，需要和 onChange 进行配合 | string\[]、 number\[] | \[] |  |
| selections | 自定义选择项 [配置项](#selection), 设为 `true` 时使用默认选择项 | object\[]、 boolean | true |  |
| type | 多选/单选 | `checkbox`、 `radio` | `checkbox` |  |
| onCell | 设置单元格属性，用法与 Column 的 `onCell` 相同 | function(record, rowIndex) | - |  |
| onChange | 选中项发生变化时的回调 | function(selectedRowKeys, selectedRows, info: { type }) | - |  |
| onSelect | 用户手动选择/取消选择某行的回调 | function(record, selected, selectedRows, nativeEvent) | - |  |

### columnsState

列设置功能的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| persistenceKey | 持久化列的 key，用于判断是否是同一个 table | `string、 number` | - |  |
| persistenceType | 持久化列的类型，localStorage 设置在关闭浏览器后也是存在的，sessionStorage 关闭浏览器后会丢失 | `localStorage、 sessionStorage` | - |  |

### syncToUrl

同步参数到URL的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| navigateMode | 跳转方式 | `push`、 `replace` | push |  |
| parseOptions | 字符串转JSON的配置 | [ParseOptions](https://github.com/sindresorhus/query-string/blob/main/base.d.ts#L1) | - |  |
| stringifyOptions | JSON转字符串的配置 | [StringifyOptions](https://github.com/sindresorhus/query-string/blob/main/base.d.ts#L330) |  |  |

### scroll

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否滚动到表格顶部 | boolean | - |
| x | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，`true` 和 ['max-content'](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width#max-content) | string、 number、 true | - |
| y | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | string、 number | - |

### column filter

列筛选配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认筛选值 | string\[] | - |  |
| dropdown | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互 | ReactNode、 (props: [FilterDropdownProps](https://github.com/metisjs/metis-ui/blob/main/src/components/table/interface.ts#L112)) => ReactNode | - |  |
| dropdownProps | 自定义下拉属性 | [DropdownProps](/components/dropdown-cn#api) | - |  |
| filtered | 标识数据是否经过过滤，筛选图标会高亮 | boolean | false |  |
| icon | 自定义 filter 图标。 | ReactNode、 (filtered: boolean) => ReactNode | false |  |
| items | 表头的筛选菜单项 | object\[] | - |  |
| mode | 指定筛选菜单的用户界面 | 'menu'、 'tree' | 'menu' |  |
| multiple | 是否多选 | boolean | true |  |
| resetToDefaultValue | 点击重置按钮的时候，是否恢复默认筛选值 | boolean | false |  |
| search | 筛选菜单项是否可搜索 | boolean、 function(input, record):boolean | false |  |
| triggerOnClose | 是否在筛选菜单关闭时触发筛选 | boolean | true |  |
| value | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组 | Key、 Key\[] | - |  |
| onFilter | 本地模式下，确定筛选的运行函数 | function | - |  |

### column sorter

列排序配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| compare | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)。 | function | - |  |
| defaultOrder | 默认排序顺序 | `ascend`、 `descend` | - |  |
| directions | 支持的排序方式，覆盖 `Table` 中 `sortDirections`， 取值为 `ascend` `descend` | Array | \[`ascend`, `descend`] |  |
| icon | 自定义 sort 图标 | (props: { sortOrder }) => ReactNode | - |  |
| order | 排序的受控属性，外界可用此控制列的排序，可设置为 `ascend` `descend` `null` | `ascend`、 `descend`、 null | - |  |
| showTooltip | 表头显示下一次排序的 tooltip 提示, 覆盖 table 中 `showSorterTooltip` | boolean、 [Tooltip props](/components/tooltip-cn/#api) & `{target?: 'full-header'、 'sorter-icon' }` | { target: 'full-header' } |  |

### column editable

列编辑配置, 支持[FormItem](/components/form-cn/#formitem)相关配置，也支持传入 `function(form: FormInstance, record: RecordType, index: number) : boolean | EditConfig`。

| 参数         | 说明                                  | 类型                | 默认值 | 版本 |
| ------------ | ------------------------------------- | ------------------- | ------ | ---- |
| editorProps  | 编辑器属性，类型根据 `valueType` 而定 |                     | -      |      |
| editorRender | 自定义渲染编辑器                      | (form) => ReactNode | -      |      |

### column search

列搜索配置, 支持[FormItem](/components/form-cn/#formitem)相关配置。

| 参数        | 说明                                    | 类型                | 默认值 | 版本 |
| ----------- | --------------------------------------- | ------------------- | ------ | ---- |
| fieldProps  | 表单组件属性，类型根据 `valueType` 而定 |                     | -      |      |
| fieldRender | 表单自定义渲染组件                      | (form) => ReactNode | -      |      |
| order       | 表单项排序                              | number              | -      |      |

### selection

| 参数     | 说明                       | 类型                        | 默认值 |
| -------- | -------------------------- | --------------------------- | ------ |
| key      | React 需要的 key，建议设置 | string                      | -      |
| text     | 选择项显示的文字           | ReactNode                   | -      |
| onSelect | 选择项点击回调             | function(changeableRowKeys) | -      |

#### onRow 用法

适用于 `onRow` `onHeaderRow` `onCell` `onHeaderCell`。

```jsx
<Table
  onRow={(record) => {
    return {
      onClick: (event) => {}, // 点击行
      onDoubleClick: (event) => {},
      onContextMenu: (event) => {},
      onMouseEnter: (event) => {}, // 鼠标移入行
      onMouseLeave: (event) => {},
    };
  }}
  onHeaderRow={(columns, index) => {
    return {
      onClick: () => {}, // 点击表头行
    };
  }}
/>
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
