import { CSSProperties } from 'react';
import { clsx } from '../../_util/classNameUtils';
import {
  TransitionStatus,
  TransitionStep,
  TransitionStyle,
  TransitionStyleFn,
  TransitionStyleType,
} from '../interface';

export function splitStyle(node: HTMLElement | null, style?: TransitionStyle | TransitionStyleFn) {
  if (typeof style === 'function') {
    return splitStyle(node, style(node));
  }

  let result: any = {};
  if (typeof style === 'string') {
    result.className = style;
  } else if (typeof style === 'object') {
    if ('className' in style || 'style' in style) {
      result = style as TransitionStyleType;
    } else {
      result.style = style;
    }
  }

  result.className = result.className ?? '';
  result.style = result.style ?? {};

  result.className = result.className.split(' ').filter(Boolean);

  return result as TransitionStyleType;
}

export function getStylesByStatusAndStep(
  styles: {
    enter?: TransitionStyle;
    enterFrom?: TransitionStyle;
    enterTo?: TransitionStyle;
    leave?: TransitionStyle;
    leaveFrom?: TransitionStyle;
    leaveTo?: TransitionStyle;
  },
  status: TransitionStatus,
  step: TransitionStep,
  getElement: () => HTMLElement | null,
): [CSSProperties, string] | [] {
  if (status === TransitionStatus.None || step === TransitionStep.None) return [];

  const node = getElement();

  const enter = splitStyle(node, styles.enter);
  const enterFrom = splitStyle(node, styles.enterFrom);
  const enterTo = splitStyle(node, styles.enterTo);
  const leave = splitStyle(node, styles.leave);
  const leaveFrom = splitStyle(node, styles.leaveFrom);
  const leaveTo = splitStyle(node, styles.leaveTo);

  const mergedStyle = {
    [TransitionStatus.Enter]: {
      [TransitionStep.Prepare]: {
        ...enter.style,
      },
      [TransitionStep.Start]: {
        ...enter.style,
        ...enterFrom.style,
      },
      [TransitionStep.Active]: {
        ...enter.style,
        ...enterTo.style,
      },
    },
    [TransitionStatus.Leave]: {
      [TransitionStep.Prepare]: {
        ...leave.style,
      },
      [TransitionStep.Start]: {
        ...leave.style,
        ...leaveFrom.style,
      },
      [TransitionStep.Active]: {
        ...leave.style,
        ...leaveTo.style,
      },
    },
  };
  const mergedCls = {
    [TransitionStatus.Enter]: {
      [TransitionStep.Prepare]: clsx(enter.className),
      [TransitionStep.Start]: clsx(enter.className, enterFrom.className),
      [TransitionStep.Active]: clsx(enter.className, enterTo.className),
    },
    [TransitionStatus.Leave]: {
      [TransitionStep.Prepare]: clsx(leave.className),
      [TransitionStep.Start]: clsx(leave.className, leaveFrom.className),
      [TransitionStep.Active]: clsx(leave.className, leaveTo.className),
    },
  };

  return [mergedStyle[status][step], mergedCls[status][step]];
}
