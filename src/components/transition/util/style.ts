import { CSSProperties } from 'react';
import { clsx } from '../../_util/classNameUtils';
import {
  TransitionStatus,
  TransitionStep,
  TransitionStyle,
  TransitionStyleFn,
  TransitionStyleType,
} from '../interface';

export function splitStyle(node: HTMLElement, style?: TransitionStyle | TransitionStyleFn) {
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

  if (!node) return [];

  let mergedStyle: CSSProperties = {};
  let mergedCls: string = '';

  if (status === TransitionStatus.Enter) {
    const enter = splitStyle(node, styles.enter);
    switch (step) {
      case TransitionStep.Prepare: {
        mergedStyle = {
          ...enter.style,
        };
        mergedCls = clsx(enter.className);
        break;
      }
      case TransitionStep.Start: {
        const enterFrom = splitStyle(node, styles.enterFrom);
        mergedStyle = {
          ...enter.style,
          ...enterFrom.style,
        };
        mergedCls = clsx(enter.className, enterFrom.className);
        break;
      }
      case TransitionStep.Active: {
        const enterTo = splitStyle(node, styles.enterTo);
        mergedStyle = {
          ...enter.style,
          ...enterTo.style,
        };
        mergedCls = clsx(enter.className, enterTo.className);
        break;
      }

      default:
        break;
    }
  } else if (status === TransitionStatus.Leave) {
    const leave = splitStyle(node, styles.leave);
    switch (step) {
      case TransitionStep.Prepare: {
        mergedStyle = {
          ...leave.style,
        };
        mergedCls = clsx(leave.className);
        break;
      }
      case TransitionStep.Start: {
        const leaveFrom = splitStyle(node, styles.leaveFrom);
        mergedStyle = {
          ...leave.style,
          ...leaveFrom.style,
        };
        mergedCls = clsx(leave.className, leaveFrom.className);
        break;
      }
      case TransitionStep.Active: {
        const leaveTo = splitStyle(node, styles.leaveTo);
        mergedStyle = {
          ...leave.style,
          ...leaveTo.style,
        };
        mergedCls = clsx(leave.className, leaveTo.className);
        break;
      }

      default:
        break;
    }
  }

  return [mergedStyle, mergedCls];
}
