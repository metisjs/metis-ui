import type * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { RequestConfig } from '../_util/type';
import type { SpinProps } from '../spin';
import type { VirtualListProps, VirtualListRef, VirtualType } from '../virtual-list';
import type { NodeDragEventParams, NodeMouseEventHandler, NodeMouseEventParams } from './context';

export interface CheckInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'check';
  node: EventDataNode<TreeDataType>;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: TreeDataType[];
  checkedNodesPositions?: { node: TreeDataType; pos: string }[];
  halfCheckedKeys?: Key[];
}

export interface AllowDropOptions<TreeDataType extends BasicDataNode = DataNode> {
  dragNode: TreeDataType;
  dropNode: TreeDataType;
  dropPosition: -1 | 0 | 1;
}
export type AllowDrop<TreeDataType extends BasicDataNode = DataNode> = (
  options: AllowDropOptions<TreeDataType>,
) => boolean;

export type DraggableFn = (node: DataNode) => boolean;
export type DraggableConfig = {
  icon?: React.ReactNode | boolean;
  nodeDraggable?: DraggableFn;
};

export type ExpandAction = false | 'click' | 'doubleClick';

export interface TreeProps<
  TreeDataType extends BasicDataNode = DataNode,
  LazyLoadType extends boolean = false,
