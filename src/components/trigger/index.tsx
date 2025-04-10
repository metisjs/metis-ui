import * as React from 'react';
import Portal from '@rc-component/portal';
import { isDOM } from '@rc-component/util/es/Dom/findDOMNode';
import { getShadowRoot } from '@rc-component/util/es/Dom/shadow';
import useEvent from '@rc-component/util/es/hooks/useEvent';
import useId from '@rc-component/util/es/hooks/useId';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import isMobile from '@rc-component/util/es/isMobile';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import ResizeObserver from 'rc-resize-observer';
import { ConfigContext } from '../config-provider';
import type { TransitionProps } from '../transition';
import type { TriggerContextProps } from './Context';
import TriggerContext from './Context';
import useAction from './hooks/useAction';
import useAlign from './hooks/useAlign';
import useWatch from './hooks/useWatch';
import useWinClick from './hooks/useWinClick';
import type {
  ActionType,
  AlignType,
  ArrowPos,
  ArrowTypeOuter,
  BuildInPlacements,
} from './interface';
import Popup from './Popup';
import TriggerWrapper from './TriggerWrapper';
import { getAlignPopupClassName } from './util';

export type { ActionType, AlignType, ArrowTypeOuter as ArrowType, BuildInPlacements };

export interface TriggerRef {
  nativeElement: HTMLElement;
  popupElement: HTMLDivElement;
  forceAlign: VoidFunction;
}

export interface TriggerProps {
  children: React.ReactElement;
  action?: ActionType | ActionType[];
  showAction?: ActionType[];
  hideAction?: ActionType[];

  prefixCls?: string;

  zIndex?: number;

  onPopupAlign?: (element: HTMLElement, align: AlignType) => void;

  stretch?: string;

  // ==================== Open =====================
  popupOpen?: boolean;
  defaultPopupOpen?: boolean;
  onPopupOpenChange?: (open: boolean) => void;
  afterPopupOpenChange?: (open: boolean) => void;

  // =================== Portal ====================
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  forceRender?: boolean;
  autoDestroy?: boolean;

  // ==================== Mask =====================
  mask?: boolean;
  maskClosable?: boolean;

  // =================== Transition ====================
  popupTransition?: Partial<TransitionProps>;
  maskTransition?: Partial<TransitionProps>;

  // ==================== Delay ====================
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;

  focusDelay?: number;
  blurDelay?: number;

  // ==================== Popup ====================
  popup: React.ReactNode | (() => React.ReactNode);
  popupPlacement?: string;
  builtinPlacements?: BuildInPlacements;
  popupAlign?: AlignType;
  popupStyle?: React.CSSProperties;
  getPopupClassNameFromAlign?: (align: AlignType) => string;
  onPopupClick?: React.MouseEventHandler<HTMLDivElement>;

  alignPoint?: boolean;

  /**
   * Trigger will memo content when close.
   * This may affect the case if want to keep content update.
   * Set `fresh` to `false` will always keep update.
   */
  fresh?: boolean;

  // ==================== Arrow ====================
  arrow?: boolean | ArrowTypeOuter;

  className?: SemanticClassName<{ popup?: string; mask?: string }>;

  // =================== Private ===================
  /**
   * @private Get trigger DOM node.
   * Used for some component is function component which can not access by `findDOMNode`
   */
  getTriggerDOMNode?: (node: React.ReactInstance) => HTMLElement;
}

