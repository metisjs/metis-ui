import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { CSSProperties } from 'react';
import * as React from 'react';
import { clsx, getComplexCls } from '../_util/classNameUtils';
import getArrowClassName from '../_util/placementArrow';
import getPlacements from '../_util/placements';
import { cloneElement, isFragment, isValidElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import { NoCompactStyle } from '../space/Compact';
import Trigger, { BuildInPlacements } from '../trigger';
import Popup from './Popup';
import { TooltipProps, TooltipRef } from './interface';
import { parseColor } from './util';

const splitObject = <T extends CSSProperties>(
  obj: T,
  keys: (keyof T)[],
): Record<'picked' | 'omitted', T> => {
  const picked: T = {} as T;
  const omitted: T = { ...obj };
  keys.forEach((key) => {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return { picked, omitted };
};

function getDisabledCompatibleChildren(element: React.ReactElement<any>, prefixCls: string) {
  const elementType = element.type as any;
  if (
    ((elementType.__MATE_BUTTON === true || element.type === 'button') && element.props.disabled) ||
    (elementType.__MATE_SWITCH === true && (element.props.disabled || element.props.loading)) ||
    (elementType.__MATE_RADIO === true && element.props.disabled)
  ) {
    const { picked, omitted } = splitObject(element.props.style, [
      'position',
      'left',
      'right',
      'top',
      'bottom',
      'float',
      'display',
      'zIndex',
    ]);
    const spanStyle: React.CSSProperties = {
      display: 'inline-block', // default inline-block is important
      ...picked,
      cursor: 'not-allowed',
      width: element.props.block ? '100%' : undefined,
    };
    const buttonStyle: React.CSSProperties = {
      ...omitted,
      pointerEvents: 'none',
    };
    const child = cloneElement(element, {
      style: buttonStyle,
      className: null,
    });
    return (
      <span
        style={spanStyle}
        className={clsx(element.props.className, `${prefixCls}-disabled-compatible-wrapper`)}
      >
        {child}
      </span>
    );
  }
  return element;
}

const Tooltip = React.forwardRef<TooltipRef, TooltipProps>((props, ref) => {
  const {
    id,
    className,
    getTooltipContainer,
    color,
    overlayInnerStyle,
    children,
    afterOpenChange,
    destroyTooltipOnHide,
    arrow = true,
    title,
    overlay,
    builtinPlacements,
    autoAdjustOverflow = true,
    getPopupContainer,
    placement = 'top',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle,
    trigger,
    align,
    defaultOpen,
  } = props;

  const complexCls = getComplexCls(className);

  const { getPopupContainer: getContextPopupContainer, getPrefixCls } =
    React.useContext(ConfigContext);

  // ============================== Ref ===============================
  const tooltipRef = React.useRef<TooltipRef>(null);

  const forceAlign = () => {
    tooltipRef.current?.forceAlign();
  };

  React.useImperativeHandle(ref, () => ({
    forceAlign,
  }));

  // ============================== Open ==============================
  const [open, setOpen] = useMergedState(false, {
    value: props.open,
    defaultValue: props.defaultOpen,
  });

  const noTitle = !title && !overlay && title !== 0; // overlay for old version compatibility

  const onOpenChange = (vis: boolean) => {
    setOpen(noTitle ? false : vis);
    if (!noTitle) {
      props.onOpenChange?.(vis);
    }
  };

  const tooltipPlacements = React.useMemo<BuildInPlacements>(() => {
    let mergedArrowPointAtCenter;
    if (typeof arrow === 'object') {
      mergedArrowPointAtCenter = arrow.pointAtCenter;
    }
    return (
      builtinPlacements ||
      getPlacements({
        arrowPointAtCenter: mergedArrowPointAtCenter,
        autoAdjustOverflow,
        arrowWidth: !!arrow ? 16 : 0,
        borderRadius: 6,
        offset: 4,
        visibleFirst: true,
      })
    );
  }, [arrow, builtinPlacements]);

  const memoOverlay = React.useMemo<TooltipProps['overlay']>(() => {
    if (title === 0) {
      return title;
    }
    return overlay || title || '';
  }, [overlay, title]);

  const memoOverlayWrapper = (
    <NoCompactStyle>
      {typeof memoOverlay === 'function' ? memoOverlay() : memoOverlay}
    </NoCompactStyle>
  );

  const prefixCls = getPrefixCls('tooltip');

  let tempOpen = open;
  // Hide tooltip when there is no title
  if (!('open' in props) && noTitle) {
    tempOpen = false;
  }

  // ============================= Render =============================
  const child = getDisabledCompatibleChildren(
    isValidElement(children) && !isFragment(children) ? children : <span>{children}</span>,
    prefixCls,
  );
  const childProps = child.props;
  const childCls =
    !childProps.className || typeof childProps.className === 'string'
      ? clsx(childProps.className, {
          [complexCls.open || `${prefixCls}-open`]: true,
        })
      : childProps.className;

  // Color
  const colorInfo = parseColor(color);
  const formattedOverlayInnerStyle = { ...overlayInnerStyle, ...colorInfo.overlayStyle };
  const arrowContentStyle = colorInfo.arrowStyle;

  const customOverlayClassName = clsx(
    'visible absolute z-[1070] box-border block w-max max-w-[250px] origin-[var(--arrow-x,50%)_var(--arrow-y,50%)] [--meta-arrow-background-color:hsla(var(--neutral-bg-spotlight))]',
    complexCls.root,
  );

  const mergedArrow = React.useMemo(
    () =>
      !!arrow
        ? {
            className: getArrowClassName({
              limitVerticalRadius: true,
            }),
          }
        : false,
    [arrow],
  );

  const getPopupElement = () => (
    <Popup
      key="content"
      prefixCls={prefixCls}
      id={id}
      overlayInnerStyle={formattedOverlayInnerStyle}
    >
      {memoOverlayWrapper}
    </Popup>
  );

  return (
    <Trigger
      className={{
        popup: customOverlayClassName,
      }}
      prefixCls={prefixCls}
      popup={getPopupElement}
      action={trigger}
      builtinPlacements={tooltipPlacements}
      popupPlacement={placement}
      ref={tooltipRef}
      popupAlign={align}
      popupOpen={tempOpen}
      onPopupOpenChange={onOpenChange}
      afterPopupOpenChange={afterOpenChange}
      popupTransition={{
        enter: 'transition duration-[100ms]',
        enterFrom: 'opacity-0 scale-[0.8]',
        enterTo: 'opacity-100 scale-100',
        leave: 'transition duration-[100ms]',
        leaveFrom: 'opacity-100 scale-100 ',
        leaveTo: 'opacity-0 scale-[0.8]',
      }}
      defaultPopupOpen={defaultOpen}
      autoDestroy={!!destroyTooltipOnHide}
      mouseLeaveDelay={mouseLeaveDelay}
      mouseEnterDelay={mouseEnterDelay}
      arrow={mergedArrow}
      popupStyle={{ ...arrowContentStyle, ...overlayStyle }}
      getPopupContainer={getPopupContainer || getTooltipContainer || getContextPopupContainer}
    >
      {tempOpen ? cloneElement(child, { className: childCls }) : child}
    </Trigger>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Tooltip.displayName = 'Tooltip';
}

export default Tooltip;
