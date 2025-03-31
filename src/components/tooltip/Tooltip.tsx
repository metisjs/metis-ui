import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import ContextIsolator from '@util/ContextIsolator';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { useZIndex } from '@util/hooks/useZIndex';
import getArrowClassName from '@util/placementArrow';
import getPlacements from '@util/placements';
import { isFragment } from '@util/reactNode';
import ZIndexContext from '@util/ZIndexContext';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import { ConfigContext } from '../config-provider';
import type { BuildInPlacements, TriggerRef } from '../trigger';
import Trigger from '../trigger';
import type { TooltipProps, TooltipRef } from './interface';
import Popup from './Popup';
import { parseColor } from './util';

const Tooltip = React.forwardRef<TooltipRef, TooltipProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
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
    align = {},
    defaultOpen,
    transition,
    ...restProps
  } = props;

  const { getPopupContainer: getContextPopupContainer, getPrefixCls } =
    React.useContext(ConfigContext);

  // ============================== Ref ===============================
  const tooltipRef = React.useRef<TriggerRef>(null);

  const forceAlign = () => {
    tooltipRef.current?.forceAlign();
  };

  React.useImperativeHandle(ref, () => ({
    forceAlign,
    nativeElement: tooltipRef.current?.nativeElement,
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
    <ContextIsolator space>
      {typeof memoOverlay === 'function' ? memoOverlay() : memoOverlay}
    </ContextIsolator>
  );

  const prefixCls = getPrefixCls('tooltip', customizePrefixCls);

  let tempOpen = open;
  // Hide tooltip when there is no title
  if (!('open' in props) && noTitle) {
    tempOpen = false;
  }

  // ============================= Style =============================
  const semanticCls = useSemanticCls(className, 'tooltip', { open: tempOpen });

  const overlayCls = clsx(
    'visible absolute box-border block w-max max-w-[250px] origin-[var(--arrow-x,50%)_var(--arrow-y,50%)] [--metis-arrow-background-color:var(--spotlight)]',
    semanticCls.overlay,
  );

  // ============================= Render =============================
  const child =
    React.isValidElement(children) && !isFragment(children) ? children : <span>{children}</span>;

  // Color
  const colorInfo = parseColor(color);
  const formattedOverlayInnerStyle = { ...overlayInnerStyle, ...colorInfo.overlayStyle };
  const arrowContentStyle = colorInfo.arrowStyle;

  const mergedArrow = React.useMemo(
    () =>
      !!arrow
        ? {
            className: getArrowClassName({
              limitVerticalRadius: true,
              custom: semanticCls.arrow,
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
      className={semanticCls.content}
    >
      {memoOverlayWrapper}
    </Popup>
  );

  // ============================ zIndex ============================
  const [zIndex, contextZIndex] = useZIndex('Tooltip');

  return (
    <ZIndexContext.Provider value={contextZIndex}>
      <Trigger
        {...restProps}
        className={{
          root: semanticCls.root,
          popup: overlayCls,
        }}
        prefixCls={prefixCls}
        popup={getPopupElement}
        action={trigger}
        builtinPlacements={tooltipPlacements}
        popupPlacement={placement}
        ref={tooltipRef}
        zIndex={zIndex}
        popupAlign={align}
        popupOpen={tempOpen}
        onPopupOpenChange={onOpenChange}
        afterPopupOpenChange={afterOpenChange}
        popupTransition={
          transition ?? {
            enter: 'transition duration-[100ms]',
            enterFrom: 'opacity-0 scale-[0.8]',
            enterTo: 'opacity-100 scale-100',
            leave: 'transition duration-[100ms]',
            leaveFrom: 'opacity-100 scale-100 ',
            leaveTo: 'opacity-0 scale-[0.8]',
          }
        }
        defaultPopupOpen={defaultOpen}
        autoDestroy={!!destroyTooltipOnHide}
        mouseLeaveDelay={mouseLeaveDelay}
        mouseEnterDelay={mouseEnterDelay}
        arrow={mergedArrow}
        popupStyle={{ ...arrowContentStyle, ...overlayStyle }}
        getPopupContainer={getPopupContainer || getTooltipContainer || getContextPopupContainer}
      >
        {child}
      </Trigger>
    </ZIndexContext.Provider>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Tooltip.displayName = 'Tooltip';
}

export default Tooltip;
