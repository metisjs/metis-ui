---
group: 数据展示
title: Tree
subtitle: 树形控件
description: 多层次的结构列表。
demo:
  cols: 2
---

## 何时使用

文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用 `树控件` 可以完整展现其中的层级关系，并具有展开收起选择等交互功能。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/basic-controlled.tsx">受控操作示例</code>
<code src="./demo/draggable.tsx">拖动示例</code>
<code src="./demo/remote.tsx">远程数据加载</code>
<code src="./demo/dynamic.tsx">异步数据加载</code>
<code src="./demo/search.tsx">可搜索</code>
<code src="./demo/line.tsx">连接线</code>
<code src="./demo/customized-icon.tsx">自定义图标</code>
<code src="./demo/switcher-icon.tsx">自定义展开/折叠图标</code>
<code src="./demo/virtual-scroll.tsx">虚拟滚动</code>
<code src="./demo/drag-debug.tsx" debug>Drag Debug</code>
<code src="./demo/big-data.tsx" debug>大数据</code>
<code src="./demo/multiple-line.tsx" debug>多行</code>

## API

### Tree props

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowDrop | 是否允许拖拽时放置在该节点 | ({ dropNode, dropPosition }) => boolean | - |  |
| autoExpandParent | 是否自动展开父节点 | boolean | true |  |
| checkable | 节点前添加 Checkbox 复选框 | boolean | false |  |
| checkedKeys | （受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点 key，则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。当设置 `checkable` 和 `checkStrictly`，它是一个有`checked`和`halfChecked`属性的对象，并且父子节点的选中与否不再关联 | string\[] \| {checked: string\[], halfChecked: string\[]} | \[] |  |
| checkStrictly | checkable 状态下节点选择完全受控（父子节点选中状态不再关联） | boolean | false |  |
| defaultCheckedKeys | 默认选中复选框的树节点 | string\[] | \[] |  |
| defaultExpandAll | 默认展开所有树节点 | boolean | false |  |
| defaultExpandedKeys | 默认展开指定的树节点 | string\[] | \[] |  |
| defaultSelectedKeys | 默认选中的树节点 | string\[] | \[] |  |
| disabled | 将树禁用 | boolean | false |  |
| draggable | 设置节点可拖拽，可以通过 `icon: true` 开启拖拽提示图标 | boolean \| ((node: DataNode) => boolean) \| { icon?: React.ReactNode \| boolean, nodeDraggable?: (node: DataNode) => boolean } | false |  |
| expandedKeys | （受控）展开指定的树节点 | string\[] | \[] |  |
| fieldNames | 自定义节点 title、key、children 等字段 | object | { title: `title`, key: `key`, children: `children`, leaf: `leaf`， disabled: `disabled` } |  |
| height | 设置虚拟滚动容器高度，设置后内部节点不再支持横向滚动 | number | - |  |
| icon | 在标题之前插入自定义图标。需要设置 `showIcon` 为 true | ReactNode \| (props) => ReactNode | - |  |
| loadedKeys | （受控）已经加载的节点，需要配合 `loadData` 使用 | string\[] | \[] |  |
| multiple | 支持点选多个节点（节点本身） | boolean | false |  |
| selectable | 是否可选中 | boolean | true |  |
| selectedKeys | （受控）设置选中的树节点，多选需设置 `multiple` 为 true | string\[] | - |  |
| showIcon | 控制是否展示 `icon` 节点，没有默认样式 | boolean | false |  |
| showLine | 是否展示连接线 | boolean | false |  |
| switcherIcon | 自定义树节点的展开/折叠图标（带有默认 rotate 角度样式） | ReactNode \| ((props: AntTreeNodeProps) => ReactNode) | - |  |
| switcherLoadingIcon | 自定义树节点的加载图标 | ReactNode | - |  |
| titleRender | 自定义渲染节点 | (nodeData) => ReactNode | - |  |
| treeData | treeNodes 数据 | array&lt;{key, title, children, \[disabled, selectable]}> | - |  |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true |  |
| onCheck | 点击复选框触发 | function(checkedKeys, e:{checked: boolean, checkedNodes, node, event, halfCheckedKeys}) | - |  |
| onDragEnd | dragend 触发时调用 | function({event, node}) | - |  |
| onDragEnter | dragenter 触发时调用 | function({event, node, expandedKeys}) | - |  |
| onDragLeave | dragleave 触发时调用 | function({event, node}) | - |  |
| onDragOver | dragover 触发时调用 | function({event, node}) | - |  |
| onDragStart | 开始拖拽时调用 | function({event, node}) | - |  |
| onDrop | drop 触发时调用 | function({event, node, dragNode, dragNodesKeys}) | - |  |
| onExpand | 展开/收起节点时触发 | function(expandedKeys, {expanded: boolean, node}) | - |  |
| onRightClick | 响应右键点击 | function({event, node}) | - |  |
| onSelect | 点击树节点触发 | function(selectedKeys, e:{selected: boolean, selectedNodes, node, event}) | - |  |
| request | 远程获取 options 方法 | `RequestConfig` | - |  |
| lazyLoad | 懒加载，点击节点时加载，仅使用 `request` 配置时有效 boolean | false |  |
| className | 语义化结构 class | [SemanticClassName](#semanticclassname) | - |  |

### TreeNode props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checkable | 当树为 checkable 时，设置独立节点是否展示 Checkbox | boolean | - |  |
| disableCheckbox | 禁掉 checkbox | boolean | false |  |
| disabled | 禁掉响应 | boolean | false |  |
| icon | 自定义图标。可接收组件，props 为当前节点 props | ReactNode \| (props) => ReactNode | - |  |
| leaf | 设置为叶子节点 (设置了 `request` 时有效)。为 `false` 时会强制将其作为父节点 | boolean | - |  |
| key | 被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！ | string | (内部计算出的节点位置) |  |
| selectable | 设置节点是否可被选中 | boolean | true |  |
| title | 标题 | ReactNode | `---` |  |
| className | 语义化结构 class | [SemanticClassName](#semanticclassname) | - |  |

### SemanticClassName

```ts
type TreeNodeClassNameArg = {
  selected?: boolean;
  checked?: boolean;
  halfChecked?: boolean;
  leaf?: boolean;
  expanded?: boolean;
};

type TreeNodeClassName =
  | string
  | { root?: string; wrapper?: string; switcher?: string; content?: string; icon?: string }
  | ((
      arg: TreeNodeClassNameArg,
    ) =>
      | string
      | { root?: string; wrapper?: string; switcher?: string; content?: string; icon?: string });

type TreeClassName =
  | string
  | { root?: string; node?: TreeNodeClassName }
  | (() => string | { root?: string; node?: TreeNodeClassName });
```

### Tree 方法

| 名称 | 说明 |
| --- | --- |
| scrollTo({ key: string \| number; align?: 'top' \| 'bottom' \| 'auto'; offset?: number }) | 虚拟滚动下，滚动到指定 key 条目 |
