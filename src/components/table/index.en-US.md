---
group: Data Display
title: Table
description: A table displays rows of data.
---

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/toolbar.tsx">Toolbar</code>
<code src="./demo/value-type.tsx">Value Type</code>
<code src="./demo/row-selection.tsx">Selection</code>
<code src="./demo/row-selection-and-operation.tsx">Selection and operation</code>
<code src="./demo/row-selection-custom.tsx">Custom selection</code>
<code src="./demo/row-selection-debug.tsx" debug>Selection Perf</code>
<code src="./demo/head.tsx">Filter and sorter</code>
<code src="./demo/filter-value-type.tsx">Default filter</code>
<code src="./demo/filter-in-tree.tsx">Filter in Tree</code>
<code src="./demo/filter-search.tsx">Filter search</code>
<code src="./demo/multiple-sorter.tsx">Multiple sorter</code>
<code src="./demo/reset-filter.tsx">Reset filters and sorters</code>
<code src="./demo/custom-filter-panel.tsx">Customized filter panel</code>
<code src="./demo/request.tsx">Remote fetch</code>
<code src="./demo/sync-to-url.tsx">Sync data to url</code>
<code src="./demo/size.tsx">size</code>
<code src="./demo/narrow.tsx" debug>size</code>
<code src="./demo/vertical-line.tsx">vertical lines</code>
<code src="./demo/expand.tsx">Expandable Row</code>
<code src="./demo/order-column.tsx">Order Specific Column</code>
<code src="./demo/colspan-rowspan.tsx">colSpan and rowSpan</code>
<code src="./demo/tree-data.tsx">Tree data</code>
<code src="./demo/tree-table-ellipsis.tsx" debug>Tree data ellipsis debug demo</code>
<code src="./demo/fixed-header.tsx">Fixed Header</code>
<code src="./demo/fixed-columns.tsx">Fixed Columns</code>
<code src="./demo/fixed-gapped-columns.tsx">Stack Fixed Columns</code>
<code src="./demo/fixed-columns-header.tsx">Fixed Columns and Header</code>
<code src="./demo/hidden-columns.tsx">Hidden Columns</code>
<code src="./demo/grouping-columns.tsx">Grouping table head</code>
<code src="./demo/edit-row.tsx">Editable Rows</code>
<code src="./demo/nested-table.tsx">Nested tables</code>
<code src="./demo/drag-sorting.tsx">Drag sorting</code>
<code src="./demo/drag-column-sorting.tsx">Drag Column sorting</code>
<code src="./demo/resizable-column.tsx" debug>Resizable column</code>
<code src="./demo/ellipsis.tsx">ellipsis column</code>
<code src="./demo/ellipsis-custom-tooltip.tsx">ellipsis column custom tooltip</code>
<code src="./demo/custom-empty.tsx">Custom empty</code>
<code src="./demo/summary.tsx">Summary</code>
<code src="./demo/responsive.tsx">Responsive</code>
<code src="./demo/nest-table-border-debug.tsx" debug>Nested Bordered Table Debug</code>
<code src="./demo/pagination.tsx">Pagination Settings</code>
<code src="./demo/row-selection-custom-debug.tsx" debug>Custom selection group</code>
<code src="./demo/sticky.tsx">Fixed header and scroll bar with the page</code>
<code src="./demo/extra-content.tsx">Extra content</code>
<code src="./demo/dynamic-settings.tsx">Dynamic Settings</code>
<code src="./demo/selections-debug.tsx" debug>selections with icon</code>

## API