> {
  prefixCls?: string;
  className?: SemanticClassName<'view', void, { node: TreeNodeProps['className'] }>;
  style?: React.CSSProperties;
  treeData?: TreeDataType[];
  fieldNames?: FieldNames<TreeDataType>;
  showLine?: boolean | 'hover';
  showIcon?: boolean;
  loading?: boolean | SpinProps;
  icon?: IconType;
  selectable?: boolean;
  expandAction?: ExpandAction;
  disabled?: boolean;
  multiple?: boolean;
  checkable?: boolean;
  checkStrictly?: boolean;
  draggable?: DraggableFn | boolean | DraggableConfig;
  autoExpandParent?: boolean;
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: Key[];
  expandedKeys?: Key[];
  defaultCheckedKeys?: Key[];
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  defaultSelectedKeys?: Key[];
  selectedKeys?: Key[];
  allowDrop?: AllowDrop<TreeDataType>;
  titleRender?: (node: TreeDataType) => React.ReactNode;
  dropIndicatorRender?: (props: {
    dropPosition: -1 | 0 | 1;
    dropLevelOffset: number;
    indent: number;
    prefixCls: string;
  }) => React.ReactNode;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: NodeMouseEventHandler<TreeDataType>;
  onDoubleClick?: NodeMouseEventHandler<TreeDataType>;
  onScroll?: VirtualListProps<FlattenNode, any>['onScroll'];
  onExpand?: (
    expandedKeys: Key[],
    info: {
      node: EventDataNode<TreeDataType>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => void;
  onCheck?: (
    checked: { checked: Key[]; halfChecked: Key[] } | Key[],
    info: CheckInfo<TreeDataType>,
  ) => void;
  onSelect?: (
    selectedKeys: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<TreeDataType>;
      selectedNodes: TreeDataType[];
      nativeEvent: MouseEvent;
    },
  ) => void;
  loadedKeys?: Key[];
  onMouseEnter?: (info: NodeMouseEventParams<TreeDataType>) => void;
  onMouseLeave?: (info: NodeMouseEventParams<TreeDataType>) => void;
  onRightClick?: (info: { event: React.MouseEvent; node: EventDataNode<TreeDataType> }) => void;
  onDragStart?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDragEnter?: (info: NodeDragEventParams<TreeDataType> & { expandedKeys: Key[] }) => void;
  onDragOver?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDragLeave?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDragEnd?: (info: NodeDragEventParams<TreeDataType>) => void;
  onDrop?: (
    info: NodeDragEventParams<TreeDataType> & {
      dragNode: EventDataNode<TreeDataType>;
      dragNodesKeys: Key[];
      dropPosition: number;
      dropToGap: boolean;
    },
  ) => void;
  switcherIcon?: IconType;

  virtual?: VirtualType;

  // >>> Request
  lazyLoad?: LazyLoadType;
  request?: GetRequestType<TreeDataType, LazyLoadType>;
}

export type TreeRef = {
  scrollTo: VirtualListRef['scrollTo'];
};

export interface TreeNodeProps<TreeDataType extends BasicDataNode = DataNode> {
  eventKey: Key; // Pass by parent `cloneElement`
  className?: SemanticClassName<
    'switcher' | 'content' | 'icon' | 'title',
    {
      selected?: boolean;
      checked?: boolean;
      halfChecked?: boolean;
      leaf?: boolean;
      expanded?: boolean;
    }
  >;
  style?: React.CSSProperties;
  id?: string;

  // By parent
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  loaded?: boolean;
  loading?: boolean;
  halfChecked?: boolean;
  title?: React.ReactNode | ((data: TreeDataType) => React.ReactNode);
  dragOver?: boolean;
  dragOverGapTop?: boolean;
  dragOverGapBottom?: boolean;
  pos: string;
  data: TreeDataType;
  isStart: boolean[];
  isEnd: boolean[];
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;

  // By user
  leaf?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  switcherIcon?: IconType;
  children?: React.ReactNode;
}

/** For fieldNames, we provides a abstract interface */
export interface BasicDataNode {
  checkable?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  selectable?: boolean;
  switcherIcon?: IconType;

  /** Set style of TreeNode. This is not recommend if you don't have any force requirement */
  className?: TreeNodeProps['className'];
  style?: React.CSSProperties;

  [key: string]: any;
}

/** Provide a wrap type define for developer to wrap with customize fieldNames data type */
export type FieldDataNode<T, ChildFieldName extends string = 'children'> = BasicDataNode &
  T &
  Partial<Record<ChildFieldName, FieldDataNode<T, ChildFieldName>[]>>;

export type Key = React.Key;

/**
 * Typescript not support `bigint` as index type yet.
 * We use this to mark the `bigint` type is for `Key` usage.
 * It's safe to remove this when typescript fix:
 * https://github.com/microsoft/TypeScript/issues/50217
 */
export type SafeKey = Exclude<Key, bigint>;

export type KeyEntities<DateType extends BasicDataNode = any> = Record<
  SafeKey,
  DataEntity<DateType>
>;

export type DataNode = FieldDataNode<{
  key: Key;
  title?: React.ReactNode | ((data: DataNode) => React.ReactNode);
}>;

export type EventDataNode<TreeDataType> = {
  key: Key;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  loaded: boolean;
  loading: boolean;
  halfChecked: boolean;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  pos: string;
} & TreeDataType &
  BasicDataNode;

export type IconType = React.ReactNode | ((props: TreeNodeProps) => React.ReactNode);

export type NodeElement = React.ReactElement<TreeNodeProps> & {
  selectHandle?: HTMLSpanElement;
  type: {
    isTreeNode: boolean;
  };
};

export interface Entity {
  node: NodeElement;
  index: number;
  key: Key;
  pos: string;
  parent?: Entity;
  children?: Entity[];
}

export interface DataEntity<TreeDataType extends BasicDataNode = DataNode>
  extends Omit<Entity, 'node' | 'parent' | 'children'> {
  node: TreeDataType;
  nodes: TreeDataType[];
  parent?: DataEntity<TreeDataType>;
  children?: DataEntity<TreeDataType>[];
  level: number;
}

export interface FlattenNode<TreeDataType extends BasicDataNode = DataNode> {
  parent: FlattenNode<TreeDataType> | null;
  children: FlattenNode<TreeDataType>[] | null;
  pos: string;
  data: TreeDataType;
  title: React.ReactNode;
  key: Key;
  isStart: boolean[];
  isEnd: boolean[];
  disabled?: boolean;
  leaf?: boolean;
}

export type GetKey<RecordType> = (record: RecordType, index?: number) => Key;

export type GetCheckDisabled<RecordType> = (record: RecordType) => boolean;

export interface FieldNames<TreeDataType extends BasicDataNode = DataNode> {
  title?: keyof TreeDataType;
  /** @private Internal usage for `tree-select`, safe to remove if no need */
  _title?: (keyof TreeDataType)[];
  key?: keyof TreeDataType;
  children?: keyof TreeDataType;
  leaf?: keyof TreeDataType;
  disabled?: keyof TreeDataType;
}

export interface FilledFieldNames {
  title: string;
  _title: string[];
  key: string;
  children: string;
  leaf: string;
  disabled: string;
}

export type GetRequestType<
  TreeDataType extends BasicDataNode = DataNode,
  LazyLoadType extends boolean = false,
> = LazyLoadType extends true
  ? RequestConfig<
      TreeDataType,
      [
        {
          [parentValue: string]: Key;
        },
        ...any[],
      ]
    >
  : RequestConfig<TreeDataType, any[]>;
