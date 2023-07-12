import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import { clsx } from '../_util/classNameUtils';
import useLatestValue from '../_util/hooks/useLatestValue';
import warning from '../_util/warning';
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

  children: React.ReactElement;
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
    beforeEnter,
    beforeLeave,
    afterEnter,
    afterLeave,
    onVisibleChanged,
  } = props;

  warning(
    React.isValidElement(children) && supportRef(children),
    'Transition',
    'children is not a valid Element',
  );

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

    onVisibleChanged?.(visible);
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
    onStart: () => {
      if (visible) beforeEnter?.();
      else beforeLeave?.();
    },
    onStop: () => {
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

  let mergedProps: Partial<any> & React.Attributes = { ref: setNodeRef };

  if (appear && visible && initial.current && status === TransitionStatus.None) {
    mergedProps.className = clsx(
      mergedProps.classNames,
      ...styles.current.enter.className,
      ...styles.current.enterFrom.className,
    );
    mergedProps.style = {
      ...mergedProps.style,
      ...styles.current.enter.style,
      ...styles.current.enterFrom.style,
    };
  }

  if (status !== TransitionStatus.None || visible) {
    return React.cloneElement<any>(children, mergedProps);
  }

  if (
    status === TransitionStatus.None &&
    !visible &&
    (forceRender || (!removeOnLeave && renderedRef.current))
  ) {
    return React.cloneElement<any>(children, { ...mergedProps, style: { display: 'none' } });
  }

  return null;
});

if (process.env.NODE_ENV !== 'production') {
  Transition.displayName = 'Transition';
}

export default Transition;
