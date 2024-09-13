import type { Variant } from '../config-provider';
import type { ValidateStatus } from '../form/FormItem';
import { clsx } from './classNameUtils';

const InputStatuses = ['warning', 'error', ''] as const;
export type InputStatus = (typeof InputStatuses)[number];

export function getStatusClassNames(status?: ValidateStatus, variant?: Variant, focus?: boolean) {
  const useFocus = typeof focus === 'boolean';

  return clsx(
    {
      'ring-warning focus-within:ring-warning focus:ring-warning': status === 'warning',
      'ring-error focus-within:ring-error focus:ring-error': status === 'error',
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
