import { clsx } from 'meta-ui/es/_util/classNameUtils';
import { CSSProperties } from 'react';
import {
  TransitionStatus,
  TransitionStep,
  TransitionStyle,
  TransitionStyleType,
} from '../interface';

export function splitStyle(style?: TransitionStyle) {
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
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
  },
  status: TransitionStatus,
  step: TransitionStep,
): [CSSProperties, string] | [] {
  if (status === TransitionStatus.None || step === TransitionStep.None) return [];

  const mergedStyle = {
    [TransitionStatus.Enter]: {
      [TransitionStep.Prepare]: {
        ...styles.enter.style,
      },
      [TransitionStep.Start]: {
        ...styles.enter.style,
        ...styles.enterFrom.style,
      },
      [TransitionStep.Active]: {
        ...styles.enter.style,
        ...styles.enterTo.style,
      },
    },
    [TransitionStatus.Leave]: {
      [TransitionStep.Prepare]: {
        ...styles.leave.style,
      },
      [TransitionStep.Start]: {
        ...styles.leave.style,
        ...styles.leaveFrom.style,
      },
      [TransitionStep.Active]: {
        ...styles.leave.style,
        ...styles.leaveTo.style,
      },
    },
  };
  const mergedCls = {
    [TransitionStatus.Enter]: {
      [TransitionStep.Prepare]: clsx(styles.enter.className),
      [TransitionStep.Start]: clsx(styles.enter.className, styles.enterFrom.className),
      [TransitionStep.Active]: clsx(styles.enter.className, styles.enterTo.className),
    },
    [TransitionStatus.Leave]: {
      [TransitionStep.Prepare]: clsx(styles.leave.className),
      [TransitionStep.Start]: clsx(styles.leave.className, styles.leaveFrom.className),
      [TransitionStep.Active]: clsx(styles.leave.className, styles.leaveTo.className),
    },
  };

  return [mergedStyle[status][step], mergedCls[status][step]];
}
