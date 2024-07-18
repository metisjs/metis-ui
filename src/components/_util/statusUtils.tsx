import { Variant } from '../config-provider';
import type { ValidateStatus } from '../form/FormItem';
import { clsx } from './classNameUtils';

const InputStatuses = ['warning', 'error', ''] as const;
export type InputStatus = (typeof InputStatuses)[number];

export function getStatusClassNames(status?: ValidateStatus, variant?: Variant) {
  return clsx(
    {
      '1': status === 'success',
      'text-warning ring-warning-border focus-within:ring-warning focus:ring-warning':
        status === 'warning',
      'text-error ring-error-border focus-within:ring-error focus:ring-error': status === 'error',
      '4': status === 'validating',
    },
    variant === 'filled' && {
      'bg-warning-bg': status === 'warning',
      'bg-error-bg': status === 'error',
    },
  );
}

export const getMergedStatus = (contextStatus?: ValidateStatus, customStatus?: InputStatus) =>
  customStatus || contextStatus;
