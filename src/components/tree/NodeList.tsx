/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import omit from 'rc-util/lib/omit';
import { clsx, mergeSemanticCls } from '../_util/classNameUtils';
import type { ScrollTo, VirtualListProps, VirtualListRef, VirtualType } from '../virtual-list';
import VirtualList from '../virtual-list';
import type { BasicDataNode, FlattenNode, Key, KeyEntities, TreeNodeProps } from './interface';
import TreeNode from './TreeNode';
import { getKey, getTreeNodeProps } from './utils/treeUtil';

export interface NodeListRef {
  scrollTo: ScrollTo;
  getIndentWidth: () => number;
}

interface NodeListProps<TreeDataType extends BasicDataNode> {
  prefixCls: string;
  className?: TreeNodeProps['className'];
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
    style,
  } = props;

  // =============================== Ref ================================
  const listRef = React.useRef<VirtualListRef>(null);
  const indentMeasurerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    scrollTo: (scroll) => {
      listRef.current?.scrollTo(scroll);
    },
    getIndentWidth: () => indentMeasurerRef.current!.offsetWidth,
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
    <>
      <div
        className={clsx(`${prefixCls}-treenode`, 'flex')}
        aria-hidden
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          height: 0,
          overflow: 'hidden',
          border: 0,
          padding: 0,
        }}
      >
        <div className={clsx(`${prefixCls}-indent`, 'select-none self-stretch whitespace-nowrap')}>
          <div
            ref={indentMeasurerRef}
            className={clsx(`${prefixCls}-indent-unit`, 'relative inline-block h-full w-2')}
          />
        </div>
      </div>

      <VirtualList<FlattenNode>
        style={style}
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

          const mergedClassName = mergeSemanticCls(className, restProps.className);

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
    </>
  );
});

NodeList.displayName = 'NodeList';

export default NodeList;
