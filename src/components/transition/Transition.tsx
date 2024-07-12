import findDOMNode from 'rc-util/lib/Dom/findDOMNode';
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import useLatestValue from '../_util/hooks/useLatestValue';
import DomWrapper from './DomWrapper';
import useStatus from './hooks/useStatus';
import {
  TransitionBeforeEventHandler,
  TransitionEventHandler,
  TransitionStatus,
  TransitionStyle,
} from './interface';

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
  deadline?: number;
  /** @private Used by CSSMotionList. Do not use in your production. */
  eventProps?: object;

  enter?: TransitionStyle;
  enterFrom?: TransitionStyle;
  enterTo?: TransitionStyle;
  leave?: TransitionStyle;
  leaveFrom?: TransitionStyle;
  leaveTo?: TransitionStyle;

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
    appear = true,
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
    eventProps,
    deadline,
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
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
  });

  const [status, , statusStyle, statusClassName, mergedVisible] = useStatus({
    appear,
    visible,
    styles,
    deadline,
    getElement: getDomElement,
    beforeEnter,
    beforeLeave,
    afterEnter,
    afterLeave,
    onVisibleChanged,
  });

  // Record whether content has rendered
  // Will return null for un-rendered even when `removeOnLeave={false}`
  const renderedRef = React.useRef(mergedVisible);
  if (mergedVisible) {
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
  const mergedProps = { ...eventProps, visible };

  if (!children) {
    // No children
    transitionChildren = null;
  } else if (status === TransitionStatus.None) {
    // Stable children
    if (mergedVisible) {
      transitionChildren = children({ ...mergedProps }, setNodeRef);
    } else if (forceRender || !removeOnLeave) {
      transitionChildren = children({ ...mergedProps, style: { display: 'none' } }, setNodeRef);
    } else {
      transitionChildren = null;
    }
  } else {
    transitionChildren = children(
      {
        ...mergedProps,
        className: statusClassName,
        style: statusStyle,
      },
      setNodeRef,
    );
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
