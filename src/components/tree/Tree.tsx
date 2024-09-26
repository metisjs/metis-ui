import * as React from 'react';
import { useSetState } from 'ahooks';
import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import warning from 'rc-util/lib/warning';
import type { VirtualListProps } from '../virtual-list/VirtualList';
import type {
  NodeDragEventHandler,
  NodeDragEventParams,
  NodeMouseEventHandler,
  NodeMouseEventParams,
} from './context';
import { TreeContext } from './context';
import useDraggableConfig from './hooks/useDraggableConfig';
import type {
  BasicDataNode,
  DataNode,
  EventDataNode,
  FieldNames,
  FlattenNode,
  IconType,
  Key,
  KeyEntities,
  SafeKey,
  ScrollTo,
} from './interface';
import type { NodeListRef } from './NodeList';
import NodeList from './NodeList';
import { conductCheck } from './utils/conductUtil';
import getEntity from './utils/keyUtil';
import { arrAdd, arrDel, calcDropPosition, getDragChildrenKeys, posToArr } from './utils/miscUtil';
import {
  convertNodePropsToEventData,
  fillFieldNames,
  flattenTreeData,
  getTreeNodeProps,
} from './utils/treeUtil';

const MAX_RETRY_TIMES = 10;

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

export interface TreeProps<TreeDataType extends BasicDataNode = DataNode> {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  focusable?: boolean;
  activeKey?: Key | null;
  tabIndex?: number;
  treeData?: TreeDataType[];
  fieldNames?: FieldNames<TreeDataType>;
  showLine?: boolean;
  showIcon?: boolean;
  icon?: IconType;
  selectable?: boolean;
  expandAction?: ExpandAction;
  disabled?: boolean;
  multiple?: boolean;
  checkable?: boolean;
  checkStrictly?: boolean;
  draggable?: DraggableFn | boolean | DraggableConfig;
  defaultExpandParent?: boolean;
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
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: NodeMouseEventHandler<TreeDataType>;
  onDoubleClick?: NodeMouseEventHandler<TreeDataType>;
  onScroll?: VirtualListProps<FlattenNode>['onScroll'];
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
  onLoad?: (
    loadedKeys: Key[],
    info: {
      event: 'load';
      node: EventDataNode<TreeDataType>;
    },
  ) => void;
  loadData?: (treeNode: EventDataNode<TreeDataType>) => Promise<any>;
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
  filterTreeNode?: (treeNode: EventDataNode<TreeDataType>) => boolean;
  switcherIcon?: IconType;

  // Virtual List
  height?: number;
  itemHeight?: number;
  itemScrollOffset?: number;
  virtual?: boolean;
}

