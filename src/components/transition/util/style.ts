import { clsx } from 'meta-ui/es/_util/classNameUtils';
import { MutableRefObject } from 'react';
import {
  STATUS_APPEAR,
  STATUS_ENTER,
  STATUS_LEAVE,
  STEP_ACTIVE,
  STEP_PREPARE,
  STEP_START,
  StepStatus,
  TransitionStatus,
  TransitionStyle,
  TransitionStyleType,
} from '../interface';

export function splitStyle(style?: TransitionStyle) {
  let result: TransitionStyleType = {};
  if (typeof style === 'string') {
    result.className = style;
  } else if (typeof style === 'object') {
    if ('className' in style || 'style' in style) {
      result = style as TransitionStyleType;
    } else {
      result.style = style;
    }
  }

  return result;
}

export function getStatusStyle(
  targetStatus: TransitionStatus,
  targetStep: StepStatus,
  styles: MutableRefObject<{
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
  }>,
) {
  const styleMap = {
    [`${STATUS_APPEAR}-${STEP_PREPARE}`]: styles.current.enter,
    [`${STATUS_APPEAR}-${STEP_START}`]: styles.current.enterFrom,
    [`${STATUS_APPEAR}-${STEP_ACTIVE}`]: styles.current.enterTo,
    [`${STATUS_ENTER}-${STEP_PREPARE}`]: styles.current.enter,
    [`${STATUS_ENTER}-${STEP_START}`]: styles.current.enterFrom,
    [`${STATUS_ENTER}-${STEP_ACTIVE}`]: styles.current.enterTo,
    [`${STATUS_LEAVE}-${STEP_PREPARE}`]: styles.current.leave,
    [`${STATUS_LEAVE}-${STEP_START}`]: styles.current.leaveFrom,
    [`${STATUS_LEAVE}-${STEP_ACTIVE}`]: styles.current.leaveTo,
  };

  const statusStyle = styleMap[`${targetStatus}-${targetStep}`] ?? {};

  let style = statusStyle.style;
  let className = statusStyle.className;

  const prepareStyle = styleMap[`${targetStatus}-${STEP_PREPARE}`];
  if (
    (prepareStyle?.className || prepareStyle?.style) &&
    (targetStep === STEP_START || targetStep === STEP_ACTIVE)
  ) {
    style = {
      ...prepareStyle?.style,
      ...style,
    };
    className = clsx(prepareStyle?.className, className);
  }

  return { style, className };
}
