/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import omit from 'rc-util/lib/omit';
import type { VirtualListProps, VirtualListRef } from '../virtual-list';
import VirtualList from '../virtual-list';
import type {
  BasicDataNode,
  DataEntity,
  DataNode,
  FlattenNode,
  Key,
  KeyEntities,
  ScrollTo,
} from './interface';
import TransitionTreeNode from './TransitionTreeNode';
import { findExpandedKeys, getExpandRange } from './utils/diffUtil';
import { getKey, getTreeNodeProps } from './utils/treeUtil';

const HIDDEN_STYLE = {
  width: 0,
  height: 0,
  display: 'flex',
  overflow: 'hidden',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0,
};

const noop = () => {};

export const TRANSITION_KEY = `METIS_TREE_TRANSITION_${Math.random()}`;

const TransitionNode: DataNode = {
  key: TRANSITION_KEY,
};

export const TransitionEntity: DataEntity = {
  key: TRANSITION_KEY,
  level: 0,
  index: 0,
  pos: '0',
  node: TransitionNode,
  nodes: [TransitionNode],
};

const TransitionFlattenData: FlattenNode = {
  parent: null,
  children: [],
  pos: TransitionEntity.pos,
  data: TransitionNode,
  title: null,
  key: TRANSITION_KEY,
  /** Hold empty list here since we do not use it */
  isStart: [],
  isEnd: [],
};

export interface NodeListRef {
  scrollTo: ScrollTo;
  getIndentWidth: () => number;
}

interface NodeListProps<TreeDataType extends BasicDataNode> {
  prefixCls: string;
  style?: React.CSSProperties;
  data: FlattenNode<TreeDataType>[];
  focusable?: boolean;
  activeItem: FlattenNode<TreeDataType> | null;
  focused?: boolean;
  tabIndex: number;
  checkable?: boolean;
  selectable?: boolean;
  disabled?: boolean;

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
  height?: number;
  itemHeight?: number;
  virtual?: boolean;

  onScroll?: VirtualListProps<FlattenNode>['onScroll'];
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onActiveChange: (key: Key | null) => void;

  onListChangeStart: () => void;
  onListChangeEnd: () => void;
}

/**
 * We only need get visible content items to play the animation.
 */
export function getMinimumRangeTransitionRange(
  list: FlattenNode[],
  virtual: boolean,
  height?: number,
  itemHeight?: number,
) {
  if (virtual === false || !height || !itemHeight) {
    return list;
  }

  return list.slice(0, Math.ceil(height / itemHeight) + 1);
}

function itemKey(item: FlattenNode) {
  const { key, pos } = item;
  return getKey(key, pos);
}

