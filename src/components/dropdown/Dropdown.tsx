import useEvent from 'rc-util/lib/hooks/useEvent';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { composeRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import type { AdjustOverflow } from '../_util/placements';
import getPlacements from '../_util/placements';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import type { MenuProps } from '../menu';
import Menu from '../menu';
import Trigger, { ActionType } from '../trigger';
import Overlay from './Overlay';
import useAccessibility from './hooks/useAccessibility';

const Placements = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'top', 'bottom'] as const;

type Placement = (typeof Placements)[number];

type Align = {
  points?: [string, string];
  offset?: [number, number];
  targetOffset?: [number, number];
  overflow?: {
    adjustX?: boolean;
    adjustY?: boolean;
  };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
};

export type DropdownArrowOptions = {
  pointAtCenter?: boolean;
};

export interface DropdownProps {
  menu?: MenuProps;
  autoFocus?: boolean;
  arrow?: boolean | DropdownArrowOptions;
  trigger?: ('click' | 'hover' | 'contextMenu')[];
  dropdownRender?: (originNode: React.ReactNode) => React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  disabled?: boolean;
  destroyPopupOnHide?: boolean;
  align?: Align;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  className?: ComplexClassName<'overlay' | 'open'>;
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
    destroyPopupOnHide,
    align,
    dropdownRender,
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
  const complexCls = getComplexCls(className);

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
    onOpenChange?.(nextOpen);
    setOpen(nextOpen);
  });

  useAccessibility({
    open: mergedOpen,
    triggerRef: childRef,
    onOpenChange: onInnerOpenChange,
    autoFocus,
    overlayRef,
  });

  // =========================== ChildrenNode ============================
  const child = React.Children.only(children) as React.ReactElement<any>;
  const dropdownTrigger = cloneElement(child, {
    className: clsx(
      `${prefixCls}-trigger`,
      mergedOpen && [`${prefixCls}-open`, complexCls.open],
      child.props.className,
    ),
    ref: supportRef(child)
      ? composeRef(childRef, (child as React.ReactElement & { ref: React.Ref<HTMLElement> }).ref)
      : undefined,
    disabled,
  });

  // =========================== Overlay ============================
  const overlayClassNameCustomized = clsx(
    'absolute z-[1050] rounded-md bg-neutral-bg-elevated text-sm shadow-lg ring-1 ring-neutral-border-secondary focus:outline-none',
    arrow &&
      'origin-[var(--arrow-x,50%)_var(--arrow-y,50%)] [--metis-arrow-background-color:hsla(var(--neutral-bg-elevated))]',
    complexCls.overlay,
    complexCls.root,
  );

  const builtinPlacements = getPlacements({
    arrowPointAtCenter: typeof arrow === 'object' && arrow.pointAtCenter,
    autoAdjustOverflow,
    offset: 4,
    arrowWidth: arrow ? 16 : 0,
    borderRadius: 6,
  });

  const onMenuClick = React.useCallback(() => {
    setOpen(false);
  }, []);

  const renderOverlay = () => {
    let overlayNode: React.ReactNode;
    if (menu?.items) {
      overlayNode = <Menu {...menu} />;
    }

    if (dropdownRender) {
      overlayNode = dropdownRender(overlayNode);
    }
    overlayNode = React.Children.only(
      typeof overlayNode === 'string' ? <span>{overlayNode}</span> : overlayNode,
    );

    return (
      <Overlay ref={overlayRef} prefixCls={prefixCls} arrow={arrow} onClick={onMenuClick}>
        {overlayNode}
      </Overlay>
    );
  };

  let triggerHideAction: ActionType[] | undefined = undefined;
  if (trigger.indexOf('contextMenu') !== -1) {
    triggerHideAction = ['click'];
  }

  // ============================ Render ============================
  return (
    <Trigger
      forceRender={forceRender}
      autoDestroy={destroyPopupOnHide}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      alignPoint={alignPoint}
      builtinPlacements={builtinPlacements}
      prefixCls={prefixCls}
      ref={triggerRef}
      className={{
        popup: clsx(
          {
            [`${prefixCls}-show-arrow`]: arrow,
          },
          overlayClassNameCustomized,
        ),
      }}
      action={trigger}
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
};

if (process.env.NODE_ENV !== 'production') {
  Dropdown.displayName = 'Dropdown';
}

export default Dropdown;