export function generateTrigger(PortalComponent: React.ComponentType<any> = Portal) {
  const Trigger = React.forwardRef<TriggerRef, TriggerProps>((props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      children,

      // Action
      action = 'hover',
      showAction,
      hideAction,

      // Open
      popupOpen,
      defaultPopupOpen,
      onPopupOpenChange,
      afterPopupOpenChange,

      // Delay
      mouseEnterDelay,
      mouseLeaveDelay = 0.1,

      focusDelay,
      blurDelay,

      // Mask
      mask,
      maskClosable = true,

      // Portal
      getPopupContainer,
      forceRender,
      autoDestroy,

      // Popup
      popup,
      popupStyle,

      popupPlacement,
      builtinPlacements = {},
      popupAlign,
      zIndex,
      stretch,
      getPopupClassNameFromAlign,
      fresh,

      alignPoint,

      onPopupClick,
      onPopupAlign,

      // Arrow
      arrow,

      // Transition
      popupTransition,
      maskTransition,

      className,

      // Private
      getTriggerDOMNode,

      ...restProps
    } = props;

    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('trigger-popup', customizePrefixCls);

    const semanticCls = useSemanticCls(className);

    const mergedAutoDestroy = autoDestroy || false;

    // =========================== Mobile ===========================
    const [mobile, setMobile] = React.useState(false);
    useLayoutEffect(() => {
      setMobile(isMobile());
    }, []);

    // ========================== Context ===========================
    const subPopupElements = React.useRef<Record<string, HTMLElement>>({});

    const parentContext = React.useContext(TriggerContext);
    const context = React.useMemo<TriggerContextProps>(() => {
      return {
        registerSubPopup: (id, subPopupEle) => {
          subPopupElements.current[id] = subPopupEle;

          parentContext?.registerSubPopup(id, subPopupEle);
        },
      };
    }, [parentContext]);

    // =========================== Popup ============================
    const id = useId();
    const [popupEle, setPopupEle] = React.useState<HTMLDivElement | null>(null);

    // Used for forwardRef popup. Not use internal
    const externalPopupRef = React.useRef<HTMLDivElement | null>(null);

    const setPopupRef = useEvent((node: HTMLDivElement) => {
      externalPopupRef.current = node;

      if (isDOM(node) && popupEle !== node) {
        setPopupEle(node);
      }

      parentContext?.registerSubPopup(id, node);
    });

    // =========================== Target ===========================
    // Use state to control here since `useRef` update not trigger render
    const [targetEle, setTargetEle] = React.useState<HTMLElement | null>(null);

    // Used for forwardRef target. Not use internal
    const externalForwardRef = React.useRef<HTMLElement | null>(null);

    const setTargetRef = useEvent((node: HTMLElement) => {
      if (isDOM(node) && targetEle !== node) {
        setTargetEle(node);
        externalForwardRef.current = node;
      }
    });

    // ========================== Children ==========================
    const child = React.Children.only(children) as React.ReactElement<any>;
    const originChildProps = child?.props || {};
    const cloneProps: typeof originChildProps = {};

    const inPopupOrChild = useEvent((ele: EventTarget) => {
      const childDOM = targetEle;

      return (
        childDOM?.contains(ele as HTMLElement) ||
        getShadowRoot(childDOM!)?.host === ele ||
        ele === childDOM ||
        popupEle?.contains(ele as HTMLElement) ||
        getShadowRoot(popupEle!)?.host === ele ||
        ele === popupEle ||
        Object.values(subPopupElements.current).some(
          (subPopupEle) => subPopupEle?.contains(ele as HTMLElement) || ele === subPopupEle,
        )
      );
    });

    // ============================ Open ============================
    const [internalOpen, setInternalOpen] = React.useState(defaultPopupOpen || false);

    // Render still use props as first priority
    const mergedOpen = popupOpen ?? internalOpen;

    // We use effect sync here in case `popupOpen` back to `undefined`
    const setMergedOpen = useEvent((nextOpen: boolean) => {
      if (popupOpen === undefined) {
        setInternalOpen(nextOpen);
      }
    });

    useLayoutEffect(() => {
      setInternalOpen(popupOpen || false);
    }, [popupOpen]);

    const openRef = React.useRef(mergedOpen);
    openRef.current = mergedOpen;

    const lastTriggerRef = React.useRef<boolean[]>([]);
    lastTriggerRef.current = [];

    const internalTriggerOpen = useEvent((nextOpen: boolean) => {
      setMergedOpen(nextOpen);

      // Enter or Pointer will both trigger open state change
      // We only need take one to avoid duplicated change event trigger
      // Use `lastTriggerRef` to record last open type
      if ((lastTriggerRef.current[lastTriggerRef.current.length - 1] ?? mergedOpen) !== nextOpen) {
        lastTriggerRef.current.push(nextOpen);
        onPopupOpenChange?.(nextOpen);
      }
    });

    // Trigger for delay
    const delayRef = React.useRef<any>(null);

    const clearDelay = () => {
      clearTimeout(delayRef.current);
    };

    const triggerOpen = (nextOpen: boolean, delay = 0) => {
      clearDelay();

      if (delay === 0) {
        internalTriggerOpen(nextOpen);
      } else {
        delayRef.current = setTimeout(() => {
          internalTriggerOpen(nextOpen);
        }, delay * 1000);
      }
    };

    React.useEffect(() => clearDelay, []);

    // ========================== Transition ============================
    const [inTransition, setInTransition] = React.useState(false);

    useLayoutEffect(
      (firstMount) => {
        if (!firstMount || mergedOpen) {
          setInTransition(true);
        }
      },
      [mergedOpen],
    );

    const [transitionPrepareResolve, setTransitionPrepareResolve] =
      React.useState<VoidFunction | null>(null);

    // =========================== Align ============================
    const [mousePos, setMousePos] = React.useState<[x: number, y: number]>([0, 0]);

    const setMousePosByEvent = (event: Pick<React.MouseEvent, 'clientX' | 'clientY'>) => {
      setMousePos([event.clientX, event.clientY]);
    };

    const [
      ready,
      offsetX,
      offsetY,
      offsetR,
      offsetB,
      arrowX,
      arrowY,
      scaleX,
      scaleY,
      alignInfo,
      onAlign,
    ] = useAlign(
      mergedOpen,
      popupEle,
      alignPoint && mousePos !== null ? mousePos : targetEle,
      popupPlacement,
      builtinPlacements,
      popupAlign,
      onPopupAlign,
    );

    const [showActions, hideActions] = useAction(mobile, action, showAction, hideAction);

    const clickToShow = showActions.has('click');
    const clickToHide =
      hideActions.has('click') || hideActions.has('contextMenu') || hideActions.has('doubleClick');

    const triggerAlign = useEvent(() => {
      if (!inTransition) {
        onAlign();
      }
    });

    const onScroll = () => {
      if (openRef.current && alignPoint && clickToHide) {
        triggerOpen(false);
      }
    };

    useWatch(mergedOpen, targetEle, popupEle, triggerAlign, onScroll);

    useLayoutEffect(() => {
      triggerAlign();
    }, [mousePos, popupPlacement]);

    // When no builtinPlacements and popupAlign changed
    useLayoutEffect(() => {
      if (mergedOpen && !builtinPlacements?.[popupPlacement ?? '']) {
        triggerAlign();
      }
    }, [JSON.stringify(popupAlign)]);

    const alignedClassName = React.useMemo(() => {
      const baseClassName = getAlignPopupClassName(builtinPlacements, alignInfo, !!alignPoint);

      return clsx(baseClassName, getPopupClassNameFromAlign?.(alignInfo));
    }, [alignInfo, getPopupClassNameFromAlign, builtinPlacements, prefixCls, alignPoint]);

    // ============================ Refs ============================
    React.useImperativeHandle(ref, () => ({
      nativeElement: externalForwardRef.current!,
      popupElement: externalPopupRef.current!,
      forceAlign: triggerAlign,
    }));

    // ========================== Stretch ===========================
    const [targetWidth, setTargetWidth] = React.useState(0);
    const [targetHeight, setTargetHeight] = React.useState(0);

    const syncTargetSize = () => {
      if (stretch && targetEle) {
        const rect = targetEle.getBoundingClientRect();
        setTargetWidth(rect.width);
        setTargetHeight(rect.height);
      }
    };

    const onTargetResize = () => {
      syncTargetSize();
      triggerAlign();
    };

    // ========================== Transition ============================
    const onOpenChanged = (open: boolean) => {
      setInTransition(false);
      onAlign();
      afterPopupOpenChange?.(open);
    };

    // We will trigger align when transition is in prepare
    const onPrepare = () =>
      new Promise<void>((resolve) => {
        syncTargetSize();
        setTransitionPrepareResolve(() => resolve);
      });

    useLayoutEffect(() => {
      if (transitionPrepareResolve) {
        onAlign();
        transitionPrepareResolve();
        setTransitionPrepareResolve(null);
      }
    }, [transitionPrepareResolve]);

    // =========================== Action ===========================
    /**
     * Util wrapper for trigger action
     */
    function wrapperAction<Event extends React.SyntheticEvent>(
      eventName: string,
      nextOpen: boolean,
      delay?: number,
      preEvent?: (event: Event) => void,
    ) {
      cloneProps[eventName] = (event: any, ...args: any[]) => {
        preEvent?.(event);
        triggerOpen(nextOpen, delay);

        // Pass to origin
        originChildProps[eventName]?.(event, ...args);
      };
    }

    // ======================= Action: Click ========================
    if (clickToShow || clickToHide) {
      cloneProps.onClick = (event: React.MouseEvent<HTMLElement>, ...args: any[]) => {
        if (openRef.current && clickToHide) {
          triggerOpen(false);
        } else if (!openRef.current && clickToShow) {
          setMousePosByEvent(event);
          triggerOpen(true);
        }

        // Pass to origin
        originChildProps.onClick?.(event, ...args);
      };
    }

    // Click to hide is special action since click popup element should not hide
    useWinClick(
      mergedOpen,
      clickToHide,
      targetEle,
      popupEle,
      !!mask,
      maskClosable,
      inPopupOrChild,
      triggerOpen,
    );

    // ======================= Action: Hover ========================
    const hoverToShow = showActions.has('hover');
    const hoverToHide = hideActions.has('hover');

    let onPopupMouseEnter: React.MouseEventHandler<HTMLDivElement> = () => {};
    let onPopupMouseLeave: VoidFunction = () => {};

    if (hoverToShow) {
      // Compatible with old browser which not support pointer event
      wrapperAction<React.MouseEvent>('onMouseEnter', true, mouseEnterDelay, (event) => {
        setMousePosByEvent(event);
      });
      wrapperAction<React.PointerEvent>('onPointerEnter', true, mouseEnterDelay, (event) => {
        setMousePosByEvent(event);
      });
      onPopupMouseEnter = (event) => {
        // Only trigger re-open when popup is visible
        if ((mergedOpen || inTransition) && popupEle?.contains(event.target as HTMLElement)) {
          triggerOpen(true, mouseEnterDelay);
        }
      };

      // Align Point
      if (alignPoint) {
        cloneProps.onMouseMove = (event: React.MouseEvent) => {
          // setMousePosByEvent(event);
          originChildProps.onMouseMove?.(event);
        };
      }
    }

    if (hoverToHide) {
      wrapperAction('onMouseLeave', false, mouseLeaveDelay);
      wrapperAction('onPointerLeave', false, mouseLeaveDelay);
      onPopupMouseLeave = () => {
        triggerOpen(false, mouseLeaveDelay);
      };
    }

    // ======================= Action: Focus ========================
    if (showActions.has('focus')) {
      wrapperAction('onFocus', true, focusDelay);
    }

    if (hideActions.has('focus')) {
      wrapperAction('onBlur', false, blurDelay);
    }

    // ==================== Action: ContextMenu =====================
    if (showActions.has('contextMenu')) {
      cloneProps.onContextMenu = (event: React.MouseEvent, ...args: any[]) => {
        if (openRef.current && hideActions.has('contextMenu')) {
          triggerOpen(false);
        } else {
          setMousePosByEvent(event);
          triggerOpen(true);
        }

        event.preventDefault();

        // Pass to origin
        originChildProps.onContextMenu?.(event, ...args);
      };
    }

    // ==================== Action: DoubleClick =====================
    if (showActions.has('doubleClick')) {
      wrapperAction<React.MouseEvent<HTMLElement>>('onDoubleClick', true, 0, (event) => {
        setMousePosByEvent(event);
      });
    }

    // ========================= ClassName ==========================
    if (semanticCls.root) {
      cloneProps.className = clsx(originChildProps.className, semanticCls.root);
    }

    // =========================== Render ===========================
    const mergedChildrenProps = {
      ...originChildProps,
      ...cloneProps,
    };

    // Pass props into cloneProps for nest usage
    const passedProps: Record<string, any> = {};
    const passedEventList = [
      'onContextMenu',
      'onClick',
      'onDoubleClick',
      'onMouseDown',
      'onTouchStart',
      'onMouseEnter',
      'onMouseLeave',
      'onFocus',
      'onBlur',
    ];

    passedEventList.forEach((eventName) => {
      if ((restProps as any)[eventName]) {
        passedProps[eventName] = (...args: any[]) => {
          mergedChildrenProps[eventName]?.(...args);
          (restProps as any)[eventName](...args);
        };
      }
    });

    // Child Node
    const triggerNode = React.cloneElement(child, {
      ...mergedChildrenProps,
      ...passedProps,
    });

    const arrowPos: ArrowPos = {
      x: arrowX,
      y: arrowY,
    };

    const innerArrow: ArrowTypeOuter | undefined = arrow
      ? {
          // true and Object likely
          ...(arrow !== true ? arrow : {}),
        }
      : undefined;

    // Render
    return (
      <>
        <ResizeObserver disabled={!mergedOpen} ref={setTargetRef} onResize={onTargetResize}>
          <TriggerWrapper getTriggerDOMNode={getTriggerDOMNode}>{triggerNode}</TriggerWrapper>
        </ResizeObserver>
        <TriggerContext.Provider value={context}>
          <Popup
            portal={PortalComponent}
            ref={setPopupRef}
            prefixCls={prefixCls}
            popup={popup}
            className={{ root: clsx(semanticCls.popup, alignedClassName), mask: semanticCls.mask }}
            style={popupStyle}
            target={targetEle}
            onMouseEnter={onPopupMouseEnter}
            onMouseLeave={onPopupMouseLeave}
            onPointerEnter={onPopupMouseEnter}
            zIndex={zIndex}
            // Open
            open={mergedOpen}
            keepDom={inTransition}
            fresh={fresh}
            // Click
            onClick={onPopupClick}
            // Mask
            mask={mask}
            // Transition
            transition={popupTransition}
            maskTransition={maskTransition}
            onOpenChanged={onOpenChanged}
            onPrepare={onPrepare}
            // Portal
            forceRender={forceRender}
            autoDestroy={mergedAutoDestroy}
            getPopupContainer={getPopupContainer}
            // Arrow
            align={alignInfo}
            arrow={innerArrow}
            arrowPos={arrowPos}
            // Align
            ready={ready}
            offsetX={offsetX}
            offsetY={offsetY}
            offsetR={offsetR}
            offsetB={offsetB}
            onAlign={triggerAlign}
            // Stretch
            stretch={stretch}
            targetWidth={targetWidth / scaleX}
            targetHeight={targetHeight / scaleY}
          />
        </TriggerContext.Provider>
      </>
    );
  });

  if (process.env.NODE_ENV !== 'production') {
    Trigger.displayName = 'Trigger';
  }

  return Trigger;
}

export default generateTrigger(Portal);
