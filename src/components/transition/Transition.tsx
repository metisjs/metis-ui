import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import { clsx } from '../_util/classNameUtils';
import useLatestValue from '../_util/hooks/useLatestValue';
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

  const initial = useRef(true);
  const changes = useRef([visible]);
  useLayoutEffect(() => {
    if (!initial.current) {
      return;
    }

    if (changes.current[changes.current.length - 1] !== visible) {
      changes.current.push(visible);
      initial.current = false;
    }
  }, [visible]);

  useLayoutEffect(() => {
    if (!appear) {
      initial.current = false;
    }
  }, [appear]);

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
    skip: initial.current && !appear,
    visible,
    styles,
    onStart: () => (visible ? beforeEnter?.() : beforeLeave?.()),
    onStop: () => {
      onVisibleChanged?.(visible);
      if (initial.current) initial.current = false;
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

  // ===================== Render =====================
  let transitionChildren: React.ReactElement | null = null;
  const mergedProps: Record<string, any> = { ...eventProps, visible };

  if (children) {
    if (appear && visible && initial.current && status === TransitionStatus.None) {
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

  console.log(
    status,
    nodeRef.current?.className.replace(
      'meta-popover visible absolute z-[1070] box-border block w-max max-w-[250px] origin-[var(--arrow-x,50%)_var(--arrow-y,50%)] [--meta-arrow-background-color:hsla(var(--neutral-bg-elevated))] placement-top',
      '',
    ),
  );

  // Auto inject ref if child node not have `ref` props
  if (React.isValidElement(transitionChildren) && supportRef(transitionChildren)) {
    const { ref: originNodeRef } = transitionChildren as any;

    if (!originNodeRef) {
      transitionChildren = React.cloneElement<any>(transitionChildren, {
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
