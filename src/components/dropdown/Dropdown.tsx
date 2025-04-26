import * as React from 'react';
import useEvent from '@rc-component/util/es/hooks/useEvent';
import useMergedState from '@rc-component/util/es/hooks/useMergedState';
import { composeRef, getNodeRef, supportRef } from '@rc-component/util/es/ref';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { useZIndex } from '@util/hooks/useZIndex';
import isPrimitive from '@util/isPrimitive';
import getArrowClassName from '@util/placementArrow';
import type { AdjustOverflow } from '@util/placements';
import getPlacements from '@util/placements';
import { cloneElement } from '@util/reactNode';
import ZIndexContext from '@util/ZIndexContext';
import { ConfigContext } from '../config-provider';
import type { MenuProps } from '../menu';
import Menu from '../menu';
import type { ActionType, AlignType } from '../trigger';
import Trigger from '../trigger';
import useAccessibility from './hooks/useAccessibility';
import Overlay from './Overlay';

const Placements = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'top', 'bottom'] as const;

type Placement = (typeof Placements)[number];

export type DropdownArrowOptions = {
  pointAtCenter?: boolean;
};

export interface DropdownProps {
  menu?: MenuProps;
  autoFocus?: boolean;
  arrow?: boolean | DropdownArrowOptions;
  trigger?: ('click' | 'hover' | 'contextMenu')[];
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  onOpenChange?: (open: boolean, info: { source: 'trigger' | 'menu' }) => void;
  open?: boolean;
  disabled?: boolean;
  autoDestroy?: boolean;
  align?: AlignType;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  className?: SemanticClassName<
    { overlay?: string; menu?: MenuProps['className'] },
    { open?: boolean }
  >;
  placement?: Placement;
  forceRender?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  children?: React.ReactNode;
  autoAdjustOverflow?: boolean | AdjustOverflow;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const {
    menu,
    autoFocus,
    arrow,
    prefixCls: customizePrefixCls,
    className,
    children,
    trigger = ['hover'],
    disabled,
    autoDestroy,
    align,
    popupRender,
    getPopupContainer,
    open,
    onOpenChange,
    mouseEnterDelay = 0.15,
    mouseLeaveDelay = 0.1,
    autoAdjustOverflow = true,
    placement = 'bottomLeft',
    forceRender,
  } = props;
  const { getPopupContainer: getContextPopupContainer, getPrefixCls } =
    React.useContext(ConfigContext);

  const triggerRef = React.useRef(null);
  const overlayRef = React.useRef(null);
  const childRef = React.useRef(null);

  const prefixCls = getPrefixCls('dropdown', customizePrefixCls);

  const triggerActions = disabled ? [] : trigger;
  let alignPoint = false;
  if (triggerActions && triggerActions.includes('contextMenu')) {
    alignPoint = true;
  }

  // =========================== Open ============================
  const [mergedOpen, setOpen] = useMergedState(false, {
    value: open,
  });

  const onInnerOpenChange = useEvent((nextOpen: boolean) => {
    onOpenChange?.(nextOpen, { source: 'trigger' });
    setOpen(nextOpen);
  });

  useAccessibility({
    open: mergedOpen,
    triggerRef: childRef,
    onOpenChange: onInnerOpenChange,
    autoFocus,
    overlayRef,
  });

  const semanticCls = useSemanticCls(className, 'dropdown', { open: mergedOpen });

  // =========================== ChildrenNode ============================
  const child = React.Children.only(
    isPrimitive(children) ? <span>{children}</span> : children,
  ) as React.ReactElement<{
    className?: string;
    disabled?: boolean;
  }>;

  const dropdownTrigger = cloneElement(child, {
    className: clsx(
      `${prefixCls}-trigger`,
      disabled && 'cursor-not-allowed',
      child.props.className,
      semanticCls.root,
    ),
    ref: supportRef(child) ? composeRef(childRef, getNodeRef(child)) : undefined,
    disabled,
  });

  // =========================== Overlay ============================

  const overlayCls = clsx(
    {
      [`${prefixCls}-show-arrow`]: arrow,
    },
    'bg-container outline-border-secondary absolute origin-[var(--arrow-x,50%)_var(--arrow-y,50%)] rounded-md text-sm shadow-lg outline backdrop-blur-2xl [--metis-arrow-background-color:var(--container)]',
    semanticCls.overlay,
  );

  const builtinPlacements = getPlacements({
    arrowPointAtCenter: typeof arrow === 'object' && arrow.pointAtCenter,
    autoAdjustOverflow,
    offset: 4,
    arrowWidth: arrow ? 16 : 0,
    borderRadius: 6,
  });

  const mergedArrow = arrow
    ? {
        className: getArrowClassName({
          limitVerticalRadius: true,
          custom: 'after:outline after:outline-border-secondary',
        }),
      }
    : false;

  const onMenuClick = React.useCallback(() => {
    if (menu?.selectable && menu?.multiple) {
      return;
    }
    onOpenChange?.(false, { source: 'menu' });
    setOpen(false);
  }, []);

  const renderOverlay = () => {
    let overlayNode: React.ReactNode;
    if (menu?.items) {
      overlayNode = (
        <Menu {...menu} className={mergeSemanticCls(semanticCls.menu, menu.className)} />
      );
    }

    if (popupRender) {
      overlayNode = popupRender(overlayNode);
    }
    overlayNode = React.Children.only(
      typeof overlayNode === 'string' ? <span>{overlayNode}</span> : overlayNode,
    );

    return (
      <Overlay ref={overlayRef} prefixCls={prefixCls} onClick={onMenuClick}>
        {overlayNode}
      </Overlay>
    );
  };

  let triggerHideAction: ActionType[] | undefined = undefined;
  if (trigger.indexOf('contextMenu') !== -1) {
    triggerHideAction = ['click'];
  }

  // =========================== zIndex ============================
  const [zIndex, contextZIndex] = useZIndex('Dropdown');

  // ============================ Render ============================
  let renderNode = (
    <Trigger
      zIndex={zIndex}
      forceRender={forceRender}
      autoDestroy={autoDestroy}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      alignPoint={alignPoint}
      builtinPlacements={builtinPlacements}
      prefixCls={prefixCls}
      ref={triggerRef}
      className={{
        popup: overlayCls,
      }}
      arrow={mergedArrow}
      action={triggerActions}
      hideAction={triggerHideAction}
      popupPlacement={placement}
      popupAlign={align}
      popupTransition={{
        enter: 'transition ease-out duration-200',
        enterFrom: 'opacity-0 translate-y-1',
        enterTo: 'opacity-100 translate-y-0',
        leave: 'transition ease-in duration-150',
        leaveFrom: 'opacity-100 translate-y-0',
        leaveTo: 'opacity-0 translate-y-1',
      }}
      popupOpen={mergedOpen}
      stretch={!alignPoint ? 'minWidth' : ''}
      popup={renderOverlay}
      onPopupOpenChange={onInnerOpenChange}
      onPopupClick={onMenuClick}
      getPopupContainer={getPopupContainer || getContextPopupContainer}
    >
      {dropdownTrigger}
    </Trigger>
  );

  if (zIndex) {
    renderNode = (
      <ZIndexContext.Provider value={contextZIndex}>{renderNode}</ZIndexContext.Provider>
    );
  }

  return renderNode;
};

if (process.env.NODE_ENV !== 'production') {
  Dropdown.displayName = 'Dropdown';
}

export default Dropdown;
