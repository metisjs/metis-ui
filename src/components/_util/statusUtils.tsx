import type { Variant } from '../config-provider';
import type { ValidateStatus } from '../form/FormItem';
import { clsx } from './classNameUtils';

const InputStatuses = ['warning', 'error', ''] as const;
export type InputStatus = (typeof InputStatuses)[number];

export function getStatusClassNames(status?: ValidateStatus, variant?: Variant, focus?: boolean) {
  const useFocus = typeof focus === 'boolean';

  return clsx(
    {
      'border-warning outline-warning focus-within:border-warning focus-within:outline-warning focus:border-warning focus:outline-warning':
        status === 'warning',
      'border-error outline-error focus-within:border-error focus-within:outline-error focus:border-error focus:outline-error':
        status === 'error',
    },
    variant === 'filled' && [
      {
        'bg-warning-bg': status === 'warning',
        'bg-error-bg': status === 'error',
      },
      useFocus
        ? {
            'bg-container': focus,
          }
        : 'focus-within:bg-container focus:bg-container',
    ],
    variant === 'borderless' && {
      'text-warning': status === 'warning',
      'text-error': status === 'error',
    },
  );
}

export const getMergedStatus = (contextStatus?: ValidateStatus, customStatus?: InputStatus) =>
  customStatus || contextStatus;
