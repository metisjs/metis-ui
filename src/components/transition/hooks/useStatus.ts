import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { MutableRefObject } from 'react';
import useIsMounted from '../../_util/hooks/useIsMounted';
import useLatestValue from '../../_util/hooks/useLatestValue';
import { TransitionStatus, TransitionStyleType } from '../interface';
import { addClasses, addStyles, removeClasses, removeStyles } from '../util/style';
import useDomEvents from './useDomEvents';
import useNextFrame from './useNextFrame';

interface StatusArgs {
  container: MutableRefObject<HTMLElement | null>;
  styles: MutableRefObject<{
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
    entered: TransitionStyleType;
  }>;
  status: TransitionStatus;
  onStart: () => void;
  onStop: () => void;
}

export default function useStatus({ container, status, styles, onStart, onStop }: StatusArgs) {
  let mounted = useIsMounted();

  const [nextFrame, cancelNextFrame] = useNextFrame();
  const [patchTransitionEvents] = useDomEvents();

  const onStartRef = useLatestValue(onStart);
  const onStopRef = useLatestValue(onStop);

  useLayoutEffect(() => {
    const node = container.current;
    if (!node) return; // We don't have a DOM node (yet)
    if (status === TransitionStatus.None) return; // We don't need to transition
    if (!mounted.current) return;

    onStartRef.current();

    if (status === TransitionStatus.Enter) {
      node.removeAttribute('hidden');
      node.style.display = '';
    }

    const baseCls = styles.current[status].className;
    const toCls = styles.current[`${status}To`].className;
    const fromCls = styles.current[`${status}From`].className;

    const baseStyle = styles.current[status].style;
    const toStyle = styles.current[`${status}To`].style;
    const fromStyle = styles.current[`${status}From`].style;

    removeClasses(
      node,
      ...styles.current.enter.className,
      ...styles.current.enterTo.className,
      ...styles.current.enterFrom.className,
      ...styles.current.leave.className,
      ...styles.current.leaveFrom.className,
      ...styles.current.leaveTo.className,
      ...styles.current.entered.className,
    );
    removeStyles(node, {
      ...styles.current.enter.style,
      ...styles.current.enterTo.style,
      ...styles.current.enterFrom.style,
      ...styles.current.leave.style,
      ...styles.current.leaveFrom.style,
      ...styles.current.leaveTo.style,
      ...styles.current.entered.style,
    });
    addClasses(node, ...baseCls, ...fromCls);
    addStyles(node, { ...baseStyle, ...fromStyle });

    nextFrame((info) => {
      if (info.isCanceled()) return;

      removeClasses(node, ...fromCls);
      removeStyles(node, fromStyle);
      addClasses(node, ...toCls);
      addStyles(node, toStyle);

      patchTransitionEvents(node, (event) => {
        if (event.target !== event.currentTarget) return;

        removeClasses(node, ...baseCls, ...toCls);
        removeStyles(node, { ...baseStyle, ...toStyle });
        addClasses(node, ...styles.current.entered.className);
        addStyles(node, styles.current.entered.style);

        onStopRef.current();
      });
    });

    return () => {
      cancelNextFrame();
    };
  }, [status]);
}
