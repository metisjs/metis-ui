import * as React from 'react';
import type {
  BasicDataNode,
  DataNode,
  EventDataNode,
  IconType,
  Key,
  KeyEntities,
} from './interface';
import type { DraggableConfig } from './Tree';

export type NodeMouseEventParams<
  TreeDataType extends BasicDataNode = DataNode,
  T = HTMLSpanElement,
> = {
  event: React.MouseEvent<T>;
  node: EventDataNode<TreeDataType>;
};
export type NodeDragEventParams<
  TreeDataType extends BasicDataNode = DataNode,
  T = HTMLDivElement,
> = {
  event: React.DragEvent<T>;
  node: EventDataNode<TreeDataType>;
};

export type NodeMouseEventHandler<
  TreeDataType extends BasicDataNode = DataNode,
  T = HTMLSpanElement,
> = (e: React.MouseEvent<T>, node: EventDataNode<TreeDataType>) => void;
export type NodeDragEventHandler<
  TreeDataType extends BasicDataNode = DataNode,
  T = HTMLDivElement,
> = (e: React.DragEvent<T>, node: EventDataNode<TreeDataType>, outsideTree?: boolean) => void;

export interface TreeContextProps<TreeDataType extends BasicDataNode = DataNode> {
  prefixCls: string;
  selectable: boolean;
  showIcon: boolean;
  icon: IconType;
  switcherIcon: IconType;
  draggable?: DraggableConfig;
  draggingNodeKey: Key | null;
  checkable: boolean;
  checkStrictly: boolean;
  disabled: boolean;
  keyEntities: KeyEntities;
  // for details see comment in Tree.state (Tree.tsx)
  dropLevelOffset: number | null;
  dropContainerKey: Key | null;
  dropTargetKey: Key | null;
  dropPosition: -1 | 0 | 1 | null;
  indent: number;
  dragOverNodeKey: Key | null;

  loadData?: (treeNode: EventDataNode<TreeDataType>) => Promise<void>;
  filterTreeNode?: (treeNode: EventDataNode<TreeDataType>) => boolean;
  titleRender?: (node: any) => React.ReactNode;

  onNodeClick: NodeMouseEventHandler<TreeDataType>;
  onNodeDoubleClick: NodeMouseEventHandler<TreeDataType>;
  onNodeExpand: NodeMouseEventHandler<TreeDataType>;
  onNodeSelect: NodeMouseEventHandler<TreeDataType>;
  onNodeCheck: (
    e: React.MouseEvent<HTMLSpanElement>,
    treeNode: EventDataNode<TreeDataType>,
    checked: boolean,
  ) => void;
  onNodeLoad: (treeNode: EventDataNode<TreeDataType>) => void;
  onNodeMouseEnter: NodeMouseEventHandler<TreeDataType>;
  onNodeMouseLeave: NodeMouseEventHandler<TreeDataType>;
  onNodeContextMenu: NodeMouseEventHandler<TreeDataType>;
  onNodeDragStart: NodeDragEventHandler<TreeDataType, HTMLDivElement>;
  onNodeDragEnter: NodeDragEventHandler<TreeDataType, HTMLDivElement>;
  onNodeDragOver: NodeDragEventHandler<TreeDataType, HTMLDivElement>;
  onNodeDragLeave: NodeDragEventHandler<TreeDataType, HTMLDivElement>;
  onNodeDragEnd: NodeDragEventHandler<TreeDataType, HTMLDivElement>;
  onNodeDrop: NodeDragEventHandler<TreeDataType, HTMLDivElement>;
}

export const TreeContext = React.createContext<TreeContextProps<any>>(null!);
