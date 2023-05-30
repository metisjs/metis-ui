import { ComplexClassName, getClassNames } from 'meta-ui/es/_util/classNameUtils';
import ResizeObserver from 'rc-resize-observer';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';
import type { TriggerProps } from '../';
import type { TransitionProps } from '../../transition';
import Transition from '../../transition';
import type { AlignType, ArrowPos, ArrowTypeOuter } from '../interface';
import Arrow from './Arrow';
import Mask from './Mask';
import PopupContent from './PopupContent';

export interface PopupProps {
  className?: ComplexClassName<'mask'>;
  style?: React.CSSProperties;
  popup?: TriggerProps['popup'];
  target: HTMLElement;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  zIndex?: number;

  mask?: boolean;
  onOpenChanged: (open: boolean) => void;

  // Arrow
  align?: AlignType;
  arrow?: ArrowTypeOuter;
  arrowPos: ArrowPos;

  // Open
  open: boolean;
  /** Tell Portal that should keep in screen. e.g. should wait all motion end */
  keepDom: boolean;

  // Click
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  // Transition
  transition?: TransitionProps;
  maskTransition?: TransitionProps;

  // Portal
  forceRender?: boolean;
  getPopupContainer?: TriggerProps['getPopupContainer'];
  autoDestroy?: boolean;
  portal: React.ComponentType<any>;

  // Align
  ready: boolean;
  offsetX: number;
  offsetY: number;
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
    style,
    target,

    onOpenChanged,

    // Open
    open,
    keepDom,

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

    ready,
    offsetX,
    offsetY,
    onAlign,
    onPrepare,

    stretch,
    targetWidth,
    targetHeight,
  } = props;

  const classNames = getClassNames(className);

  const childNode = typeof popup === 'function' ? popup() : popup;

  // We can not remove holder only when motion finished.
  const isNodeVisible = open || keepDom;

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
  const offsetStyle: React.CSSProperties =
    ready || !open
      ? {
          left: offsetX,
          top: offsetY,
        }
      : {
          left: '-1000vw',
          top: '-1000vh',
        };

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
      open={forceRender || isNodeVisible}
      getContainer={getPopupContainer && (() => getPopupContainer(target))}
      autoDestroy={autoDestroy}
    >
      <Mask
        className={classNames.mask}
        open={open}
        zIndex={zIndex}
        mask={mask}
        transition={maskTransition}
      />
      <ResizeObserver onResize={onAlign} disabled={!open}>
        {(resizeObserverRef) => {
          return (
            <Transition
              unmount={!forceRender}
              {...transition}
              beforeEnter={onPrepare}
              show={open}
              afterEnter={() => {
                transition?.afterEnter?.();
                onOpenChanged(true);
              }}
              afterLeave={() => {
                transition?.afterLeave?.();
                onOpenChanged(false);
              }}
            >
              <div
                ref={composeRef(resizeObserverRef, ref)}
                className={classNames.root}
                style={
                  {
                    '--arrow-x': `${arrowPos.x || 0}px`,
                    '--arrow-y': `${arrowPos.y || 0}px`,
                    ...offsetStyle,
                    ...miscStyle,
                    boxSizing: 'border-box',
                    zIndex,
                    ...style,
                  } as React.CSSProperties
                }
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
              >
                {arrow && <Arrow arrow={arrow} arrowPos={arrowPos} align={align} />}
                <PopupContent cache={!open}>{childNode}</PopupContent>
              </div>
            </Transition>
          );
        }}
      </ResizeObserver>
    </Portal>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Popup.displayName = 'Popup';
}

export default Popup;