function getAccessibilityPath(item: FlattenNode): string {
  let path = String(item.data.key);
  let current = item;

  while (current.parent) {
    current = current.parent;
    path = `${current.data.key} > ${path}`;
  }

  return path;
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
    disabled,

    dragging,
    dragOverNodeKey,
    dropPosition,

    height,
    itemHeight,
    virtual,

    focusable,
    activeItem,
    focused,
    tabIndex,

    onScroll,
    onContextMenu,
    onKeyDown,
    onFocus,
    onBlur,
    onActiveChange,

    onListChangeStart,
    onListChangeEnd,

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

  // ============================== Transition ==============================
  const [prevExpandedKeys, setPrevExpandedKeys] = React.useState(expandedKeys);
  const [prevData, setPrevData] = React.useState(data);
  const [transitionData, setTransitionData] = React.useState(data);
  const [transitionRange, setTransitionRange] = React.useState<FlattenNode<DataNode>[]>([]);
  const [transitionType, setTransitionType] = React.useState<'show' | 'hide' | null>(null);

  // When transition end but data change, this will makes data back to previous one
  const dataRef = React.useRef(data);
  dataRef.current = data;

  function onTransitionEnd() {
    const latestData = dataRef.current;

    setPrevData(latestData);
    setTransitionData(latestData);
    setTransitionRange([]);
    setTransitionType(null);

    onListChangeEnd();
  }

  // Do animation if expanded keys changed
  // layoutEffect here to avoid blink of node removing
  useLayoutEffect(() => {
    setPrevExpandedKeys(expandedKeys);

    const diffExpanded = findExpandedKeys(prevExpandedKeys, expandedKeys);

    if (diffExpanded.key !== null) {
      if (diffExpanded.add) {
        const keyIndex = prevData.findIndex(({ key }) => key === diffExpanded.key);

        const rangeNodes = getMinimumRangeTransitionRange(
          getExpandRange(prevData, data, diffExpanded.key),
          !!virtual,
          height,
          itemHeight,
        );

        const newTransitionData: FlattenNode[] = prevData.slice();
        newTransitionData.splice(keyIndex + 1, 0, TransitionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setTransitionType('show');
      } else {
        const keyIndex = data.findIndex(({ key }) => key === diffExpanded.key);

        const rangeNodes = getMinimumRangeTransitionRange(
          getExpandRange(data, prevData, diffExpanded.key),
          !!virtual,
          height,
          itemHeight,
        );

        const newTransitionData: FlattenNode[] = data.slice();
        newTransitionData.splice(keyIndex + 1, 0, TransitionFlattenData);

        setTransitionData(newTransitionData);
        setTransitionRange(rangeNodes);
        setTransitionType('hide');
      }
    } else if (prevData !== data) {
      // If whole data changed, we just refresh the list
      setPrevData(data);
      setTransitionData(data);
    }
  }, [expandedKeys, data]);

  // We should clean up transition if is changed by dragging
  React.useEffect(() => {
    if (!dragging) {
      onTransitionEnd();
    }
  }, [dragging]);

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
      {focused && activeItem && (
        <span style={HIDDEN_STYLE} aria-live="assertive">
          {getAccessibilityPath(activeItem)}
        </span>
      )}

      <div>
        <input
          style={HIDDEN_STYLE}
          disabled={focusable === false || disabled}
          tabIndex={focusable !== false ? tabIndex : undefined}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          value=""
          onChange={noop}
          aria-label="for screen reader"
        />
      </div>

      <div
        className={`${prefixCls}-treenode`}
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
        <div className={`${prefixCls}-indent`}>
          <div ref={indentMeasurerRef} className={`${prefixCls}-indent-unit`} />
        </div>
      </div>

      <VirtualList<FlattenNode>
        style={style}
        data={transitionData}
        itemKey={itemKey}
        height={height}
        fullHeight={false}
        virtual={virtual}
        itemHeight={itemHeight}
        prefixCls={`${prefixCls}-list`}
        ref={listRef}
        onVisibleChange={(originList) => {
          // The best match is using `fullList` - `originList` = `restList`
          // and check the `restList` to see if has the TRANSITION_KEY node
          // but this will cause performance issue for long list compare
          // we just check `originList` and repeat trigger `onTransitionEnd`
          if (originList.every((item) => itemKey(item) !== TRANSITION_KEY)) {
            onTransitionEnd();
          }
        }}
        onContextMenu={onContextMenu}
        onScroll={onScroll}
      >
        {(treeNode) => {
          const {
            pos,
            data: { ...restProps },
            title,
            key,
            isStart,
            isEnd,
          } = treeNode;
          const mergedKey = getKey(key, pos);

          const treeNodeProps = getTreeNodeProps(mergedKey, treeNodeRequiredProps);

          return (
            <TransitionTreeNode
              {...omit(restProps, ['key', 'children'])}
              {...treeNodeProps}
              title={title}
              active={!!activeItem && key === activeItem.key}
              pos={pos}
              data={treeNode.data}
              isStart={isStart}
              isEnd={isEnd}
              transitionNodes={key === TRANSITION_KEY ? transitionRange : undefined}
              transitionType={transitionType}
              onTransitionStart={onListChangeStart}
              onTransitionEnd={onTransitionEnd}
              treeNodeRequiredProps={treeNodeRequiredProps}
              onMouseMove={() => {
                onActiveChange(null);
              }}
            />
          );
        }}
      </VirtualList>
    </>
  );
});

NodeList.displayName = 'NodeList';

export default NodeList;
