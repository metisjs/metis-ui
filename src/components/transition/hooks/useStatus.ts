import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { MutableRefObject, useState } from 'react';
import useIsMounted from '../../_util/hooks/useIsMounted';
import useLatestValue from '../../_util/hooks/useLatestValue';
import usePrevious from '../../_util/hooks/usePrevious';
import { once } from '../../_util/once';
import { TransitionStatus, TransitionStyleType } from '../interface';
import disposables from '../util/disposables';
import {
  addClasses,
  addStyles,
  removeClasses,
  removeStyles,
  waitForTransition,
} from '../util/style';

interface StatusArgs {
  skip: boolean;
  visible: boolean;
  styles: MutableRefObject<{
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
    entered: TransitionStyleType;
  }>;
  getElement: () => HTMLElement | null;
  onStart: () => Promise<any> | void;
  onStop: () => void;
}

function clearStyles(
  node: HTMLElement,
  styles: {
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
    entered: TransitionStyleType;
  },
) {
  removeClasses(
    node,
    ...styles.enter.className,
    ...styles.enterTo.className,
    ...styles.enterFrom.className,
    ...styles.leave.className,
    ...styles.leaveTo.className,
    ...styles.leaveFrom.className,
    ...styles.entered.className,
  );
  removeStyles(node, {
    ...styles.enter.style,
    ...styles.enterTo.style,
    ...styles.enterFrom.style,
    ...styles.leave.style,
    ...styles.leaveFrom.style,
    ...styles.leaveTo.style,
    ...styles.entered.style,
  });
}

function transition(
  getElement: () => HTMLElement | null,
  styles: {
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
    entered: TransitionStyleType;
  },
  status: TransitionStatus.Enter | TransitionStatus.Leave,
  done?: () => void,
) {
  const node = getElement()!;
  let d = disposables();
  let _done = done !== undefined ? once(done) : () => {};

  if (status === TransitionStatus.Enter) {
    node.removeAttribute('hidden');
    node.style.display = '';
  }

  const baseCls = styles[status].className;
  const toCls = styles[`${status}To`].className;
  const fromCls = styles[`${status}From`].className;

  const baseStyle = styles[status].style;
  const toStyle = styles[`${status}To`].style;
  const fromStyle = styles[`${status}From`].style;

  addClasses(node, ...baseCls, ...fromCls);
  addStyles(node, { ...baseStyle, ...fromStyle });

  d.nextFrame(() => {
    removeClasses(node, ...fromCls);
    removeStyles(node, fromStyle);
    addClasses(node, ...toCls);
    addStyles(node, toStyle);

    waitForTransition(node, () => {
      removeClasses(node, ...baseCls);
      removeStyles(node, baseStyle);
      addClasses(node, ...styles.entered.className);
      addStyles(node, styles.entered.style);

      return _done();
    });
  });

  return d.dispose;
}

export default function useStatus({
  skip,
  visible,
  styles,
  getElement,
  onStart,
  onStop,
}: StatusArgs) {
  const mounted = useIsMounted();

  const [status, setStatus] = useState(TransitionStatus.None);

  const onStartRef = useLatestValue(onStart);
  const onStopRef = useLatestValue(onStop);

  const prevVisible = usePrevious(visible);
  useLayoutEffect(() => {
    setStatus(() => {
      if (skip) return TransitionStatus.None;
      if (prevVisible === visible) return TransitionStatus.None;
      return visible ? TransitionStatus.Enter : TransitionStatus.Leave;
    });
  }, [skip, visible]);

  useLayoutEffect(() => {
    const dd = disposables();

    if (!getElement()) return; // We don't have a DOM node (yet)
    if (status === TransitionStatus.None) return; // We don't need to transition
    if (!mounted.current) return;

    dd.dispose();

    clearStyles(getElement()!, styles.current);

    const result = onStartRef.current();

    Promise.resolve(result).then(() => {
      dd.add(
        transition(getElement, styles.current, status, () => {
          dd.dispose();
          setStatus(TransitionStatus.None);
          onStopRef.current();
        }),
      );
    });

    return dd.dispose;
  }, [status]);

  return [status];
}
