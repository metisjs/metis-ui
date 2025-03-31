import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import pickAttrs from 'rc-util/es/pickAttrs';
import Checkbox from '../checkbox';
import { TreeContext } from './context';
import useEventData from './hooks/useEventData';
import Indent from './Indent';
import type { BasicDataNode, DataNode, TreeNodeProps } from './interface';
import SwitcherIcon from './SwitcherIcon';
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
    leaf,
    isStart,
    isEnd,
    expanded,
    selected,
    checked,
    halfChecked,
    loading,
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
    keyEntities,
    draggingNodeKey,
    disabled: treeDisabled,
    draggable,
    selectable: treeSelectable,
    checkable: treeCheckable,
    switcherIcon: treeSwitcherIcon,
    showIcon,
    showLine,
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
  } = React.useContext(TreeContext);

  const [dragNodeHighlight, setDragNodeHighlight] = React.useState(false);

  const selectHandle = React.useRef<HTMLSpanElement>(null);

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
      loadData(data);
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
    e.stopPropagation();
  };

  const onClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // Click trigger before select/check operation
    onNodeClick(e, eventDate);

    if (mergedSelectable) {
      onSelect(e);
    } else {
      onCheck(e);
    }
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
    e.stopPropagation();
  };

  // ========================== Style ============================
  const isEndNode = isEnd?.[isEnd?.length - 1];
  const dragging = draggingNodeKey === eventKey;
  const { level } = getEntity(keyEntities, eventKey) || {};

  const semanticCls = useSemanticCls(className, {
    selected,
    checked,
    halfChecked,
    leaf: mergedLeaf,
    expanded,
  });

  const nodeCls = clsx(
    `${prefixCls}-treenode`,
    {
      [`${prefixCls}-treenode-disabled`]: mergedDisabled,
      [`${prefixCls}-treenode-switcher-${expanded ? 'open' : 'close'}`]: !mergedLeaf,
      [`${prefixCls}-treenode-checkbox-checked`]: checked,
      [`${prefixCls}-treenode-checkbox-indeterminate`]: halfChecked,
      [`${prefixCls}-treenode-selected`]: selected,
      [`${prefixCls}-treenode-loading`]: loading,
      [`${prefixCls}-treenode-leaf-last`]: isEndNode,
      [`${prefixCls}-treenode-draggable`]: mergedDraggable,
    },
    'relative flex cursor-pointer items-center overflow-hidden rounded-md leading-6 transition-colors',
    {
      'hover:bg-fill-quaternary': !selected,
      'bg-fill-quaternary': selected,
    },
    {
      'after:border-primary relative after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:border after:border-dashed':
        dragging,
    },
    mergedDisabled && 'cursor-not-allowed',
    semanticCls.root,
  );

  const switcherCls = clsx(
    `${prefixCls}-switcher`,
    {
      [`${prefixCls}-switcher-noop`]: mergedLeaf,
      [`${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`]: !mergedLeaf,
    },
    'relative inline-flex w-4 flex-none cursor-pointer items-center justify-center self-stretch transition-colors select-none',
    {
      'hover:bg-fill-tertiary cursor-pointer': !mergedLeaf,
      'rounded-ss-md rounded-es-md': !level,
    },
    semanticCls.switcher,
  );

  const contentCls = clsx(
    `${prefixCls}-node-content-wrapper`,
    `${prefixCls}-node-content-wrapper-${nodeState || 'normal'}`,
    !mergedDisabled && (selected || dragNodeHighlight) && `${prefixCls}-node-selected`,
    'relative flex flex-auto gap-2 overflow-hidden px-2 py-1',
    mergedDisabled && 'text-text-tertiary',
    semanticCls.content,
  );

  const iconCls = clsx(
    `${prefixCls}-iconEle`,
    `${prefixCls}-icon__customize`,
    'inline-flex h-6 items-center text-base',
    semanticCls.icon,
  );

  const titleCls = clsx(`${prefixCls}-title`, 'flex-auto truncate', semanticCls.title);

  const draggableIconCls = clsx(
    `${prefixCls}-draggable-icon`,
    'text-text-quaternary inline-flex cursor-grab items-center text-base',
    mergedDisabled && 'hidden',
  );

  const dropIndicatorCls = clsx(
    `${prefixCls}-drop-indicator`,
    'bg-primary pointer-events-none absolute z-1 h-0.5 rounded-full',
  );

  // ==================== Render: Drag Handler ====================
  const renderDragHandler = () => {
    return draggable?.icon ? <span className={draggableIconCls}>{draggable.icon}</span> : null;
  };

  // ====================== Render: Switcher ======================
  const renderSwitcherIconDom = (leaf: boolean) => {
    const mergedSwitcherIcon = switcherIcon || treeSwitcherIcon;
    return (
      <SwitcherIcon
        prefixCls={prefixCls}
        switcherIcon={mergedSwitcherIcon}
        treeNodeProps={{ ...props, leaf }}
        showLine={showLine}
      />
    );
  };

  // Switcher
  const renderSwitcher = () => {
    if (mergedLeaf) {
      // if switcherIconDom is null, no render switcher span
      const switcherIconDom = renderSwitcherIconDom(true);

      return <span className={switcherCls}>{switcherIconDom}</span>;
    }

    const switcherIconDom = renderSwitcherIconDom(false);

    return (
      <span onClick={onExpand} className={switcherCls}>
        {switcherIconDom}
      </span>
    );
  };

  // ====================== Render: Checkbox ======================
  const renderCheckbox = () => {
    if (!mergedCheckable) return null;

    return (
      <Checkbox
        prefixCls={`${prefixCls}-checkbox`}
        checked={checked}
        disabled={mergedDisabled || disableCheckbox}
        indeterminate={halfChecked}
        onClick={onCheck}
        className={semanticCls.checkbox}
      />
    );
  };

  // =================== Render: Drop Indicator ===================
  const renderDropIndicator = () => {
    const treeDraggable = !!draggable;
    // allowDrop is calculated in Tree.tsx, there is no need for calc it here
    const showIndicator = !disabled && treeDraggable && dragOverNodeKey === eventKey;

    if (!showIndicator) return null;

    const offset = 24;
    const style: React.CSSProperties = {
      left: -dropLevelOffset! * indent + offset + level * indent,
      right: 0,
    };

    switch (dropPosition) {
      case -1:
        style.top = 0;
        break;
      case 1:
        style.bottom = 0;
        break;
      default:
        style.bottom = 0;
        style.left = (level + 1) * indent + offset;
        break;
    }
    return <div style={style} className={dropIndicatorCls} />;
  };

  // ==================== Render: Title + Icon ====================
  const renderSelector = () => {
    let $icon;

    if (showIcon) {
      const currentIcon = icon || treeIcon;

      $icon = currentIcon ? (
        <span className={iconCls}>
          {typeof currentIcon === 'function'
            ? currentIcon({ ...props, leaf: mergedLeaf })
            : currentIcon}
        </span>
      ) : null;
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

    const $title = <span className={titleCls}>{titleNode}</span>;

    return (
      <span
        ref={selectHandle}
        title={typeof title === 'string' ? title : ''}
        className={contentCls}
      >
        {renderCheckbox()}
        {$icon}
        {$title}
      </span>
    );
  };

  // ========================== Render ============================
  const ariaSelected = selectable !== undefined ? { 'aria-selected': !!selectable } : undefined;
  const dataOrAriaAttributeProps = pickAttrs(restProps, { aria: true, data: true });
  const draggableWithoutDisabled = !mergedDisabled && mergedDraggable;

  return (
    <div
      ref={ref}
      className={nodeCls}
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...ariaSelected}
      {...dataOrAriaAttributeProps}
    >
      <Indent
        prefixCls={prefixCls}
        level={level}
        isStart={isStart}
        isEnd={isEnd}
        showLine={showLine}
        width={indent}
        className={semanticCls.indent}
      />
      {renderDragHandler()}
      {renderSwitcher()}
      {renderSelector()}
      {renderDropIndicator()}
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

export default React.memo(TreeNode);
