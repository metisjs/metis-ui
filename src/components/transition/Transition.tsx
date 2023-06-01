/* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import DomWrapper from './DomWrapper';
import useStatus from './hooks/useStatus';
import type {
  TransitionEventHandler,
  TransitionPrepareEventHandler,
  TransitionStatus,
  TransitionStyle,
} from './interface';
import { STATUS_NONE } from './interface';

export interface TransitionProps {
  visible?: boolean;
  appear?: boolean;
  /**
   * Create element in view even the element is invisible.
   * Will patch `display: none` style on it.
   */
  forceRender?: boolean;
  /**
   * Remove element when motion end. This will not work when `forceRender` is set.
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
  /** This will always trigger after final visible changed. Even if no motion configured. */
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
  const { visible = true, removeOnLeave = true, forceRender, children, eventProps } = props;

  // Ref to the react node, it may be a HTMLElement
  const nodeRef = useRef<any>();
  // Ref to the dom wrapper in case ref can not pass to HTMLElement
  const wrapperNodeRef = useRef(null);

  function getDomElement() {
    return nodeRef.current;
  }

  const [status, , statusStyle, statusClassName, mergedVisible] = useStatus(
    visible,
    getDomElement,
    props,
  );

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
  let motionChildren: React.ReactNode;
  const mergedProps = { ...eventProps, visible };

  if (!children) {
    // No children
    motionChildren = null;
  } else if (status === STATUS_NONE) {
    // Stable children
    if (mergedVisible) {
      motionChildren = children({ ...mergedProps }, setNodeRef);
    } else if (forceRender || !removeOnLeave) {
      motionChildren = children({ ...mergedProps, style: { display: 'none' } }, setNodeRef);
    } else {
      motionChildren = null;
    }
  } else {
    motionChildren = children(
      {
        ...mergedProps,
        className: statusClassName ?? undefined,
        style: statusStyle ?? undefined,
      },
      setNodeRef,
    );
  }

  console.log(statusClassName, statusStyle);

  // Auto inject ref if child node not have `ref` props
  if (React.isValidElement(motionChildren) && supportRef(motionChildren)) {
    const { ref: originNodeRef } = motionChildren as any;

    if (!originNodeRef) {
      motionChildren = React.cloneElement<any>(motionChildren, {
        ref: setNodeRef,
      });
    }
  }

  return <DomWrapper ref={wrapperNodeRef}>{motionChildren}</DomWrapper>;
});

if (process.env.NODE_ENV !== 'production') {
  Transition.displayName = 'CSSMotion';
}

export default Transition;
