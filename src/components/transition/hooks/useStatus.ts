import { clsx } from 'meta-ui/es/_util/classNameUtils';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useState from 'rc-util/lib/hooks/useState';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import type { TransitionProps } from '../Transition';
import type { StepStatus, TransitionStatus } from '../interface';
import {
  STATUS_APPEAR,
  STATUS_ENTER,
  STATUS_LEAVE,
  STATUS_NONE,
  STEP_ACTIVE,
  STEP_PREPARE,
  STEP_START,
} from '../interface';
import { splitStyle } from '../util/style';
import useDomMotionEvents from './useDomEvents';
import useStepQueue, { DoStep, isActive } from './useStepQueue';

export default function useStatus(
  visible: boolean,
  getElement: () => HTMLElement,
  {
    appear,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
    onVisibleChanged,
  }: TransitionProps,
): [TransitionStatus, StepStatus, React.CSSProperties | null, string | null, boolean] {
  // Used for outer render usage to avoid `visible: false & status: none` to render nothing
  const [asyncVisible, setAsyncVisible] = useState<boolean>();
  const [status, setStatus] = useState<TransitionStatus>(STATUS_NONE);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  const [className, setClassName] = useState<string | null>(null);

  const mountedRef = useRef(false);

  const activeRef = useRef(false);

  /**
   * Clean up status & style & class
   */
  function updateTransitionEndStatus() {
    setStatus(STATUS_NONE, true);
    setStyle(null, true);
    setClassName(null, true);
  }

  function onInternalTransitionEnd(event: TransitionEvent | AnimationEvent) {
    const element = getElement();
    if (event && event.target !== element) {
      return;
    }

    const currentActive = activeRef.current;

    if ((status === STATUS_APPEAR || STATUS_ENTER) && currentActive) {
      afterEnter?.(element, event);
    } else if (status === STATUS_LEAVE && currentActive) {
      afterLeave?.(element, event);
    }

    if (status !== STATUS_NONE && currentActive) {
      updateTransitionEndStatus();
    }
  }

  const [patchMotionEvents] = useDomMotionEvents(onInternalTransitionEnd);

  // ============================= Step =============================
  const getEventClsAndStyle = (
    targetStatus: TransitionStatus,
  ): Record<string, { className?: string; style?: React.CSSProperties }> => {
    switch (targetStatus) {
      case STATUS_APPEAR:
        return {
          [STEP_PREPARE]: splitStyle(enter),
          [STEP_START]: splitStyle(enterFrom),
          [STEP_ACTIVE]: splitStyle(enterTo),
        };

      case STATUS_ENTER:
        return {
          [STEP_PREPARE]: splitStyle(enter),
          [STEP_START]: splitStyle(enterFrom),
          [STEP_ACTIVE]: splitStyle(enterTo),
        };

      case STATUS_LEAVE:
        return {
          [STEP_PREPARE]: splitStyle(leave),
          [STEP_START]: splitStyle(leaveFrom),
          [STEP_ACTIVE]: splitStyle(leaveTo),
        };

      default:
        return {};
    }
  };

  const eventClsAndStyle = React.useMemo(() => getEventClsAndStyle(status), [status]);

  const [startStep, step] = useStepQueue(status, () => {
    if (step === STEP_PREPARE) {
      const element = getElement();
      if (status === STATUS_APPEAR || STATUS_ENTER) {
        beforeEnter?.(element);
      } else if (status === STATUS_LEAVE) {
        beforeLeave?.(element);
      }
    }

    // Rest step is sync update
    if (step in eventClsAndStyle) {
      setStyle(eventClsAndStyle[step]?.style || null);
      setClassName(eventClsAndStyle[step]?.className || null);
    }

    if (step === STEP_ACTIVE) {
      // Patch events when motion needed
      patchMotionEvents(getElement());
    }

    return DoStep;
  });

  const active = isActive(step);
  activeRef.current = active;

  // ============================ Status ============================
  // Update with new status
  useLayoutEffect(() => {
    setAsyncVisible(visible);

    const isMounted = mountedRef.current;
    mountedRef.current = true;

    let nextStatus: TransitionStatus = STATUS_NONE;

    // Appear
    if (!isMounted && visible && appear) {
      nextStatus = STATUS_APPEAR;
    }

    // Enter
    if (isMounted && visible) {
      nextStatus = STATUS_ENTER;
    }

    // Leave
    if (isMounted && !visible) {
      nextStatus = STATUS_LEAVE;
    }

    // Update to next status
    if (nextStatus) {
      setStatus(nextStatus);
      startStep();
    } else {
      // Set back in case no motion but prev status has prepare step
      setStatus(STATUS_NONE);
    }
  }, [visible]);

  // ============================ Effect ============================
  // Reset when motion changed
  useEffect(() => {
    if (
      // Cancel appear
      (status === STATUS_APPEAR && !appear) ||
      // Cancel enter
      status === STATUS_ENTER ||
      // Cancel leave
      status === STATUS_LEAVE
    ) {
      setStatus(STATUS_NONE);
    }
  }, [appear]);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  // Trigger `onVisibleChanged`
  const firstMountChangeRef = React.useRef(false);
  useEffect(() => {
    // [visible & motion not end] => [!visible & motion end] still need trigger onVisibleChanged
    if (asyncVisible) {
      firstMountChangeRef.current = true;
    }

    if (asyncVisible !== undefined && status === STATUS_NONE) {
      // Skip first render is invisible since it's nothing changed
      if (firstMountChangeRef.current || asyncVisible) {
        onVisibleChanged?.(asyncVisible);
      }
      firstMountChangeRef.current = true;
    }
  }, [asyncVisible, status]);

  // ============================ Styles ============================
  let mergedStyle = style;
  let mergedClassName = className;
  const prepareClsAndStyle = eventClsAndStyle[STEP_PREPARE];
  if (
    (prepareClsAndStyle?.className || prepareClsAndStyle?.style) &&
    (step === STEP_START || step === STEP_ACTIVE)
  ) {
    mergedStyle = {
      ...prepareClsAndStyle.style,
      ...style,
    };
    mergedClassName = clsx(prepareClsAndStyle.className, className);
  }

  return [status, step, mergedStyle, mergedClassName, asyncVisible ?? visible];
}
