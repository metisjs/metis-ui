import { clsx } from './classNameUtils';

export const PresetStatusColorTypes = [
  'success',
  'processing',
  'error',
  'default',
  'warning',
] as const;

export type PresetStatusColorType = (typeof PresetStatusColorTypes)[number];

export function isPresetStatusColor(color?: any): color is PresetStatusColorType {
  return PresetStatusColorTypes.includes(color);
}

export function getPresetStatusClassName(status: PresetStatusColorType) {
  return clsx({
    'bg-success-bg text-success-text outline-success': status === 'success',
    'bg-warning-bg text-warning-text outline-warning': status === 'warning',
    'bg-error-bg text-error-text outline-error': status === 'error',
    'bg-primary-bg text-primary-text outline-primary': status === 'processing',
  });
}
