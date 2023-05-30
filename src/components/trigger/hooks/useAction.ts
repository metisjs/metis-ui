import * as React from 'react';
import type { ActionType } from '../interface';

type ActionTypes = ActionType | ActionType[];

function toArray<T>(val?: T | T[]) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

export default function useAction(
  action: ActionTypes,
  showAction?: ActionTypes,
  hideAction?: ActionTypes,
): [showAction: Set<ActionType>, hideAction: Set<ActionType>] {
  return React.useMemo(() => {
    const mergedShowAction = toArray(showAction ?? action);
    const mergedHideAction = toArray(hideAction ?? action);

    const showActionSet = new Set(mergedShowAction);
    const hideActionSet = new Set(mergedHideAction);

    return [showActionSet, hideActionSet];
  }, [action, showAction, hideAction]);
}
