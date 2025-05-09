import * as React from 'react';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import { composeRef } from '@rc-component/util/es/ref';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import ResizeObserver from 'rc-resize-observer';
import type { TriggerProps } from '../';
import type { TransitionProps } from '../../transition';
import Transition from '../../transition';
import type { AlignType, ArrowPos, ArrowTypeOuter } from '../interface';
import Arrow from './Arrow';
import Mask from './Mask';
import PopupContent from './PopupContent';

export interface PopupProps {
  prefixCls: string;
  className?: SemanticClassName<{ mask?: string }>;
  style?: React.CSSProperties;
  popup?: TriggerProps['popup'];
  target: HTMLElement | null;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onPointerEnter?: React.MouseEventHandler<HTMLDivElement>;
  zIndex?: number;

  mask?: boolean;
  onOpenChanged: (open: boolean) => void;

  // Arrow
  align: AlignType;
  arrow?: ArrowTypeOuter;
  arrowPos: ArrowPos;

  // Open
  open: boolean;
  /** Tell Portal that should keep in screen. e.g. should wait all motion end */
  keepDom: boolean;
  fresh?: boolean;

  // Click
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  // Transition
  transition?: Partial<TransitionProps>;
  maskTransition?: Partial<TransitionProps>;

  // Portal
  forceRender?: boolean;
  getPopupContainer?: TriggerProps['getPopupContainer'];
  autoDestroy?: boolean;
  portal: React.ComponentType<any>;

  // Align
  ready: boolean;
  offsetX: number;
  offsetY: number;
  offsetR: number;
  offsetB: number;
  onAlign: VoidFunction;
  onPrepare: () => Promise<void>;

  // stretch
  stretch?: string;
  targetWidth?: number;
  targetHeight?: number;
}

const Popup = React.forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
  const {
    popup,
    className,
    prefixCls,
    style,
    target,

    onOpenChanged,

    // Open
    open,
    keepDom,
    fresh,

    // Click
    onClick,

    // Mask
    mask,

    // Arrow
    arrow,
    arrowPos,
    align,

    // Transition
    transition,
    maskTransition,

    // Portal
    forceRender,
    getPopupContainer,
    autoDestroy,
    portal: Portal,

    zIndex,

    onMouseEnter,
    onMouseLeave,
    onPointerEnter,

    ready,
    offsetX,
    offsetY,
    offsetR,
    offsetB,
    onAlign,
    onPrepare,

    stretch,
    targetWidth,
    targetHeight,
  } = props;

  const semanticCls = useSemanticCls(className);

  const childNode = typeof popup === 'function' ? popup() : popup;

  // We can not remove holder only when motion finished.
  const isNodeOpen = open || keepDom;

  // ======================= Container ========================
  const getPopupContainerNeedParams = (getPopupContainer?.length ?? 0) > 0;

  const [show, setShow] = React.useState(!getPopupContainer || !getPopupContainerNeedParams);

  // Delay to show since `getPopupContainer` need target element
  useLayoutEffect(() => {
    if (!show && getPopupContainerNeedParams && target) {
      setShow(true);
    }
  }, [show, getPopupContainerNeedParams, target]);

  // ========================= Render =========================
  if (!show) {
    return null;
  }

  // >>>>> Offset
  const AUTO = 'auto' as const;

  const offsetStyle: React.CSSProperties = {
    left: '-1000vw',
    top: '-1000vh',
    right: AUTO,
    bottom: AUTO,
  };

  // Set align style
  if (ready || !open) {
    const { points = [] } = align;
    const dynamicInset = align.dynamicInset;
    const alignRight = dynamicInset && points[0][1] === 'r';
    const alignBottom = dynamicInset && points[0][0] === 'b';

    if (alignRight) {
      offsetStyle.right = offsetR;
      offsetStyle.left = AUTO;
    } else {
      offsetStyle.left = offsetX;
      offsetStyle.right = AUTO;
    }

    if (alignBottom) {
      offsetStyle.bottom = offsetB;
      offsetStyle.top = AUTO;
    } else {
      offsetStyle.top = offsetY;
      offsetStyle.bottom = AUTO;
    }
  }

  // >>>>> Misc
  const miscStyle: React.CSSProperties = {};
  if (stretch) {
    if (stretch.includes('height') && targetHeight) {
      miscStyle.height = targetHeight;
    } else if (stretch.includes('minHeight') && targetHeight) {
      miscStyle.minHeight = targetHeight;
    }
    if (stretch.includes('width') && targetWidth) {
      miscStyle.width = targetWidth;
    } else if (stretch.includes('minWidth') && targetWidth) {
      miscStyle.minWidth = targetWidth;
    }
  }

  if (!open) {
    miscStyle.pointerEvents = 'none';
  }

  return (
    <Portal
      open={forceRender || isNodeOpen}
      getContainer={getPopupContainer && (() => getPopupContainer(target!))}
      autoDestroy={autoDestroy}
    >
      <Mask
        prefixCls={prefixCls}
        className={semanticCls.mask}
        open={open}
        zIndex={zIndex}
        mask={mask}
        transition={maskTransition}
      />
      <ResizeObserver onResize={onAlign} disabled={!open}>
        {(resizeObserverRef) => (
          <Transition
            appear
            removeOnLeave={false}
            forceRender={forceRender}
            {...transition}
            beforeEnter={onPrepare}
            visible={open}
            afterEnter={transition?.afterEnter}
            afterLeave={transition?.afterLeave}
            onVisibleChanged={(nextVisible) => {
              transition?.onVisibleChanged?.(nextVisible);
              onOpenChanged(nextVisible);
            }}
          >
            {({ className: transitionClx, style: transitionStyle }, transitionRef) => (
              <div
                ref={composeRef(resizeObserverRef, ref, transitionRef)}
                className={clsx(prefixCls, transitionClx, semanticCls.root)}
                style={
                  {
                    '--arrow-x': `${arrowPos.x || 0}px`,
                    '--arrow-y': `${arrowPos.y || 0}px`,
                    ...offsetStyle,
                    ...miscStyle,
                    ...transitionStyle,
                    boxSizing: 'border-box',
                    zIndex,
                    ...style,
                  } as React.CSSProperties
                }
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onPointerEnter={onPointerEnter}
                onClick={onClick}
              >
                {arrow && (
                  <Arrow prefixCls={prefixCls} arrow={arrow} arrowPos={arrowPos} align={align} />
                )}
                <PopupContent cache={!open && !fresh}>{childNode}</PopupContent>
              </div>
            )}
          </Transition>
        )}
      </ResizeObserver>
    </Portal>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Popup.displayName = 'Popup';
}

export default Popup;
