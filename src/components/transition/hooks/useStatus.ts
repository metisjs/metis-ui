import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useState from 'rc-util/lib/hooks/useState';
import { MutableRefObject, useEffect, useRef } from 'react';
import useLatestValue from '../../_util/hooks/useLatestValue';
import {
  TransitionBeforeEventHandler,
  TransitionEventHandler,
  TransitionStatus,
  TransitionStep,
  TransitionStyleType,
} from '../interface';
import { getStylesByStatusAndStep } from '../util/style';
import useDomEvents from './useDomEvents';
import useStepQueue, { isActive } from './useStepQueue';

interface StatusArgs {
  appear?: boolean;
  visible: boolean;
  styles: MutableRefObject<{
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
  }>;
  deadline?: number;
  getElement: () => HTMLElement | null;
  beforeEnter?: TransitionBeforeEventHandler;
  afterEnter?: TransitionEventHandler;
  beforeLeave?: TransitionBeforeEventHandler;
  afterLeave?: TransitionEventHandler;
  onVisibleChanged?: (visible: boolean) => void;
}

export default function useStatus({
  appear,
  visible,
  deadline = 0,
  styles,
  getElement,
  beforeEnter,
  afterEnter,
  beforeLeave,
  afterLeave,
  onVisibleChanged,
}: StatusArgs): [
  TransitionStatus,
  TransitionStep,
  React.CSSProperties | undefined,
  string | undefined,
  boolean,
] {
  // Used for outer render usage to avoid `visible: false & status: none` to render nothing
  const [asyncVisible, setAsyncVisible] = useState<boolean>();
  const [status, setStatus] = useState(TransitionStatus.None);

  const mountedRef = useRef(false);
  const deadlineRef = useRef<NodeJS.Timeout>();
  const activeRef = useRef(false);

  const beforeEnterRef = useLatestValue(beforeEnter);
  const afterEnterRef = useLatestValue(afterEnter);
  const beforeLeaveRef = useLatestValue(beforeLeave);
  const afterLeaveRef = useLatestValue(afterLeave);

  const handleBefore = visible ? beforeEnterRef : beforeLeaveRef;
  const handleAfter = visible ? afterEnterRef : afterLeaveRef;

  function onInternalMotionEnd(event: TransitionEvent & { deadline?: boolean }) {
    const element = getElement();
    if (event && !event.deadline && event.target !== element) {
      return;
    }

    const currentActive = activeRef.current;

    if (status !== TransitionStatus.None && currentActive) {
      setStatus(TransitionStatus.None, true);
      handleAfter.current?.();
    }
  }

  const [patchTransitionEvents] = useDomEvents(onInternalMotionEnd);

  // ============================= Step =============================

  const [startStep, step] = useStepQueue(status, (oldStep) => {
    if (oldStep === TransitionStep.Prepare) {
      return handleBefore.current?.();
    }

    if (oldStep === TransitionStep.Active) {
      // Patch events when transition needed
      patchTransitionEvents(getElement()!);

      if (deadline > 0) {
        clearTimeout(deadlineRef.current);
        deadlineRef.current = setTimeout(() => {
          onInternalMotionEnd({
            deadline: true,
          } as TransitionEvent & { deadline?: boolean });
        }, deadline);
      }
    }
  });

  const active = isActive(step);
  activeRef.current = active;

  useLayoutEffect(() => {
    setAsyncVisible(visible);

    const isMounted = mountedRef.current;
    mountedRef.current = true;

    let nextStatus: TransitionStatus = TransitionStatus.None;

    // Appear
    if (!isMounted && visible && appear) {
      nextStatus = TransitionStatus.Enter;
    }

    // Enter
    if (isMounted && visible) {
      nextStatus = TransitionStatus.Enter;
    }

    // Leave
    if (isMounted && !visible) {
      nextStatus = TransitionStatus.Leave;
    }

    setStatus(nextStatus);

    if (nextStatus !== TransitionStatus.None) {
      startStep();
    }
  }, [visible]);

  useEffect(() => {
    if (
      // Cancel appear
      status === TransitionStatus.Enter &&
      !appear
    ) {
      setStatus(TransitionStatus.None);
    }
  }, [appear]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      clearTimeout(deadlineRef.current);
    },
    [],
  );

  // Trigger `onVisibleChanged`
  const firstMountChangeRef = useRef(false);
  useEffect(() => {
    // [visible & motion not end] => [!visible & motion end] still need trigger onVisibleChanged
    if (asyncVisible) {
      firstMountChangeRef.current = true;
    }

    if (asyncVisible !== undefined && status === TransitionStatus.None) {
      // Skip first render is invisible since it's nothing changed
      if (firstMountChangeRef.current || asyncVisible) {
        onVisibleChanged?.(asyncVisible);
      }
      firstMountChangeRef.current = true;
    }
  }, [asyncVisible, status]);

  // ============================ Styles ============================
  const [style, className] = getStylesByStatusAndStep(styles.current, status, step);
  let mergedStyle = style;
  if (step !== TransitionStep.Active) {
    mergedStyle = {
      transition: 'none',
      ...mergedStyle,
    };
  }

  if (status === TransitionStatus.Enter && step === TransitionStep.Prepare) {
    mergedStyle = {
      opacity: 0,
      ...mergedStyle,
    };
  }

  return [status, step, mergedStyle, className, asyncVisible ?? visible];
}
