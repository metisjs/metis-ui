import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import useLatestValue from '../_util/hooks/useLatestValue';
import usePrevious from '../_util/hooks/usePrevious';
import DomWrapper from './DomWrapper';
import useStatus from './hooks/useStatus';
import {
  TransitionEventHandler,
  TransitionPrepareEventHandler,
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

  beforeEnter?: TransitionPrepareEventHandler;
  afterEnter?: TransitionEventHandler;
  beforeLeave?: TransitionPrepareEventHandler;
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
  } = props;

  // Ref to the react node, it may be a HTMLElement
  const nodeRef = useRef<any>();
  // Ref to the dom wrapper in case ref can not pass to HTMLElement
  const wrapperNodeRef = useRef(null);

  const [initial, setInitial] = React.useState(true);
  useLayoutEffect(() => {
    if (initial === false) {
      return;
    }

    setInitial(false);
  }, []);

  // Skipping initial transition
  const skip = initial && !appear;
  const prevVisible = usePrevious(visible);
  const status = (() => {
    if (skip) return TransitionStatus.None;
    if (prevVisible === visible) return TransitionStatus.None;
    return visible ? TransitionStatus.Enter : TransitionStatus.Leave;
  })();

  const styles = useLatestValue({
    enter: splitStyle(enter),
    enterFrom: splitStyle(enterFrom),
    enterTo: splitStyle(enterTo),
    leave: splitStyle(leave),
    leaveFrom: splitStyle(leaveFrom),
    leaveTo: splitStyle(leaveTo),
    entered: splitStyle(entered),
  });

  useStatus({
    container: nodeRef,
    status,
    styles,
    onStart: () => {
      console.log('start', status);
    },
    onStop: () => {
      console.log('end', status);
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
  let transitionChildren: React.ReactNode;
  const mergedProps = { ...eventProps, visible };

  if (!children) {
    // No children
    transitionChildren = null;
  } else if (status === TransitionStatus.None) {
    // Stable children
    if (visible) {
      transitionChildren = children({ ...mergedProps }, setNodeRef);
    } else if (forceRender || (!removeOnLeave && renderedRef.current)) {
      transitionChildren = children({ ...mergedProps, style: { display: 'none' } }, setNodeRef);
    } else {
      transitionChildren = null;
    }
  } else {
    transitionChildren = children(
      {
        ...mergedProps,
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
