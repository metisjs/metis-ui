/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import { mergeSemanticCls } from '@util/classNameUtils';
import omit from 'rc-util/es/omit';
import type { ScrollTo, VirtualListProps, VirtualListRef, VirtualType } from '../virtual-list';
import VirtualList from '../virtual-list';
import type { BasicDataNode, FlattenNode, Key, KeyEntities, TreeNodeProps } from './interface';
import TreeNode from './TreeNode';
import { getKey, getTreeNodeProps } from './utils/treeUtil';

export interface NodeListRef {
  scrollTo: ScrollTo;
}

interface NodeListProps<TreeDataType extends BasicDataNode> {
  prefixCls: string;
  className?: string;
  nodeClassName?: TreeNodeProps['className'];
  style?: React.CSSProperties;
  data: FlattenNode<TreeDataType>[];
  checkable?: boolean;
  selectable?: boolean;

  expandedKeys: Key[];
  selectedKeys: Key[];
  checkedKeys: Key[];
  loadedKeys: Key[];
  loadingKeys: Key[];
  halfCheckedKeys: Key[];
  keyEntities: KeyEntities;

  dragging: boolean;
  dragOverNodeKey: Key | null;
  dropPosition: number | null;

  // Virtual list
  virtual?: VirtualType;

  onScroll?: VirtualListProps<FlattenNode, any>['onScroll'];
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * We only need get visible content items to play the animation.
 */
export function getMinimumRangeTransitionRange(
  list: FlattenNode[],
  virtual: boolean,
  count: number,
) {
  if (!virtual) {
    return list;
  }

  return list.slice(0, count);
}

function itemKey(item: FlattenNode) {
  const { key, pos } = item;
  return getKey(key, pos);
}

const NodeList = React.forwardRef<NodeListRef, NodeListProps<any>>((props, ref) => {
  const {
    prefixCls,
    data,
    expandedKeys,
    selectedKeys,
    checkedKeys,
    loadedKeys,
    loadingKeys,
    halfCheckedKeys,
    keyEntities,

    dragOverNodeKey,
    dropPosition,

    virtual,

    onScroll,
    onContextMenu,

    className,
    nodeClassName,
    style,
  } = props;

  // =============================== Ref ================================
  const listRef = React.useRef<VirtualListRef>(null);

  React.useImperativeHandle(ref, () => ({
    scrollTo: (scroll) => {
      listRef.current?.scrollTo(scroll);
    },
  }));

  const treeNodeRequiredProps = {
    expandedKeys,
    selectedKeys,
    loadedKeys,
    loadingKeys,
    checkedKeys,
    halfCheckedKeys,
    dragOverNodeKey,
    dropPosition,
    keyEntities,
  };

  return (
    <VirtualList<FlattenNode>
      style={style}
      className={{ view: className }}
      data={data}
      itemKey={itemKey}
      virtual={!!virtual}
      prefixCls={`${prefixCls}-list`}
      ref={listRef}
      increaseViewportBy={100}
      onContextMenu={onContextMenu}
      onScroll={onScroll}
      renderItem={(treeNode) => {
        const {
          pos,
          data: { ...restProps },
          title,
          key,
          disabled,
          leaf,
          isStart,
          isEnd,
        } = treeNode;
        const mergedKey = getKey(key, pos);

        const treeNodeProps = getTreeNodeProps(mergedKey, treeNodeRequiredProps);

        const mergedClassName = mergeSemanticCls(nodeClassName, restProps.className);

        return (
          <TreeNode
            {...omit(restProps, ['key', 'children'])}
            {...treeNodeProps}
            className={mergedClassName}
            title={title}
            disabled={disabled}
            leaf={leaf}
            pos={pos}
            data={treeNode.data}
            isStart={isStart}
            isEnd={isEnd}
          />
        );
      }}
    />
  );
});

NodeList.displayName = 'NodeList';

export default NodeList;
