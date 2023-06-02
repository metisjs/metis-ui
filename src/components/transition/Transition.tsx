/* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import useLatestValue from '../_util/hooks/useLatestValue';
import DomWrapper from './DomWrapper';
import useStatus from './hooks/useStatus';
import type {
  TransitionEventHandler,
  TransitionPrepareEventHandler,
  TransitionStatus,
  TransitionStyle,
} from './interface';
import { STATUS_NONE } from './interface';
import { getStatusStyle, splitStyle } from './util/style';

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

  beforeEnter?: TransitionPrepareEventHandler;
  afterEnter?: TransitionEventHandler;
  beforeLeave?: TransitionPrepareEventHandler;
  afterLeave?: TransitionEventHandler;

  // Special
  /** This will always trigger after final visible changed. Even if no transition configured. */
  onVisibleChanged?: (visible: boolean) => void;

  internalRef?: React.Ref<any>;

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

export interface CSSMotionState {
  status?: TransitionStatus;
  statusActive?: boolean;
  newStatus?: boolean;
  statusStyle?: React.CSSProperties;
  prevProps?: TransitionProps;
}

const Transition = React.forwardRef<any, TransitionProps>((props, ref) => {
  const {
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
  } = props;

  // Ref to the react node, it may be a HTMLElement
  const nodeRef = useRef<any>();
  // Ref to the dom wrapper in case ref can not pass to HTMLElement
  const wrapperNodeRef = useRef(null);

  function getDomElement() {
    return nodeRef.current;
  }

  const [status, step, mergedVisible] = useStatus(visible, getDomElement, props);

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

  let styles = useLatestValue({
    enter: splitStyle(enter),
    enterFrom: splitStyle(enterFrom),
    enterTo: splitStyle(enterTo),
    leave: splitStyle(leave),
    leaveFrom: splitStyle(leaveFrom),
    leaveTo: splitStyle(leaveTo),
  });

  // ===================== Render =====================
  let transitionChildren: React.ReactNode;
  const mergedProps = { ...eventProps, visible };

  if (!children) {
    // No children
    transitionChildren = null;
  } else if (status === STATUS_NONE) {
    // Stable children
    if (mergedVisible) {
      transitionChildren = children({ ...mergedProps }, setNodeRef);
    } else if (forceRender || !removeOnLeave) {
      transitionChildren = children({ ...mergedProps, style: { display: 'none' } }, setNodeRef);
    } else {
      transitionChildren = null;
    }
  } else {
    const statusStyle = getStatusStyle(status, step, styles);
    transitionChildren = children(
      {
        ...mergedProps,
        className: statusStyle.className ?? undefined,
        style: statusStyle.style ?? undefined,
      },
      setNodeRef,
    );
    console.log(status, step, statusStyle);
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
  Transition.displayName = 'CSSMotion';
}

export default Transition;
