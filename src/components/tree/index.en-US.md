---
group: Data Display
title: Tree
description: Multiple-level structure list.
demo:
  cols: 2
---

## When To Use

Almost anything can be represented in a tree structure. Examples include directories, organization hierarchies, biological classifications, countries, etc. The `Tree` component is a way of representing the hierarchical relationship between these things. You can also expand, collapse, and select a treeNode within a `Tree`.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/basic-checkable.tsx">Checkable Tree</code>
<code src="./demo/basic-controlled.tsx">Controlled Tree</code>
<code src="./demo/draggable.tsx">draggable</code>
<code src="./demo/remote.tsx">load remote data</code>
<code src="./demo/dynamic.tsx">load data asynchronously</code>
<code src="./demo/search.tsx">Searchable</code>
<code src="./demo/line.tsx">Tree with line</code>
<code src="./demo/customized-icon.tsx">Customize Icon</code>
<code src="./demo/switcher-icon.tsx">Customize collapse/expand icon</code>
<code src="./demo/virtual-scroll.tsx">Virtual scroll</code>
<code src="./demo/drag-debug.tsx" debug>Drag Debug</code>
<code src="./demo/big-data.tsx" debug>Big data</code>
<code src="./demo/multiple-line.tsx" debug>Multiple lines</code>

## API

### Tree props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowDrop | Whether to allow dropping on the node | ({ dropNode, dropPosition }) => boolean | - |  |
| autoExpandParent | Whether to automatically expand a parent treeNode | boolean | true |  |
| checkable | Add a Checkbox before the treeNodes | boolean | false |  |
| checkedKeys | (Controlled) Specifies the keys of the checked treeNodes (PS: When this specifies the key of a treeNode which is also a parent treeNode, all the children treeNodes of will be checked; and vice versa, when it specifies the key of a treeNode which is a child treeNode, its parent treeNode will also be checked. When `checkable` and `checkStrictly` is true, its object has `checked` and `halfChecked` property. Regardless of whether the child or parent treeNode is checked, they won't impact each other | string\[] \| {checked: string\[], halfChecked: string\[]} | \[] |  |
| checkStrictly | Check treeNode precisely; parent treeNode and children treeNodes are not associated | boolean | false |  |
| defaultCheckedKeys | Specifies the keys of the default checked treeNodes | string\[] | \[] |  |
| defaultExpandAll | Whether to expand all treeNodes by default | boolean | false |  |
| defaultExpandedKeys | Specify the keys of the default expanded treeNodes | string\[] | \[] |  |
| defaultSelectedKeys | Specifies the keys of the default selected treeNodes | string\[] | \[] |  |
| disabled | Whether disabled the tree | boolean | false |  |
| draggable | Specifies whether this Tree or the node is draggable. Use `icon: false` to disable drag handler icon | boolean \| ((node: DataNode) => boolean) \| { icon?: React.ReactNode \| false, nodeDraggable?: (node: DataNode) => boolean } | false |  |
| expandedKeys | (Controlled) Specifies the keys of the expanded treeNodes | string\[] | \[] |  |
| fieldNames | Customize node title, key, children field name | object | { title: `title`, key: `key`, children: `children`, leaf: `leaf`， disabled: `disabled` } |  |
| filterTreeNode | Defines a function to filter (highlight) treeNodes. When the function returns `true`, the corresponding treeNode will be highlighted | function(node) | - |  |
| height | Config virtual scroll height. Will not support horizontal scroll when enable this | number | - |  |
| icon | Insert a custom icon before the title. Need to set `showIcon` to true | ReactNode \| (props) => ReactNode | - |  |
| loadedKeys | (Controlled) Set loaded tree nodes. Need work with `loadData` | string\[] | \[] |  |
| multiple | Allows selecting multiple treeNodes | boolean | false |  |
| selectable | Whether can be selected | boolean | true |  |
| selectedKeys | (Controlled) Specifies the keys of the selected treeNodes, multiple selection needs to set `multiple` to true | string\[] | - |  |
| showIcon | Controls whether to display the `icon` node, no default style | boolean | false |  |
| showLine | Shows a connecting line | boolean \| 'hover' | `hover` |  |
| switcherIcon | Customize expand/collapse icons for tree nodes (With default rotate angular style) | ReactNode \| ((props: AntTreeNodeProps) => ReactNode) | - |  |
| switcherLoadingIcon | Customize loading icons for tree nodes | ReactNode | - |  |
| titleRender | Customize tree node title render | (nodeData) => ReactNode | - |  |
| treeData | The treeNodes data Array. | array&lt;{ key, title, children, \[disabled, selectable] }> | - |  |
| virtual | Disable virtual scroll when set to false | boolean | true |  |
| onCheck | Callback function for when the onCheck event occurs | function(checkedKeys, e:{checked: boolean, checkedNodes, node, event, halfCheckedKeys}) | - |  |
| onDragEnd | Callback function for when the onDragEnd event occurs | function({event, node}) | - |  |
| onDragEnter | Callback function for when the onDragEnter event occurs | function({event, node, expandedKeys}) | - |  |
| onDragLeave | Callback function for when the onDragLeave event occurs | function({event, node}) | - |  |
| onDragOver | Callback function for when the onDragOver event occurs | function({event, node}) | - |  |
| onDragStart | Callback function for when the onDragStart event occurs | function({event, node}) | - |  |
| onDrop | Callback function for when the onDrop event occurs | function({event, node, dragNode, dragNodesKeys}) | - |  |
| onExpand | Callback function for when a treeNode is expanded or collapsed | function(expandedKeys, {expanded: boolean, node}) | - |  |
| onRightClick | Callback function for when the user right clicks a treeNode | function({event, node}) | - |  |
| onSelect | Callback function for when the user clicks a treeNode | function(selectedKeys, e:{selected: boolean, selectedNodes, node, event}) | - |  |
| request | Method to fetch remote options | `RequestConfig` | - |  |
| lazyLoad | Remote laze load request, effective only when using the `request` configuration. | boolean | false |  |
| className | Semantic DOM class | [SemanticClassName](/docs/semantic-classname) | - |  |
| expandAction | Directory open logic, optional: false \| `click` \| `doubleClick` | string \| boolean | `false` |

### TreeNode props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - |  |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false |  |
| disabled | Disables the treeNode | boolean | false |  |
| icon | Customize icon. When you pass component, whose render will receive full TreeNode props as component props | ReactNode \| (props) => ReactNode | - |  |
| leaf | Determines if this is a leaf node(effective when `request` is specified). `false` will force trade TreeNode as a parent node | boolean | - |  |
| key | Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys. P.S.: It must be unique in all of treeNodes of the tree | string | (internal calculated position of treeNode) |  |
| selectable | Set whether the treeNode can be selected | boolean | true |  |
| title | Title | ReactNode | `---` |  |
| className | Semantic DOM class | [SemanticClassName](/docs/semantic-classname) | - |  |

### Tree Methods

| Name | Description |
| --- | --- |
| scrollTo({ key: string \| number; align?: 'top' \| 'bottom' \| 'auto'; offset?: number }) | Scroll to key item in virtual scroll |
