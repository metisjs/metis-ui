import classNames from 'classnames';
import type { ValidateStatus } from '../form/FormItem';
import { tuple } from './type';

const InputStatuses = tuple('warning', 'error', '');
export type InputStatus = (typeof InputStatuses)[number];

export function getStatusClassNames(status?: ValidateStatus, hasFeedback?: boolean) {
  return classNames({
    '1': status === 'success',
    '2': status === 'warning',
    '3': status === 'error',
    '4': status === 'validating',
    '5': hasFeedback,
  });
}

export const getMergedStatus = (contextStatus?: ValidateStatus, customStatus?: InputStatus) =>
  customStatus || contextStatus;
