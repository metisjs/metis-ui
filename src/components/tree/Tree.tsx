import * as React from 'react';
import { useSetState } from 'ahooks';
import { useEvent } from 'rc-util';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx } from '../_util/classNameUtils';
import type { RequestConfig } from '../_util/type';
import type { NodeDragEventHandler, NodeMouseEventHandler } from './context';
import { TreeContext } from './context';
import useDraggableConfig from './hooks/useDraggableConfig';
import useFilledProps from './hooks/useFilledProps';
import useRequest from './hooks/useRequest';
import type {
  BasicDataNode,
  CheckInfo,
  DataNode,
  EventDataNode,
  FlattenNode,
  Key,
  SafeKey,
  ScrollTo,
  TreeProps,
  TreeRef,
} from './interface';
import type { NodeListRef } from './NodeList';
import NodeList from './NodeList';
import { conductCheck, isCheckDisabled } from './utils/conductUtil';
import getEntity from './utils/keyUtil';
import { arrAdd, arrDel, calcDropPosition, getDragChildrenKeys, posToArr } from './utils/miscUtil';
import { convertNodePropsToEventData, flattenTreeData, getTreeNodeProps } from './utils/treeUtil';

export type InternalTreeProps = Omit<TreeProps, 'request' | 'lazyLoad'> & {
  request?: RequestConfig<DataNode, any[]>;
  lazyLoad?: boolean;
};

