import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import useLatestValue from '../_util/hooks/useLatestValue';
import useStatus from './hooks/useStatus';
import { TransitionEventHandler, TransitionStatus, TransitionStyle } from './interface';
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

  beforeEnter?: TransitionEventHandler;
  afterEnter?: TransitionEventHandler;
  beforeLeave?: TransitionEventHandler;
  afterLeave?: TransitionEventHandler;

  onVisibleChanged?: (visible: boolean) => void;

  children: React.ReactNode;
}

export interface CSSMotionState {
  status?: TransitionStatus;
  statusActive?: boolean;
  newStatus?: boolean;
  statusStyle?: React.CSSProperties;
  prevProps?: TransitionProps;
}

const Transition = React.forwardRef<any, TransitionProps>((props, ref) => {
  const {
    appear,
    visible = true,
    removeOnLeave = true,
    forceRender,
    children,
    eventProps,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    entered,
    beforeEnter,
    beforeLeave,
    afterEnter,
    afterLeave,
  } = props;

  // Ref to the react node, it may be a HTMLElement
  const nodeRef = useRef<any>();

  const [initial, setInitial] = React.useState(true);
  let changes = useRef([visible]);
  useLayoutEffect(() => {
    if (initial === false) {
      return;
    }

    if (changes.current[changes.current.length - 1] !== visible) {
      changes.current.push(visible);
      setInitial(false);
    }
  }, [visible]);

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
    container: nodeRef,
    skip: initial && !appear,
    visible,
    styles,
    onStart: () => {
      if (initial) setInitial(false);
      if (visible) beforeEnter?.();
      else beforeLeave?.();
    },
    onStop: () => {
      if (visible) afterEnter?.();
      else afterLeave?.();
    },
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

  // ===================== Render ================
  let transitionChildren: React.ReactNode = null;
  const mergedProps = { ...eventProps, visible };

  if (React.isValidElement(children) && supportRef(children)) {
    if (status === TransitionStatus.None) {
      // Stable children
      if (visible) {
        transitionChildren = React.cloneElement<any>(children, {
          ...mergedProps,
          ref: setNodeRef,
        });
      } else if (forceRender || (!removeOnLeave && renderedRef.current)) {
        transitionChildren = React.cloneElement<any>(children, {
          ...mergedProps,
          style: { display: 'none' },
          ref: setNodeRef,
        });
      }
    } else {
      transitionChildren = React.cloneElement<any>(children, {
        ...mergedProps,
        ref: setNodeRef,
      });
    }
  }

  return transitionChildren;
});

if (process.env.NODE_ENV !== 'production') {
  Transition.displayName = 'Transition';
}

export default Transition;
