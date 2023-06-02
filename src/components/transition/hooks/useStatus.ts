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
} from '../interface';
import useDomMotionEvents from './useDomEvents';
import useStepQueue, { DoStep, isActive } from './useStepQueue';

export default function useStatus(
  visible: boolean,
  getElement: () => HTMLElement,
  { appear, beforeEnter, afterEnter, beforeLeave, afterLeave, onVisibleChanged }: TransitionProps,
): [TransitionStatus, StepStatus, boolean] {
  // Used for outer render usage to avoid `visible: false & status: none` to render nothing
  const [asyncVisible, setAsyncVisible] = useState<boolean>();
  const [status, setStatus] = useState<TransitionStatus>(STATUS_NONE);

  const mountedRef = useRef(false);

  const activeRef = useRef(false);

  /**
   * Clean up status
   */
  function updateTransitionEndStatus() {
    setStatus(STATUS_NONE, true);
  }

  function onInternalTransitionEnd(event: TransitionEvent) {
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
  const [startStep, step] = useStepQueue(status, () => {
    if (step === STEP_PREPARE) {
      const element = getElement();

      if (status === STATUS_APPEAR || status === STATUS_ENTER) {
        beforeEnter?.(element);
      } else if (status === STATUS_LEAVE) {
        beforeLeave?.(element);
      }
    }

    if (step === STEP_ACTIVE) {
      // Patch events when transition needed
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
      // Set back in case no transition but prev status has prepare step
      setStatus(STATUS_NONE);
    }
  }, [visible]);

  // ============================ Effect ============================
  // Reset when transition changed
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
    // [visible & transition not end] => [!visible & transition end] still need trigger onVisibleChanged
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

  return [status, step, asyncVisible ?? visible];
}
