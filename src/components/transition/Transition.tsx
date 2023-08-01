import findDOMNode from 'rc-util/lib/Dom/findDOMNode';
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import { clsx } from '../_util/classNameUtils';
import useLatestValue from '../_util/hooks/useLatestValue';
import DomWrapper from './DomWrapper';
import useStatus from './hooks/useStatus';
import {
  TransitionBeforeEventHandler,
  TransitionEventHandler,
  TransitionStatus,
  TransitionStyle,
} from './interface';
import { splitStyle } from './util/style';

export interface TransitionProps {
  visible?: boolean;
  appear?: boolean;
  /**
   * Create element in view even the element is invisible.
   * Will patch `display: none` style on it.
   */
  forceRender?: boolean;
  /**
   * Remove element when transition end. This will not work when `forceRender` is set.
   */
  removeOnLeave?: boolean;
  /** @private Used by CSSMotionList. Do not use in your production. */
  eventProps?: object;

  enter?: TransitionStyle;
  enterFrom?: TransitionStyle;
  enterTo?: TransitionStyle;
  leave?: TransitionStyle;
  leaveFrom?: TransitionStyle;
  leaveTo?: TransitionStyle;
  entered?: TransitionStyle;

  beforeEnter?: TransitionBeforeEventHandler;
  afterEnter?: TransitionEventHandler;
  beforeLeave?: TransitionBeforeEventHandler;
  afterLeave?: TransitionEventHandler;

  onVisibleChanged?: (visible: boolean) => void;

  children?: (
    props: {
      visible?: boolean;
      className?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    },
    ref: (node: any) => void,
  ) => React.ReactElement;
}

const Transition = React.forwardRef<any, TransitionProps>((props, ref) => {
  const {
    appear,
    visible = true,
    removeOnLeave = true,
    forceRender,
    children,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    entered,
    eventProps,
    beforeEnter,
    beforeLeave,
    afterEnter,
    afterLeave,
    onVisibleChanged,
  } = props;

  // Ref to the react node, it may be a HTMLElement
  const nodeRef = useRef<any>();
  // Ref to the dom wrapper in case ref can not pass to HTMLElement
  const wrapperNodeRef = useRef<any>();

  function getDomElement() {
    try {
      // Here we're avoiding call for findDOMNode since it's deprecated
      // in strict mode. We're calling it only when node ref is not
      // an instance of DOM HTMLElement. Otherwise use
      // findDOMNode as a final resort
      return nodeRef.current instanceof HTMLElement
        ? nodeRef.current
        : // eslint-disable-next-line react/no-find-dom-node
          findDOMNode<HTMLElement>(wrapperNodeRef.current);
    } catch (e) {
      // Only happen when `motionDeadline` trigger but element removed.
      return null;
    }
  }

  const styles = useLatestValue({
    enter: splitStyle(enter),
    enterFrom: splitStyle(enterFrom),
    enterTo: splitStyle(enterTo),
    leave: splitStyle(leave),
    leaveFrom: splitStyle(leaveFrom),
    leaveTo: splitStyle(leaveTo),
    entered: splitStyle(entered),
  });

  const [status] = useStatus({
    appear,
    visible,
    styles,
    getElement: getDomElement,
    beforeEnter,
    beforeLeave,
    afterEnter,
    afterLeave,
    onVisibleChanged,
  });

  // Record whether content has rendered
  // Will return null for un-rendered even when `removeOnLeave={false}`
  const renderedRef = React.useRef(visible);
  if (visible) {
    renderedRef.current = true;
  }

  // ====================== Refs ======================
  const setNodeRef = React.useCallback(
    (node: any) => {
      nodeRef.current = node;
      fillRef(ref, node);
    },
    [ref],
  );

  // ===================== Render =====================
  let transitionChildren: React.ReactElement | null = null;
  const mergedProps: Record<string, any> = { ...eventProps, visible };

  if (children) {
    if (appear && visible && status === TransitionStatus.None) {
      mergedProps.className = clsx(
        ...styles.current.enter.className,
        ...styles.current.enterFrom.className,
      );
      mergedProps.style = { ...styles.current.enter.style, ...styles.current.enterFrom.style };
    }

    if (status !== TransitionStatus.None || visible) {
      transitionChildren = children(mergedProps, setNodeRef);
    } else if (
      status === TransitionStatus.None &&
      !visible &&
      (forceRender || (!removeOnLeave && renderedRef.current))
    ) {
      transitionChildren = children(
        {
          ...mergedProps,
          style: { display: 'none' },
        },
        setNodeRef,
      );
    }
  }

  // Auto inject ref if child node not have `ref` props
  if (React.isValidElement(transitionChildren) && supportRef(transitionChildren)) {
    const { ref: originNodeRef } = transitionChildren as any;

    if (!originNodeRef) {
      transitionChildren = React.cloneElement<any>(transitionChildren, {
        ref: setNodeRef,
      });
    }
  }

  return <DomWrapper ref={wrapperNodeRef}>{transitionChildren}</DomWrapper>;
});

if (process.env.NODE_ENV !== 'production') {
  Transition.displayName = 'Transition';
}

export default Transition;
