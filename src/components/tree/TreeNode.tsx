import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx } from '../_util/classNameUtils';
import { TreeContext } from './context';
import useEventData from './hooks/useEventData';
import Indent from './Indent';
import type { BasicDataNode, DataNode, TreeNodeProps } from './interface';
import getEntity from './utils/keyUtil';

const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

const defaultTitle = '---';

export interface TreeNodeState {
  dragNodeHighlight: boolean;
}

const TreeNode = React.forwardRef<HTMLDivElement, TreeNodeProps>((props, ref) => {
  const {
    eventKey,
    className,
    style,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    leaf,
    isStart,
    isEnd,
    expanded,
    selected,
    checked,
    halfChecked,
    loading,
    active,
    data,
    onMouseMove,
    selectable,
    disabled,
    loaded,
    disableCheckbox,
    checkable,
    switcherIcon,
    title = defaultTitle,
    icon,
    ...restProps
  } = props;

  const {
    prefixCls,
    filterTreeNode,
    keyEntities,
    dropContainerKey,
    dropTargetKey,
    draggingNodeKey,
    disabled: treeDisabled,
    draggable,
    selectable: treeSelectable,
    checkable: treeCheckable,
    switcherIcon: treeSwitcherIcon,
    showIcon,
    indent,
    icon: treeIcon,
    dragOverNodeKey,
    dropLevelOffset,
    dropPosition,
    titleRender,
    loadData,
    onNodeClick,
    onNodeCheck,
    onNodeSelect,
    onNodeDoubleClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onNodeContextMenu,
    onNodeDragStart,
    onNodeDragEnter,
    onNodeDragOver,
    onNodeDragLeave,
    onNodeDragEnd,
    onNodeDrop,
    onNodeExpand,
    onNodeLoad,
  } = React.useContext(TreeContext);

  const [dragNodeHighlight, setDragNodeHighlight] = React.useState(false);

  const selectHandle = React.useRef<HTMLSpanElement>(null);
  const cacheIndent = React.useRef<number>();

  const hasChildren = !!getEntity(keyEntities, eventKey)?.children?.length;

  const eventDate = useEventData(props);

  // ========================== Leaf ============================
  const mergedLeaf =
    leaf === false
      ? false
      : leaf || (!loadData && !hasChildren) || (loadData && loaded && !hasChildren);

  // ========================== NodeState ============================
  const nodeState = mergedLeaf ? null : expanded ? ICON_OPEN : ICON_CLOSE;

  // ========================== Disabled ============================
  const mergedDisabled = !!(treeDisabled || disabled);

  // ========================== Draggable ============================
  const mergedDraggable = !!(
    draggable &&
    (!draggable.nodeDraggable || draggable.nodeDraggable(data))
  );

  // ========================== Selectable ============================
  const mergedSelectable = typeof selectable === 'boolean' ? selectable : treeSelectable;

  // ========================== Checkable ============================
  const mergedCheckable = !treeCheckable || checkable === false ? false : treeCheckable;

  // Load data to avoid default expanded tree without data
  const syncLoadData = () => {
    if (loading) {
      return;
    }

    // read from state to avoid loadData at same time
    if (loadData && expanded && !mergedLeaf && !loaded) {
      // We needn't reload data when has children in sync logic
      // It's only needed in node expanded
      onNodeLoad(eventDate);
    }
  };

  React.useEffect(() => {
    syncLoadData();
  });

  // ========================== Event ============================
  const onSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (mergedDisabled) return;

    onNodeSelect(e, eventDate);
  };

  const onCheck = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (mergedDisabled) return;

    if (!mergedCheckable || disableCheckbox) return;

    const targetChecked = !checked;
    onNodeCheck(e, eventDate, targetChecked);
  };

  const onSelectorClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // Click trigger before select/check operation
    onNodeClick(e, eventDate);

    if (mergedSelectable) {
      onSelect(e);
    } else {
      onCheck(e);
    }
  };

  const onSelectorDoubleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onNodeDoubleClick(e, eventDate);
  };

  const onMouseEnter = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onNodeMouseEnter(e, eventDate);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onNodeMouseLeave(e, eventDate);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onNodeContextMenu(e, eventDate);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragNodeHighlight(true);
    onNodeDragStart(e, eventDate);

    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '');
    } catch (error) {
      // empty
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onNodeDragEnter(e, eventDate);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onNodeDragOver(e, eventDate);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onNodeDragLeave(e, eventDate);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragNodeHighlight(false);
    onNodeDragEnd(e, eventDate);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragNodeHighlight(false);
    onNodeDrop(e, eventDate);
  };

  // Disabled item still can be switch
  const onExpand = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    onNodeExpand(e, eventDate);
  };

  // ==================== Render: Drag Handler ====================
  const renderDragHandler = () => {
    return draggable?.icon ? (
      <span className={`${prefixCls}-draggable-icon`}>{draggable.icon}</span>
    ) : null;
  };

  // ====================== Render: Switcher ======================
  const renderSwitcherIconDom = (isLeaf: boolean) => {
    const mergedSwitcherIcon = switcherIcon || treeSwitcherIcon;
    if (typeof mergedSwitcherIcon === 'function') {
      return mergedSwitcherIcon({ ...props, leaf: isLeaf });
    }
    return switcherIcon as React.ReactNode;
  };

  // Switcher
  const renderSwitcher = () => {
    if (mergedLeaf) {
      // if switcherIconDom is null, no render switcher span
      const switcherIconDom = renderSwitcherIconDom(true);

      return switcherIconDom !== false ? (
        <span className={clsx(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)}>
          {switcherIconDom}
        </span>
      ) : null;
    }

    const switcherCls = clsx(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`,
    );

    const switcherIconDom = renderSwitcherIconDom(false);

    return switcherIconDom !== false ? (
      <span onClick={onExpand} className={switcherCls}>
        {switcherIconDom}
      </span>
    ) : null;
  };

  // ====================== Render: Checkbox ======================
  const renderCheckbox = () => {
    if (!mergedCheckable) return null;

    return (
      <span
        className={clsx(
          `${prefixCls}-checkbox`,
          checked && `${prefixCls}-checkbox-checked`,
          !checked && halfChecked && `${prefixCls}-checkbox-indeterminate`,
          (mergedDisabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`,
        )}
        onClick={onCheck}
      ></span>
    );
  };

  // =================== Render: Drop Indicator ===================
  const renderDropIndicator = () => {
    const treeDraggable = !!draggable;
    // allowDrop is calculated in Tree.tsx, there is no need for calc it here
    const showIndicator = !disabled && treeDraggable && dragOverNodeKey === eventKey;

    const mergedIndent = indent ?? cacheIndent.current;
    cacheIndent.current = indent;

    if (!showIndicator) return null;

    const offset = 4;
    const style: React.CSSProperties = {
      left: -dropLevelOffset! * mergedIndent + offset,
      right: 0,
    };
    switch (dropPosition) {
      case -1:
        style.top = -3;
        break;
      case 1:
        style.bottom = -3;
        break;
      default:
        style.bottom = -3;
        style.left = mergedIndent + offset;
        break;
    }
    return <div style={style} className={`${prefixCls}-drop-indicator`} />;
  };

  // ==================== Render: Title + Icon ====================
  const renderIcon = () => {
    return (
      <span
        className={clsx(
          `${prefixCls}-iconEle`,
          `${prefixCls}-icon__${nodeState || 'docu'}`,
          loading && `${prefixCls}-icon_loading`,
        )}
      />
    );
  };

  // Icon + Title
  const renderSelector = () => {
    const wrapClass = `${prefixCls}-node-content-wrapper`;

    // Icon - Still show loading icon when loading without showIcon
    let $icon;

    if (showIcon) {
      const currentIcon = icon || treeIcon;

      $icon = currentIcon ? (
        <span className={clsx(`${prefixCls}-iconEle`, `${prefixCls}-icon__customize`)}>
          {typeof currentIcon === 'function' ? currentIcon(props) : currentIcon}
        </span>
      ) : (
        renderIcon()
      );
    } else if (loadData && loading) {
      $icon = renderIcon();
    }

    // Title
    let titleNode: React.ReactNode;
    if (typeof title === 'function') {
      titleNode = title(data);
    } else if (titleRender) {
      titleNode = titleRender(data);
    } else {
      titleNode = title;
    }

    const $title = <span className={`${prefixCls}-title`}>{titleNode}</span>;

    return (
      <span
        ref={selectHandle}
        title={typeof title === 'string' ? title : ''}
        className={clsx(
          `${wrapClass}`,
          `${wrapClass}-${nodeState || 'normal'}`,
          !mergedDisabled && (selected || dragNodeHighlight) && `${prefixCls}-node-selected`,
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        onClick={onSelectorClick}
        onDoubleClick={onSelectorDoubleClick}
      >
        {$icon}
        {$title}
        {renderDropIndicator()}
      </span>
    );
  };

  // ========================== Render ============================
  const isEndNode = isEnd?.[isEnd?.length - 1];
  const dragging = draggingNodeKey === eventKey;
  const ariaSelected = selectable !== undefined ? { 'aria-selected': !!selectable } : undefined;
  const dataOrAriaAttributeProps = pickAttrs(restProps, { aria: true, data: true });
  const draggableWithoutDisabled = !mergedDisabled && mergedDraggable;
  const { level } = getEntity(keyEntities, eventKey) || {};

  return (
    <div
      ref={ref}
      className={clsx(className, `${prefixCls}-treenode`, {
        [`${prefixCls}-treenode-disabled`]: mergedDisabled,
        [`${prefixCls}-treenode-switcher-${expanded ? 'open' : 'close'}`]: !leaf,
        [`${prefixCls}-treenode-checkbox-checked`]: checked,
        [`${prefixCls}-treenode-checkbox-indeterminate`]: halfChecked,
        [`${prefixCls}-treenode-selected`]: selected,
        [`${prefixCls}-treenode-loading`]: loading,
        [`${prefixCls}-treenode-active`]: active,
        [`${prefixCls}-treenode-leaf-last`]: isEndNode,
        [`${prefixCls}-treenode-draggable`]: mergedDraggable,

        dragging,
        'drop-target': dropTargetKey === eventKey,
        'drop-container': dropContainerKey === eventKey,
        'drag-over': !mergedDisabled && dragOver,
        'drag-over-gap-top': !mergedDisabled && dragOverGapTop,
        'drag-over-gap-bottom': !mergedDisabled && dragOverGapBottom,
        'filter-node': filterTreeNode && filterTreeNode(eventDate),
      })}
      style={style}
      // Draggable config
      draggable={draggableWithoutDisabled}
      onDragStart={draggableWithoutDisabled ? onDragStart : undefined}
      // Drop config
      onDragEnter={mergedDraggable ? onDragEnter : undefined}
      onDragOver={mergedDraggable ? onDragOver : undefined}
      onDragLeave={mergedDraggable ? onDragLeave : undefined}
      onDrop={mergedDraggable ? onDrop : undefined}
      onDragEnd={mergedDraggable ? onDragEnd : undefined}
      onMouseMove={onMouseMove}
      {...ariaSelected}
      {...dataOrAriaAttributeProps}
    >
      <Indent prefixCls={prefixCls} level={level} isStart={isStart} isEnd={isEnd} />
      {renderDragHandler()}
      {renderSwitcher()}
      {renderCheckbox()}
      {renderSelector()}
    </div>
  );
}) as unknown as (<TreeDataType extends BasicDataNode = DataNode>(
  props: TreeNodeProps<TreeDataType> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement) & {
  displayName?: string;
  isTreeNode: 1;
};

if (process.env.NODE_ENV !== 'production') {
  TreeNode.displayName = 'TreeNode';
}

TreeNode.isTreeNode = 1;

export default TreeNode;