### Table

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| columns | Columns of table | [ColumnsType](#column)\[] | - |  |
| columnsState | Set props of column setting | [columnsState](#columnsstate) | - |  |
| components | Override default table elements | [TableComponents](https://github.com/metisjs/metis-ui/blob/main/src/components/table/interface.ts#L129) | - |  |
| dataSource | Data record array to be displayed | object\[] | - |  |
| editable | Config editable content | [editable](#editable) | - |  |
| expandable | Config expandable content | [expandable](#expandable) | - |  |
| extraRender | Render extra content | (currentDataSource: RecordType\[], action: TableActionType) => ReactNode | - |  |
| footer | Table footer renderer | function(currentPageData) | - |  |
| getPopupContainer | The render container of dropdowns in table | (triggerNode) => HTMLElement | () => TableHtmlElement |  |
| loading | Loading status of table | boolean, [Spin Props](/components/spin/#api) | false |  |
| locale | The i18n text including filter, sort, empty text, etc | object |  |  |
| pagination | Config of pagination. You can ref table pagination [config](#pagination) or full [`pagination`](/components/pagination/) document, hide it by setting it to `false` | object, `false` | - |  |
| rowHoverable | Row hover | boolean | true |  |
| rowKey | Row's unique key, could be a string or function that returns a string | string, function(record): string | `key` |  |
| rowSelection | Row selection [config](#rowselection) | object | - |  |
| scroll | Whether the table can be scrollable, [config](#scroll) | object | - |  |
| search | Config search content | [search](#search) | - |  |
| showHeader | Whether to show table header | boolean | true |  |
| showSorterTooltip | The header show next sorter direction tooltip. It will be set as the property of Tooltip if its type is object | boolean, [Tooltip props](/components/tooltip/#api) & `{target?: 'full-header', 'sorter-icon' }` | { target: 'full-header' } |  |
| size | Size of table | `default`, `middle`, `small` | `default` |  |
| sortDirections | Supported sort way, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] |  |
| sticky | Set sticky header and scroll bar | boolean, `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - |  |
| summary | Summary content | (currentData) => ReactNode | - |  |
| syncToUrl | Sync pagination、filter、sorter data to url | boolean, [syncToUrl](#synctourl) | - |  |
| tableLayout | The [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) attribute of table element | `auto`, `fixed` | `fixed` when header/columns are fixed, or using `column.ellipsis` |  |
| title | Table title renderer | function(currentPageData) | - |  |
| toolbar | Config toolbar content | [toolbar](#toolbar) | - |  |
| verticalLine | Whether to show all table borders | boolean | false |  |
| onChange | Callback executed when pagination, filters or sorter is changed | function(pagination, filters, sorter, extra: { currentDataSource: \[], action: `paginate`, `sort`, `filter` }) | - |  |
| onHeaderRow | Set props on per header row | function(columns, index) | - |  |
| onRow | Set props on per row | function(record, index) | - |  |
| onScroll | Triggered when the table body is scrolled. Note that only vertical scrolling will trigger the event when `virtual` | function(event) | - |  |

### Table ref

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| cancelEdit | When table is editable, to cancel edit | () => boolean |  |
| fullScreen | Set table fullscreen | () => void |  |
| nativeElement | The wrap element | HTMLDivElement |  |
| reload | Reload remote data | (resetPageIndex?: boolean) => void |  |
| scrollTo | Trigger to scroll to target position. `key` match with record `rowKey` | (config: { index?: number, key?: React.Key, top?: number }) => void |  |
| setDataSource | Set table data source | (data: TData\[] \| ((oldData: TData\[]) => TData\[] \| undefined)) => void |  |
| startEdit | When table is editable, to start edit | (key: Key) => boolean |  |

### Column

One of the Table `columns` prop for describing the table's columns.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Set the alignment of the column | `left`, `right`, `center` | `left` |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| colSpan | Merge header columns. Set to `0` to not render. | number | - |  |
| dataIndex | The path in the data item corresponding to the column data. Supports nested paths via arrays. | string, string\[] | - |  |
| editable | Editable column. Requires `Table.editable` to be enabled. | boolean, [editable](#column-editable) | - |  |
| ellipsis | Automatically truncate text that exceeds the width. Not compatible with sorting and filtering. <br />When set to `true` or `{ showTitle?: boolean }`, the table layout will become `tableLayout="fixed"`. | boolean, { showTitle?: boolean } | false |  |
| filter | Filter configuration | boolean, [filter](#column-filter) | - |  |
| fixed | Whether the column is fixed. `true` equivalent to `left`. | boolean, string | false |  |
| hidden | Hide the column | boolean | false |  |
| key | React key. If a unique `dataIndex` is already set, this property can be omitted. | Key | - |  |
| minWidth | Minimum column width, only effective when `tableLayout="auto"`. | number | - |  |
| render | Render function for complex data. Parameters are the current cell value, current row data, and row index. | function(value, record, index, action) {} | - |  |
| request | Remote data fetching method | [RequestConfig](/docs/remote-fetch) | - |  |
| responsive | Responsive breakpoint configuration list. If not set, the column will always be visible. | [Breakpoint](https://github.com/metisjs/metis-ui/blob/main/src/components/_util/responsiveObserver.ts#L1)\[] | - |  |
| rowScope | Set the column scope | `row`, `rowgroup` | - |  |
| search | Column search configuration | boolean, [search](#column-search) | - |  |
| shouldCellUpdate | Customize cell rendering timing | (record, prevRecord) => boolean | - |  |
| sorter | Sorting configuration | boolean, [sorter](#column-sorter) | - |  |
| title | Column header display text | ReactNode, ({ sortOrder, sortColumn, filters }) => ReactNode | - |  |
| valueEnum | Column value enumeration, automatically converts the value to a key to display the corresponding content. | [ValueEnum](/components/form/#valueenum) | - |  |
| valueType | Column value type, which generates different renderers. | [ValueValue](/components/form/#valuetype-list) | `text` |  |
| width | Column width | string, number | - |  |
| onCell | Set cell properties | function(record, rowIndex) | - |  |
| onHeaderCell | Set header cell properties | function(column) | - |  |

`valueType` supports multiple types. Refer to [here](https://github.com/metisjs/metis-ui/blob/main/src/components/table/interface.ts#L259) for details. You can use it like this:

```tsx
// valueType supports passing an object
const columns = {
  title: 'Amount',
  key: 'money',
  dataIndex: 'money',
  valueType: {
    type: 'money',
    precision: 4,
  },
};

// valueType supports passing a function
const columns = {
  title: 'Progress',
  key: 'progress',
  dataIndex: 'progress',
  valueType: (item: T) => ({
    type: 'progress',
    status: item.status !== 'error' ? 'active' : 'exception',
  }),
};
```

### ColumnGroup

| Property | Description               | Type      | Default |
| -------- | ------------------------- | --------- | ------- |
| title    | Title of the column group | ReactNode | -       |

### pagination

Properties for pagination.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| position | Specify the position of `Pagination`, could be`topLeft`, `topCenter`, `topRight`,`bottomLeft`, `bottomCenter`, `bottomRight` | Array | \[`bottomRight`] |

More about pagination, please check [`Pagination`](/components/pagination/).

### expandable

Properties for expandable.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| childrenColumnName | The column contains children to display | string | children |  |
| columnTitle | Set the title of the expand column | ReactNode | - |  |
| columnWidth | Set the width of the expand column | string, number | - |  |
| defaultExpandAllRows | Expand all rows initially | boolean | false |  |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - |  |
| expandedRowKeys | Current expanded row keys | string\[] | - |  |
| expandedRowRender | Expanded container render for each row | function(record, index, indent, expanded): ReactNode | - |  |
| expandIcon | Customize row expand Icon | function(props): ReactNode | - |  |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | false |  |
| fixed | Whether the expansion icon is fixed. | boolean, `left`, `right` | false |  |
| indentSize | Indent size in pixels of tree data | number | 15 |  |
| rowExpandable | Enable row can be expandable | (record) => boolean | - |  |
| showExpandColumn | Show expand column | boolean | true |  |
| onExpand | Callback executed when the row expand icon is clicked | function(expanded, record) | - |  |
| onExpandedRowsChange | Callback executed when the expanded rows change | function(expandedRows) | - |  |

### editable

Configuration for row editing, supporting properties related to [Form](/components/form/#form).

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionRender | Method to render actions in the editing state | string | (record: RecordType, defaultDoms: { save: ReactNode; cancel: ReactNode}) => ReactNode\[] |  |
| editingRowKey | The `rowKey` currently being edited | Key |  |  |
| onChange | Method triggered when the editing state changes | (editingRowKey?: Key, editingRecord?: RecordType) => void |  |  |
| onSave | Method to save the edited row data | (record: RecordType, index: number) => Promise |  |  |

### search

Configuration for the search functionality, supporting properties related to [Form](/components/form/#form).

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsed | Whether the search bar is collapsed | boolean | true |  |
| defaultCollapsed | Whether the search bar is collapsed by default | boolean | true |  |
| defaultItemsNumber | Number of search items displayed by default when collapsed | number | - |  |
| items | Search items | [FormItemConfig](/components/form/#itemtype) & { order?: number } | - |  |
| onCollapsedChange | Event triggered when the collapse button is clicked | (collapsed: boolean) => void | - |  |
| onSearch | Event triggered when the search button is clicked | (params: Record&lt;Key, any>) => void | - |  |

### toolbar

Configuration for the toolbar, supporting direct `ReactNode[]` type, which will be rendered as `actions`.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Action area | ReactNode\[] |  |  |
| options | Settings area | boolean, { fullScreen?: boolean, reload?: boolean, setting?: boolean } | - |  |
| optionsRender | Custom settings area | (defaultDom: ReactNode\[]) => ReactNode\[] | - |  |
| search | Query area | boolean, [InputProps](/components/input/#input) | - |  |

### rowSelection

Properties for row selection.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| cellRender | Renderer of the table cell. Same as `render` in column | function(checked, record, index, originNode) {} | - |  |
| checkStrictly | Check table row precisely; parent row and children rows are not associated | boolean | true |  |
| columnTitle | Set the title of the selection column | ReactNode, (originalNode: ReactNode) => ReactNode | - |  |
| columnWidth | Set the width of the selection column | string, number | `32px` |  |
| fixed | Fixed selection column on the left | boolean | - |  |
| getCheckboxProps | Get Checkbox or Radio props | function(record) | - |  |
| hideSelectAll | Hide the selectAll checkbox and custom selection | boolean | false |  |
| optionRender | Batch operation area rendering | ({ selectedRowKeys: Key\[], selectedRows: RecordType\[], clearSelected: () => void}) => ReactNode | - |  |
| preserveSelectedRowKeys | Keep selection `key` even when it removed from `dataSource` | boolean | - |  |
| selectedRowKeys | Controlled selected row keys | string\[], number\[] | \[] |  |
| selections | Custom selection [config](#selection), only displays default selections when set to `true` | object\[], boolean | - |  |
| type | `checkbox` or `radio` | `checkbox`, `radio` | `checkbox` |  |
| onCell | Set props on per cell. Same as `onCell` in column | function(record, rowIndex) | - |  |
| onChange | Callback executed when selected rows change | function(selectedRowKeys, selectedRows, info: { type }) | - |  |
| onSelect | Callback executed when select/deselect one row | function(record, selected, selectedRows, nativeEvent) | - |  |

### columnsState

Configuration for column settings.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| persistenceKey | The key for persisting columns, used to determine if it's the same table | `string, number` | - | - |
| persistenceType | The type of column persistence. `localStorage` persists even after closing the browser, while `sessionStorage` is lost when the browser is closed. | `localStorage, sessionStorage` | - | - |

### syncToUrl

Configuration for synchronizing parameters to the URL.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| navigateMode | Navigation mode | `push`, `replace` | push | - |
| parseOptions | Configuration for parsing strings to JSON | [ParseOptions](https://github.com/sindresorhus/query-string/blob/main/base.d.ts#L1) | - | - |
| stringifyOptions | Configuration for converting JSON to strings | [StringifyOptions](https://github.com/sindresorhus/query-string/blob/main/base.d.ts#L330) | - | - |

### scroll

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | Whether to scroll to the top of the table when paging, sorting, filtering changes | boolean | - |
| x | Set horizontal scrolling, can also be used to specify the width of the scroll area, could be number, percent value, true and ['max-content'](https://developer.mozilla.org/en-US/docs/Web/CSS/width#max-content) | string, number, true | - |
| y | Set vertical scrolling, can also be used to specify the height of the scroll area, could be string or number | string, number | - |

### Column Filter

Configuration for column filtering.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | Default filter value. | string\[] | - | - |
| dropdown | Custom filter menu. This function only renders the layer; interactions must be implemented manually. | ReactNode, (props: [FilterDropdownProps](https://github.com/metisjs/metis-ui/blob/main/src/components/table/interface.ts#L112)) => ReactNode | - | - |
| dropdownProps | Custom dropdown properties. | [DropdownProps](/components/dropdown#api) | - | - |
| filtered | Indicates whether the data has been filtered; highlights the filter icon. | boolean | false | - |
| icon | Custom filter icon. | ReactNode, (filtered: boolean) => ReactNode | false | - |
| items | Filter menu items for the column header. | object\[] | - | - |
| mode | Specifies the UI mode of the filter menu. | 'menu', 'tree' | 'menu' | - |
| multiple | Whether multiple selections are allowed. | boolean | true | - |
| resetToDefaultValue | Whether to reset to the default filter value when clicking the reset button. | boolean | false | - |
| search | Whether the filter menu items are searchable. | boolean, function(input, record): boolean | false | - |
| triggerOnClose | Whether to trigger filtering when the filter menu closes. | boolean | true | - |
| value | Controlled property for filtering, allowing external control over the column’s filter state. The value is an array of selected filter values. | Key, Key\[] | - | - |
| onFilter | Filtering function for local mode. | function | - | - |

---

### Column Sorter

Configuration for column sorting.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultOrder | Default sorting order. | `ascend`, `descend` | - | - |
| showTooltip | Displays a tooltip in the header indicating the next sorting order. Overrides `showSorterTooltip` in `table`. | boolean, [Tooltip props](/components/tooltip/#api) & `{target?: 'full-header', 'sorter-icon' }` | { target: 'full-header' } | - |
| directions | Supported sorting directions, overriding `sortDirections` in `Table`. | Array | \[`ascend`, `descend`] | - |
| compare | Sorting function for local sorting. It follows the [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) compareFunction. | function | - | - |
| order | Controlled property for sorting, allowing external control over column sorting. Accepts `ascend`, `descend`, or `null`. | `ascend`, `descend`, null | - | - |
| icon | Custom sort icon. | (props: { sortOrder }) => ReactNode | - | - |

---

### Column Editable

Configuration for column editing, supporting [FormItem](/components/form/#formitem) settings. It also allows passing a function:  
`function(form: FormInstance, record: RecordType, index: number) : boolean | EditConfig`.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| editorProps | Editor properties, with types depending on `valueType`. | - | - | - |
| editorRender | Custom editor renderer. | (form) => ReactNode | - | - |

---

### Column Search

Configuration for column searching, supporting [FormItem](/components/form-cn/#formitem) settings.

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| fieldProps | Form component properties, with types depending on `valueType`. | - | - | - |
| fieldRender | Custom renderer for the search field. | (form) => ReactNode | - | - |
| order | Sorting order of the search form item. | number | - | - |

### selection

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | ReactNode | - |
| onSelect | Callback executed when this selection is clicked | function(changeableRowKeys) | - |

#### onRow usage

Same as `onRow` `onHeaderRow` `onCell` `onHeaderCell`

```jsx
<Table
  onRow={(record, rowIndex) => {
    return {
      onClick: (event) => {}, // click row
      onDoubleClick: (event) => {}, // double click row
      onContextMenu: (event) => {}, // right button click row
      onMouseEnter: (event) => {}, // mouse enter row
      onMouseLeave: (event) => {}, // mouse leave row
    };
  }}
  onHeaderRow={(columns, index) => {
    return {
      onClick: () => {}, // click header row
    };
  }}
/>
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