const Tree = <TreeDataType extends BasicDataNode = DataNode>(props: TreeProps<TreeDataType>) => {
  const {
    prefixCls = 'rc-tree',
    showLine,
    showIcon = true,
    selectable = true,
    multiple,
    checkable,
    disabled,
    checkStrictly,
    fieldNames,
    treeData = [],
    draggable,
    defaultExpandParent = true,
    autoExpandParent,
    defaultExpandAll,
    loadedKeys: customizeLoadedKeys,
    expandedKeys: customizeExpandedKeys,
    checkedKeys: customizeCheckedKeys,
    selectedKeys: customizeSelectedKeys,
    defaultExpandedKeys = [],
    defaultCheckedKeys = [],
    defaultSelectedKeys = [],
    allowDrop = () => true,
    expandAction,
    className,
    style,
    focusable,
    tabIndex = 0,
    icon,
    switcherIcon,
    loadData,
    filterTreeNode,
    height,
    itemHeight,
    virtual,
    itemScrollOffset = 0,
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
    ...restProps
  } = props;

  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(fieldNames),
    [JSON.stringify(fieldNames)],
  );

  const draggableConfig = useDraggableConfig(draggable);

  // ==================================Refs==================================
  const listRef = React.useRef<NodeListRef>(null);

  const dragNode = React.useRef<EventDataNode<TreeDataType> | null>(null);
  const dragStartMousePosition = React.useRef<{ x: number; y: number } | null>(null);
  const currentMouseOverDroppableNodeKey = React.useRef<Key | null>(null);
  const delayedDragEnterLogic = React.useRef<Record<SafeKey, number>>();
  const loadingRetryTimes = React.useRef<Record<SafeKey, number>>({});

  const destroyed = React.useRef(false);

  // ==================================States==================================
  const [selectedKeys, setSelectedKeys] = useMergedState(defaultSelectedKeys, {
    value: customizeSelectedKeys,
  });
  const [expandedKeys, setExpandedKeys] = useMergedState(defaultExpandedKeys, {
    value: customizeExpandedKeys,
  });
  const [loadedKeys, setLoadedKey] = useMergedState([], {
    value: customizeLoadedKeys,
  });

  const [keyEntities, setKeyEntities] = React.useState<KeyEntities<TreeDataType>>(
    {} as KeyEntities<TreeDataType>,
  );
  const [indent, setIndent] = React.useState<number | null>(null);
  const [checkedKeys, setCheckedKeys] = React.useState<Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = React.useState<Key[]>([]);
  const [loadingKeys, setLoadingKeys] = React.useState<Key[]>([]);
  const [flattenNodes, setFlattenNodes] = React.useState<FlattenNode<TreeDataType>[]>([]);
  const [focused, setFocused] = React.useState<boolean>(false);
  const [activeKey, setActiveKey] = React.useState<Key | null>(null);
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
    expandedKeys: expandedKeys || [],
    selectedKeys: selectedKeys || [],
    loadedKeys: loadedKeys || [],
    loadingKeys: loadingKeys || [],
    checkedKeys: checkedKeys || [],
    halfCheckedKeys: halfCheckedKeys || [],
    dragOverNodeKey: dragState.dragOverNodeKey,
    dropPosition: dragState.dropPosition,
    keyEntities: keyEntities,
  };

  React.useEffect(() => {
    const flattenNodes: FlattenNode<TreeDataType>[] = flattenTreeData<TreeDataType>(
      treeData,
      expandedKeys,
      mergedFieldNames,
    );
    setFlattenNodes(flattenNodes);
  }, [treeData, expandedKeys, mergedFieldNames]);

  const scrollTo: ScrollTo = (scroll) => {
    listRef.current?.scrollTo(scroll);
  };

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
    dragStartMousePosition.current = null;
    currentMouseOverDroppableNodeKey.current = null;
  };

  const getActiveItem = () => {
    if (activeKey === null) {
      return null;
    }

    return flattenNodes.find(({ key }) => key === activeKey) || null;
  };

  // ================================== Event ==================================
  // since stopPropagation() is called in treeNode
  // if onWindowDrag is called, which means state is keeped, drag state should be cleared
  const onWindowDragEnd = (event: Event) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onNodeDragEnd(event, null, true);
  };

  const onNodeDragStart: NodeDragEventHandler<TreeDataType, HTMLDivElement> = (event, node) => {
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
  const onNodeDragEnd: NodeDragEventHandler<TreeDataType> = (event, node) => {
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
    node: EventDataNode<TreeDataType>,
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
    } = calcDropPosition<TreeDataType>(
      event,
      dragNode,
      node,
      indent,
      dragStartMousePosition,
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
    Object.keys(delayedDragEnterLogic).forEach((key) => {
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
    node: EventDataNode<TreeDataType>,
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
      dragNode,
      node,
      indent,
      dragStartMousePosition,
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

  const onNodeDragLeave: NodeDragEventHandler<TreeDataType> = (event, node) => {
    // if it is outside the droppable area
    // currentMouseOverDroppableNodeKey will be updated in dragenter event when into another droppable receiver.
    if (
      currentMouseOverDroppableNodeKey.current === node.key &&
      !event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      resetDragState();
      currentMouseOverDroppableNodeKey.current = null;
    }

    onDragLeave?.({ event, node: convertNodePropsToEventData<TreeDataType>(node.props) });
  };

  const onNodeDrop = (
    event: React.DragEvent<HTMLDivElement>,
    _: EventDataNode<TreeDataType>,
    outsideTree: boolean = false,
  ) => {
    const { dragChildrenKeys, dropPosition, dropTargetKey, dropTargetPos, dropAllowed } = dragState;

    if (!dropAllowed) return;

    const { onDrop } = props;

    setDragState({
      dragOverNodeKey: null,
    });
    cleanDragState();

    if (dropTargetKey === null || dropTargetPos === null) return;

    const abstractDropNodeProps = {
      ...getTreeNodeProps(dropTargetKey, treeNodeRequiredProps),
      active: getActiveItem()?.key === dropTargetKey,
      data: getEntity(keyEntities, dropTargetKey).node,
    };

    const posArr = posToArr(dropTargetPos);

    const dropResult = {
      event,
      node: convertNodePropsToEventData(abstractDropNodeProps),
      dragNode: dragNode.current ? dragNode.current : null,
      dragNodesKeys: [dragNode.current?.key].concat(dragChildrenKeys),
      dropToGap: dropPosition !== 0,
      dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
    };

    if (!outsideTree) {
      onDrop?.(dropResult);
    }

    dragNode.current = null;
  };

  const onNodeLoad = (treeNode: EventDataNode<TreeDataType>) => {
    const { key } = treeNode;

    // Skip if has children already
    const entity = getEntity(keyEntities, key);
    if (entity?.children?.length) {
      return;
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      // We need to get the latest state of loading/loaded keys
      setState(({ loadedKeys = [], loadingKeys = [] }): any => {
        const { loadData, onLoad } = props;

        if (!loadData || loadedKeys.indexOf(key) !== -1 || loadingKeys.indexOf(key) !== -1) {
          return null;
        }

        // Process load data
        const promise = loadData(treeNode);
        promise
          .then(() => {
            const { loadedKeys: currentLoadedKeys } = state;
            const newLoadedKeys = arrAdd(currentLoadedKeys, key);

            onLoad?.(newLoadedKeys, {
              event: 'load',
              node: treeNode,
            });

            setUncontrolledState({
              loadedKeys: newLoadedKeys,
            });
            setState((prevState) => ({
              loadingKeys: arrDel(prevState.loadingKeys, key),
            }));

            resolve();
          })
          .catch((e) => {
            setState((prevState) => ({
              loadingKeys: arrDel(prevState.loadingKeys, key),
            }));

            // If exceed max retry times, we give up retry
            loadingRetryTimes[key as SafeKey] = (loadingRetryTimes[key as SafeKey] || 0) + 1;
            if (loadingRetryTimes[key as SafeKey] >= MAX_RETRY_TIMES) {
              const { loadedKeys: currentLoadedKeys } = state;

              warning(false, 'Retry for `loadData` many times but still failed. No more retry.');

              setUncontrolledState({
                loadedKeys: arrAdd(currentLoadedKeys, key),
              });
              resolve();
            }

            reject(e);
          });

        return {
          loadingKeys: arrAdd(loadingKeys, key),
        };
      });
    });

    // Not care warning if we ignore this
    loadPromise.catch(() => {});

    return loadPromise;
  };

  const onNodeExpand = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode<TreeDataType>,
  ) => {
    const { expanded } = treeNode;
    const key = treeNode[mergedFieldNames.key];

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

    onExpand?.(expandedKeys, {
      node: treeNode,
      expanded: targetExpanded,
      nativeEvent: e.nativeEvent,
    });

    // Async Load data
    if (targetExpanded && loadData) {
      const loadPromise = onNodeLoad(treeNode);
      if (loadPromise) {
        loadPromise
          .then(() => {
            // [Legacy] Refresh logic
            const newFlattenTreeData = flattenTreeData<TreeDataType>(
              state.treeData,
              expandedKeys,
              fieldNames,
            );
            setUncontrolledState({ flattenNodes: newFlattenTreeData });
          })
          .catch(() => {
            const { expandedKeys: currentExpandedKeys } = state;
            const expandedKeysToRestore = arrDel(currentExpandedKeys, key);
            setExpandedKeys(expandedKeysToRestore);
          });
      }
    }
  };

  const triggerExpandActionExpand: NodeMouseEventHandler = (e, treeNode) => {
    const { expanded, key, isLeaf } = treeNode;

    if (isLeaf || e.shiftKey || e.metaKey || e.ctrlKey) {
      return;
    }

    const node = flattenNodes.filter((nodeItem) => nodeItem.key === key)[0];
    const eventNode = convertNodePropsToEventData<TreeDataType>({
      ...getTreeNodeProps(key, treeNodeRequiredProps),
      data: node.data,
    });

    setExpandedKeys(expanded ? arrDel(expandedKeys, key) : arrAdd(expandedKeys, key));
    onNodeExpand(e as React.MouseEvent<HTMLDivElement>, eventNode);
  };

  const onNodeClick: NodeMouseEventHandler<TreeDataType> = (e, treeNode) => {
    const { onClick, expandAction } = props;

    if (expandAction === 'click') {
      triggerExpandActionExpand(e, treeNode);
    }

    onClick?.(e, treeNode);
  };

  const onNodeDoubleClick: NodeMouseEventHandler<TreeDataType> = (e, treeNode) => {
    const { onDoubleClick, expandAction } = props;

    if (expandAction === 'doubleClick') {
      triggerExpandActionExpand(e, treeNode);
    }

    onDoubleClick?.(e, treeNode);
  };

  const onNodeSelect: NodeMouseEventHandler<TreeDataType> = (e, treeNode) => {
    const { selected } = treeNode;
    const key = treeNode[mergedFieldNames.key];
    const targetSelected = !selected;

    // Update selected keys
    let newSelectedKeys: Key[] = [];
    if (!targetSelected) {
      newSelectedKeys = arrDel(selectedKeys, key);
    } else if (!multiple) {
      newSelectedKeys = [key];
    } else {
      newSelectedKeys = arrAdd(selectedKeys, key);
    }

    // [Legacy] Not found related usage in doc or upper libs
    const selectedNodes = newSelectedKeys
      .map((selectedKey) => {
        const entity = getEntity(keyEntities, selectedKey);
        if (!entity) return null;

        return entity.node;
      })
      .filter((node) => node) as TreeDataType[];

    setSelectedKeys(newSelectedKeys);

    onSelect?.(selectedKeys, {
      event: 'select',
      selected: targetSelected,
      node: treeNode,
      selectedNodes,
      nativeEvent: e.nativeEvent,
    });
  };

  const onNodeCheck = (
    e: React.MouseEvent<HTMLSpanElement>,
    treeNode: EventDataNode<TreeDataType>,
    checked: boolean,
  ) => {
    const { key } = treeNode;

    // Prepare trigger arguments
    let checkedObj;
    const eventObj: Partial<CheckInfo<TreeDataType>> = {
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
      );

      // If remove, we do it again to correction
      if (!checked) {
        const keySet = new Set(newCheckedKeys);
        keySet.delete(key);
        ({ checkedKeys: newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys } = conductCheck(
          Array.from(keySet),
          { checked: false, halfCheckedKeys: newHalfCheckedKeys },
          keyEntities,
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

    onCheck?.(checkedObj, eventObj as CheckInfo<TreeDataType>);
  };

  const onNodeMouseEnter: NodeMouseEventHandler<TreeDataType> = (event, node) => {
    const { onMouseEnter } = props;

    onMouseEnter?.({ event, node });
  };

  const onNodeMouseLeave: NodeMouseEventHandler<TreeDataType> = (event, node) => {
    const { onMouseLeave } = props;

    onMouseLeave?.({ event, node });
  };

  const onNodeContextMenu: NodeMouseEventHandler<TreeDataType> = (event, node) => {
    const { onRightClick } = props;
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

  const onActiveChange = (newActiveKey: Key | null) => {
    if (activeKey === newActiveKey) {
      return;
    }

    setActiveKey(newActiveKey);
    if (newActiveKey !== null) {
      scrollTo({ key: newActiveKey, offset: itemScrollOffset });
    }
  };

  const offsetActiveKey = (offset: number) => {
    let index = flattenNodes.findIndex(({ key }) => key === activeKey);

    // Align with index
    if (index === -1 && offset < 0) {
      index = flattenNodes.length;
    }

    index = (index + offset + flattenNodes.length) % flattenNodes.length;

    const item = flattenNodes[index];
    if (item) {
      const { key } = item;
      onActiveChange(key);
    } else {
      onActiveChange(null);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    // >>>>>>>>>> Direction
    switch (event.which) {
      case KeyCode.UP: {
        offsetActiveKey(-1);
        event.preventDefault();
        break;
      }
      case KeyCode.DOWN: {
        offsetActiveKey(1);
        event.preventDefault();
        break;
      }
    }

    // >>>>>>>>>> Expand & Selection
    const activeItem = getActiveItem();
    if (activeItem && activeItem.data) {
      const expandable =
        activeItem.data.isLeaf === false ||
        !!(activeItem.data[mergedFieldNames.children] || []).length;
      const eventNode = convertNodePropsToEventData<TreeDataType>({
        ...getTreeNodeProps(activeKey, treeNodeRequiredProps),
        data: activeItem.data,
        active: true,
      });

      switch (event.which) {
        // >>> Expand
        case KeyCode.LEFT: {
          // Collapse if possible
          if (expandable && expandedKeys.includes(activeKey ?? '')) {
            onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (activeItem.parent) {
            onActiveChange(activeItem.parent.key);
          }
          event.preventDefault();
          break;
        }
        case KeyCode.RIGHT: {
          // Expand if possible
          if (expandable && !expandedKeys.includes(activeKey ?? '')) {
            onNodeExpand({} as React.MouseEvent<HTMLDivElement>, eventNode);
          } else if (activeItem.children && activeItem.children.length) {
            onActiveChange(activeItem.children[0].key);
          }
          event.preventDefault();
          break;
        }

        // Selection
        case KeyCode.ENTER:
        case KeyCode.SPACE: {
          if (
            checkable &&
            !eventNode.disabled &&
            eventNode.checkable !== false &&
            !eventNode.disableCheckbox
          ) {
            onNodeCheck(
              {} as React.MouseEvent<HTMLDivElement>,
              eventNode,
              !checkedKeys.includes(activeKey ?? ''),
            );
          } else if (
            !checkable &&
            selectable &&
            !eventNode.disabled &&
            eventNode.selectable !== false
          ) {
            onNodeSelect({} as React.MouseEvent<HTMLDivElement>, eventNode);
          }
          break;
        }
      }
    }

    onKeyDown?.(event);
  };

  const onFocus: React.FocusEventHandler<HTMLDivElement> = (...args) => {
    setFocused(true);
    onFocus?.(...args);
  };

  const onBlur: React.FocusEventHandler<HTMLDivElement> = (...args) => {
    setFocused(false);
    onActiveChange(null);

    onBlur?.(...args);
  };

  // ==================================Render==================================
  const domProps = pickAttrs(restProps, { aria: true, data: true });
  return (
    <TreeContext.Provider
      value={{
        prefixCls,
        selectable,
        showIcon,
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
        filterTreeNode,

        titleRender,

        onNodeClick: onNodeClick,
        onNodeDoubleClick: onNodeDoubleClick,
        onNodeExpand: onNodeExpand,
        onNodeSelect: onNodeSelect,
        onNodeCheck: onNodeCheck,
        onNodeLoad: onNodeLoad,
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
      <div
        role="tree"
        className={classNames(prefixCls, className, {
          [`${prefixCls}-show-line`]: showLine,
          [`${prefixCls}-focused`]: focused,
          [`${prefixCls}-active-focused`]: activeKey !== null,
        })}
      >
        <NodeList
          ref={listRef}
          prefixCls={prefixCls}
          style={style}
          data={flattenNodes}
          disabled={disabled}
          selectable={selectable}
          checkable={!!checkable}
          dragging={dragState.draggingNodeKey !== null}
          height={height}
          itemHeight={itemHeight}
          virtual={virtual}
          focusable={focusable}
          focused={focused}
          tabIndex={tabIndex}
          activeItem={getActiveItem()}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onActiveChange={onActiveChange}
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
};

export default Tree;