const Tree = React.forwardRef<TreeRef, InternalTreeProps>((props, ref) => {
  const {
    prefixCls,
    treeData,
    showLine,
    showIcon,
    selectable,
    multiple,
    checkable,
    disabled,
    checkStrictly,
    fieldNames,
    draggable,
    allowDrop,
    expandAction,
    className,
    style,
    icon,
    switcherIcon,
    height,
    itemHeight,
    virtual,
    expandedKeys,
    checkedKeys,
    halfCheckedKeys,
    selectedKeys,
    keyEntities,
    loadedKeys: customizeLoadedKeys,
    request,
    lazyLoad,
    setExpandedKeys,
    setCheckedKeys,
    setHalfCheckedKeys,
    setSelectedKeys,
    titleRender,
    onContextMenu,
    onScroll,
    onDragStart,
    onDragEnd,
    onExpand,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onSelect,
    onCheck,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    onRightClick,
    onLoad,
    ...restProps
  } = useFilledProps(props);

  const {
    treeData: requestTreeData,
    loadingKeys,
    loadedKeys,
    loadData,
  } = useRequest(fieldNames, customizeLoadedKeys, request, lazyLoad, onLoad);

  const draggableConfig = useDraggableConfig(draggable);

  // ==================================Refs==================================
  const listRef = React.useRef<NodeListRef>(null);

  const dragNode = React.useRef<EventDataNode<DataNode> | null>(null);
  const dragStartMousePosition = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseOverDroppableNodeKey = React.useRef<Key | null>(null);
  const delayedDragEnterLogic = React.useRef<Record<SafeKey, number>>();

  // ==================================States==================================
  const [flattenNodes, setFlattenNodes] = React.useState<FlattenNode<DataNode>[]>([]);
  const [indent, setIndent] = React.useState<number>(0);
  const [listChanging, setListChanging] = React.useState<boolean>(false);
  const [dragState, setDragState] = useSetState<{
    draggingNodeKey: Key | null;
    dragChildrenKeys: Key[];
    dropPosition: -1 | 0 | 1 | null;
    dropLevelOffset: number | null;
    dropContainerKey: Key | null;
    dropTargetKey: Key | null;
    dropTargetPos: string | null;
    dropAllowed: boolean | null;
    dragOverNodeKey: Key | null;
  }>({
    draggingNodeKey: null,
    dragChildrenKeys: [],
    dropPosition: null,
    dropLevelOffset: null,
    dropContainerKey: null,
    dropTargetKey: null,
    dropTargetPos: null,
    dropAllowed: false,
    dragOverNodeKey: null,
  });

  const treeNodeRequiredProps = {
    expandedKeys,
    selectedKeys,
    loadedKeys,
    loadingKeys,
    checkedKeys,
    halfCheckedKeys,
    dragOverNodeKey: dragState.dragOverNodeKey,
    dropPosition: dragState.dropPosition,
    keyEntities: keyEntities,
  };

  const scrollTo: ScrollTo = (scroll) => {
    listRef.current?.scrollTo(scroll);
  };

  React.useImperativeHandle(
    ref,
    () => ({
      scrollTo,
    }),
    [],
  );

  React.useEffect(() => {
    const flattenNodes: FlattenNode<DataNode>[] = flattenTreeData<DataNode>(
      request ? requestTreeData : treeData,
      expandedKeys,
      fieldNames,
    );
    setFlattenNodes(flattenNodes);
  }, [treeData, requestTreeData, expandedKeys, fieldNames]);

  const resetDragState = () => {
    setDragState({
      dropPosition: null,
      dropContainerKey: null,
      dropTargetKey: null,
      dropLevelOffset: null,
      dropAllowed: false,
      dragOverNodeKey: null,
      dropTargetPos: null,
    });
  };

  const cleanDragState = () => {
    if (dragState.draggingNodeKey !== null) {
      setDragState({
        draggingNodeKey: null,
        dropPosition: null,
        dropContainerKey: null,
        dropTargetKey: null,
        dropLevelOffset: null,
        dropAllowed: true,
        dragOverNodeKey: null,
      });
    }
    dragStartMousePosition.current = { x: 0, y: 0 };
    currentMouseOverDroppableNodeKey.current = null;
  };

  // ================================== Event ==================================
  // since stopPropagation() is called in treeNode
  // if onWindowDrag is called, which means state is keeped, drag state should be cleared
  const onWindowDragEnd = useEvent((event: Event) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onNodeDragEnd(event, null, true);
  });

  React.useEffect(
    () => () => {
      window.removeEventListener('dragend', onWindowDragEnd);
    },
    [],
  );

  const onNodeDragStart: NodeDragEventHandler<DataNode, HTMLDivElement> = (event, node) => {
    dragNode.current = node;
    dragStartMousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };

    const newExpandedKeys = arrDel(expandedKeys, node.key);

    setDragState({
      draggingNodeKey: node.key,
      dragChildrenKeys: getDragChildrenKeys(node.key, keyEntities),
    });
    setIndent(listRef.current!.getIndentWidth());

    setExpandedKeys(newExpandedKeys);

    window.addEventListener('dragend', onWindowDragEnd);

    onDragStart?.({ event, node });
  };

  // if onNodeDragEnd is called, onWindowDragEnd won't be called since stopPropagation() is called
  const onNodeDragEnd: NodeDragEventHandler<DataNode> = (event, node) => {
    setDragState({
      dragOverNodeKey: null,
    });

    cleanDragState();

    onDragEnd?.({ event, node });

    dragNode.current = null;

    window.removeEventListener('dragend', onWindowDragEnd);
  };

  /**
   * [Legacy] Select handler is smaller than node,
   * so that this will trigger when drag enter node or select handler.
   * This is a little tricky if customize css without padding.
   * Better for use mouse move event to refresh drag state.
   * But let's just keep it to avoid event trigger logic change.
   */
  const onNodeDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
    node: EventDataNode<DataNode>,
  ) => {
    const { pos, key } = node;

    // record the key of node which is latest entered, used in dragleave event.
    if (currentMouseOverDroppableNodeKey.current !== key) {
      currentMouseOverDroppableNodeKey.current = key;
    }

    if (!dragNode.current) {
      resetDragState();
      return;
    }

    const {
      dropPosition,
      dropLevelOffset,
      dropTargetKey,
      dropContainerKey,
      dropTargetPos,
      dropAllowed,
      dragOverNodeKey,
    } = calcDropPosition<DataNode>(
      event,
      dragNode.current,
      node,
      indent,
      dragStartMousePosition.current,
      allowDrop,
      flattenNodes,
      keyEntities,
      expandedKeys,
    );

    if (
      // don't allow drop inside its children
      dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 ||
      // don't allow drop when drop is not allowed caculated by calcDropPosition
      !dropAllowed
    ) {
      resetDragState();
      return;
    }

    // Side effect for delay drag
    if (!delayedDragEnterLogic.current) {
      delayedDragEnterLogic.current = {};
    }
    Object.keys(delayedDragEnterLogic.current).forEach((key) => {
      clearTimeout(delayedDragEnterLogic.current?.[key]);
    });

    if (dragNode.current.key !== node.key) {
      // hoist expand logic here
      // since if logic is on the bottom
      // it will be blocked by abstract dragover node check
      //   => if you dragenter from top, you mouse will still be consider as in the top node
      event.persist();
      delayedDragEnterLogic.current[pos] = window.setTimeout(() => {
        if (dragState.draggingNodeKey === null) return;

        let newExpandedKeys = [...expandedKeys];
        const entity = getEntity(keyEntities, node.props.eventKey);

        if (entity && (entity.children || []).length) {
          newExpandedKeys = arrAdd(expandedKeys, node.props.eventKey);
        }

        if (!('expandedKeys' in props)) {
          setExpandedKeys(newExpandedKeys);
        }

        onExpand?.(newExpandedKeys, {
          node: convertNodePropsToEventData(node.props),
          expanded: true,
          nativeEvent: event.nativeEvent,
        });
      }, 800);
    }

    // Skip if drag node is self
    if (dragNode.current.key === dropTargetKey && dropLevelOffset === 0) {
      resetDragState();
      return;
    }

    // Update drag over node and drag state
    setDragState({
      dragOverNodeKey,
      dropPosition,
      dropLevelOffset,
      dropTargetKey,
      dropContainerKey,
      dropTargetPos,
      dropAllowed,
    });

    onDragEnter?.({
      event,
      node,
      expandedKeys,
    });
  };

  const onNodeDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    node: EventDataNode<DataNode>,
  ) => {
    if (!dragNode.current) {
      return;
    }

    const {
      dropPosition,
      dropLevelOffset,
      dropTargetKey,
      dropContainerKey,
      dropAllowed,
      dropTargetPos,
      dragOverNodeKey,
    } = calcDropPosition(
      event,
      dragNode.current,
      node,
      indent,
      dragStartMousePosition.current,
      allowDrop,
      flattenNodes,
      keyEntities,
      expandedKeys,
    );

    if (dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 || !dropAllowed) {
      // don't allow drop inside its children
      // don't allow drop when drop is not allowed calculated by calcDropPosition
      return;
    }

    if (dragNode.current.key === dropTargetKey && dropLevelOffset === 0) {
      if (
        !(
          dragState.dropPosition === null &&
          dragState.dropLevelOffset === null &&
          dragState.dropTargetKey === null &&
          dragState.dropContainerKey === null &&
          dragState.dropTargetPos === null &&
          dragState.dropAllowed === false &&
          dragState.dragOverNodeKey === null
        )
      ) {
        resetDragState();
      }
    } else if (
      !(
        dropPosition === dragState.dropPosition &&
        dropLevelOffset === dragState.dropLevelOffset &&
        dropTargetKey === dragState.dropTargetKey &&
        dropContainerKey === dragState.dropContainerKey &&
        dropTargetPos === dragState.dropTargetPos &&
        dropAllowed === dragState.dropAllowed &&
        dragOverNodeKey === dragState.dragOverNodeKey
      )
    ) {
      setDragState({
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
        dragOverNodeKey,
      });
    }

    onDragOver?.({ event, node });
  };

  const onNodeDragLeave: NodeDragEventHandler<DataNode> = (event, node) => {
    // if it is outside the droppable area
    // currentMouseOverDroppableNodeKey will be updated in dragenter event when into another droppable receiver.
    if (
      currentMouseOverDroppableNodeKey.current === node.key &&
      !event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      resetDragState();
      currentMouseOverDroppableNodeKey.current = null;
    }

    onDragLeave?.({ event, node: convertNodePropsToEventData<DataNode>(node.props) });
  };

  const onNodeDrop = (
    event: React.DragEvent<HTMLDivElement>,
    _: EventDataNode<DataNode>,
    outsideTree: boolean = false,
  ) => {
    const { dragChildrenKeys, dropPosition, dropTargetKey, dropTargetPos, dropAllowed } = dragState;

    if (!dropAllowed) return;

    setDragState({
      dragOverNodeKey: null,
    });
    cleanDragState();

    if (dropTargetKey === null || dropTargetPos === null) return;

    const abstractDropNodeProps = {
      ...getTreeNodeProps(dropTargetKey, treeNodeRequiredProps),
      data: getEntity(keyEntities, dropTargetKey).node,
    };

    const posArr = posToArr(dropTargetPos);

    const dropResult = {
      event,
      node: convertNodePropsToEventData(abstractDropNodeProps),
      dragNode: dragNode.current!,
      dragNodesKeys: [dragNode.current!.key].concat(dragChildrenKeys),
      dropToGap: dropPosition !== 0,
      dropPosition: dropPosition! + Number(posArr[posArr.length - 1]),
    };

    if (!outsideTree) {
      onDrop?.(dropResult);
    }

    dragNode.current = null;
  };

  const onNodeExpand = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode<DataNode>) => {
    const { expanded } = treeNode;
    const key = treeNode[fieldNames.key];

    // Do nothing when transition is in progress
    if (listChanging) {
      return;
    }

    // Update selected keys
    const targetExpanded = !expanded;

    let newExpandedKeys: Key[] = [];
    if (targetExpanded) {
      newExpandedKeys = arrAdd(expandedKeys, key);
    } else {
      newExpandedKeys = arrDel(expandedKeys, key);
    }

    setExpandedKeys(newExpandedKeys);

    onExpand?.(newExpandedKeys, {
      node: treeNode,
      expanded: targetExpanded,
      nativeEvent: e.nativeEvent,
    });

    // Async Load data
    if (targetExpanded && loadData) {
      const loadPromise = loadData(getEntity(keyEntities, key).node, treeNode);
      loadPromise.catch(() => {
        const expandedKeysToRestore = arrDel(expandedKeys, key);
        setExpandedKeys(expandedKeysToRestore);
      });
    }
  };

  const triggerExpandActionExpand: NodeMouseEventHandler = (e, treeNode) => {
    const { expanded, key } = treeNode;
    const leaf = treeNode[fieldNames.leaf];

    if (leaf || e.shiftKey || e.metaKey || e.ctrlKey) {
      return;
    }

    const node = flattenNodes.filter((nodeItem) => nodeItem.key === key)[0];
    const eventNode = convertNodePropsToEventData<DataNode>({
      ...getTreeNodeProps(key, treeNodeRequiredProps),
      data: node.data,
    });

    setExpandedKeys(expanded ? arrDel(expandedKeys, key) : arrAdd(expandedKeys, key));
    onNodeExpand(e as React.MouseEvent<HTMLDivElement>, eventNode);
  };

  const onNodeClick: NodeMouseEventHandler<DataNode> = (e, treeNode) => {
    if (expandAction === 'click') {
      triggerExpandActionExpand(e, treeNode);
    }

    onClick?.(e, treeNode);
  };

  const onNodeDoubleClick: NodeMouseEventHandler<DataNode> = (e, treeNode) => {
    if (expandAction === 'doubleClick') {
      triggerExpandActionExpand(e, treeNode);
    }

    onDoubleClick?.(e, treeNode);
  };

  const onNodeSelect: NodeMouseEventHandler<DataNode> = (e, treeNode) => {
    const { selected } = treeNode;

    if (!multiple && selected) {
      return;
    }

    const key = treeNode[fieldNames.key];
    const targetSelected = !selected;

    // Update selected keys
    let newSelectedKeys: Key[] = [];
    if (!multiple) {
      newSelectedKeys = [key];
    } else if (!targetSelected) {
      newSelectedKeys = arrDel(selectedKeys, key);
    } else {
      newSelectedKeys = arrAdd(selectedKeys, key);
    }

    const selectedNodes = newSelectedKeys
      .map((selectedKey) => {
        const entity = getEntity(keyEntities, selectedKey);
        if (!entity) return null;

        return entity.node;
      })
      .filter((node) => node) as DataNode[];

    setSelectedKeys(newSelectedKeys);

    onSelect?.(newSelectedKeys, {
      event: 'select',
      selected: targetSelected,
      node: treeNode,
      selectedNodes,
      nativeEvent: e.nativeEvent,
    });
  };

  const onNodeCheck = (
    e: React.MouseEvent<HTMLSpanElement>,
    treeNode: EventDataNode<DataNode>,
    checked: boolean,
  ) => {
    const { key } = treeNode;

    // Prepare trigger arguments
    let checkedObj;
    const eventObj: Partial<CheckInfo<DataNode>> = {
      event: 'check',
      node: treeNode,
      checked,
      nativeEvent: e.nativeEvent,
    };

    if (checkStrictly) {
      const newCheckedKeys = checked ? arrAdd(checkedKeys, key) : arrDel(checkedKeys, key);
      const newHalfCheckedKeys = arrDel(halfCheckedKeys, key);

      checkedObj = { checked: newCheckedKeys, halfChecked: newHalfCheckedKeys };

      eventObj.checkedNodes = newCheckedKeys
        .map((checkedKey) => getEntity(keyEntities, checkedKey))
        .filter((entity) => entity)
        .map((entity) => entity.node);

      setCheckedKeys(newCheckedKeys);
    } else {
      // Always fill first
      let { checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductCheck(
        [...checkedKeys, key],
        true,
        keyEntities,
        (node) => isCheckDisabled(node, fieldNames.disabled),
      );

      // If remove, we do it again to correction
      if (!checked) {
        const keySet = new Set(newCheckedKeys);
        keySet.delete(key);
        ({ checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductCheck(
          Array.from(keySet),
          { checked: false, halfCheckedKeys: newHalfCheckedKeys },
          keyEntities,
          (node) => isCheckDisabled(node, fieldNames.disabled),
        ));
      }

      checkedObj = newCheckedKeys;

      eventObj.checkedNodes = [];
      eventObj.checkedNodesPositions = [];
      eventObj.halfCheckedKeys = newHalfCheckedKeys;

      newCheckedKeys.forEach((checkedKey) => {
        const entity = getEntity(keyEntities, checkedKey);
        if (!entity) return;

        const { node, pos } = entity;

        eventObj.checkedNodes!.push(node);
        eventObj.checkedNodesPositions!.push({ node, pos });
      });

      setCheckedKeys(newCheckedKeys);
      setHalfCheckedKeys(newHalfCheckedKeys);
    }

    onCheck?.(checkedObj, eventObj as CheckInfo<DataNode>);
  };

  const onNodeMouseEnter: NodeMouseEventHandler<DataNode> = (event, node) => {
    onMouseEnter?.({ event, node });
  };

  const onNodeMouseLeave: NodeMouseEventHandler<DataNode> = (event, node) => {
    onMouseLeave?.({ event, node });
  };

  const onNodeContextMenu: NodeMouseEventHandler<DataNode> = (event, node) => {
    if (onRightClick) {
      event.preventDefault();
      onRightClick({ event, node });
    }
  };

  const onListChangeStart = () => {
    setListChanging(true);
  };

  const onListChangeEnd = () => {
    setTimeout(() => {
      setListChanging(false);
    });
  };

  // ================================== Style ==================================
  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-show-line`]: showLine,
    },
    'text-sm text-text',
    className,
  );

  // ================================== Render ==================================
  const domProps = pickAttrs(restProps, { aria: true, data: true });
  return (
    <TreeContext.Provider
      value={{
        prefixCls,
        selectable,
        showIcon,
        showLine,
        icon,
        switcherIcon,
        draggable: draggableConfig,
        draggingNodeKey: dragState.draggingNodeKey,
        checkable: !!checkable,
        checkStrictly: !!checkStrictly,
        disabled: !!disabled,
        keyEntities,
        dropLevelOffset: dragState.dropLevelOffset,
        dropContainerKey: dragState.dropContainerKey,
        dropTargetKey: dragState.dropTargetKey,
        dropPosition: dragState.dropPosition,
        dragOverNodeKey: dragState.dragOverNodeKey,
        indent,

        loadData,

        titleRender,

        onNodeClick: onNodeClick,
        onNodeDoubleClick: onNodeDoubleClick,
        onNodeExpand: onNodeExpand,
        onNodeSelect: onNodeSelect,
        onNodeCheck: onNodeCheck,
        onNodeMouseEnter: onNodeMouseEnter,
        onNodeMouseLeave: onNodeMouseLeave,
        onNodeContextMenu: onNodeContextMenu,
        onNodeDragStart: onNodeDragStart,
        onNodeDragEnter: onNodeDragEnter,
        onNodeDragOver: onNodeDragOver,
        onNodeDragLeave: onNodeDragLeave,
        onNodeDragEnd: onNodeDragEnd,
        onNodeDrop: onNodeDrop,
      }}
    >
      <div role="tree" className={rootCls}>
        <NodeList
          ref={listRef}
          prefixCls={prefixCls}
          style={style}
          data={flattenNodes}
          selectable={selectable}
          checkable={!!checkable}
          dragging={dragState.draggingNodeKey !== null}
          height={height}
          itemHeight={itemHeight}
          virtual={virtual}
          onListChangeStart={onListChangeStart}
          onListChangeEnd={onListChangeEnd}
          onContextMenu={onContextMenu}
          onScroll={onScroll}
          {...treeNodeRequiredProps}
          {...domProps}
        />
      </div>
    </TreeContext.Provider>
  );
}) as unknown as (<
  TreeDataType extends BasicDataNode = DataNode,
  LazyLoadType extends boolean = false,
>(
  props: TreeProps<TreeDataType, LazyLoadType> & {
    ref?: React.Ref<TreeRef>;
  },
) => React.ReactElement) & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  Tree.displayName = 'Tree';
}

export default Tree;
