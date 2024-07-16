import type { ValidateStatus } from '../form/FormItem';
import { clsx } from './classNameUtils';

const InputStatuses = ['warning', 'error', ''] as const;
export type InputStatus = (typeof InputStatuses)[number];

export function getStatusClassNames(status?: ValidateStatus, hasFeedback?: boolean) {
  return clsx({
    '1': status === 'success',
    'ring-warning-border focus-within:ring-warning focus:ring-warning': status === 'warning',
    'ring-error-border focus-within:ring-error focus:ring-error': status === 'error',
    '4': status === 'validating',
    '5': hasFeedback,
  });
}

export const getMergedStatus = (contextStatus?: ValidateStatus, customStatus?: InputStatus) =>
  customStatus || contextStatus;
