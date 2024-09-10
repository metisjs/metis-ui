import type { Variant } from '../config-provider';
import type { ValidateStatus } from '../form/FormItem';
import { clsx } from './classNameUtils';

const InputStatuses = ['warning', 'error', ''] as const;
export type InputStatus = (typeof InputStatuses)[number];

export function getStatusClassNames(status?: ValidateStatus, variant?: Variant, focus?: boolean) {
  const useFocus = typeof focus === 'boolean';

  return clsx(
    {
      '1': status === 'success',
      'text-warning ring-warning-border': status === 'warning',
      'text-error ring-error-border': status === 'error',
      '4': status === 'validating',
    },
    useFocus
      ? {
          'ring-warning': status === 'warning' && focus,
          'ring-error': status === 'error' && focus,
        }
      : {
          'focus-within:ring-warning focus:ring-warning': status === 'warning',
          'focus-within:ring-error focus:ring-error': status === 'error',
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
  );
}

export const getMergedStatus = (contextStatus?: ValidateStatus, customStatus?: InputStatus) =>
  customStatus || contextStatus;
