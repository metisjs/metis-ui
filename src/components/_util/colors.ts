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
    'bg-success-bg text-success-active outline-success-border': status === 'success',
    'bg-warning-bg text-warning-active outline-warning-border': status === 'warning',
    'bg-error-bg text-error-active outline-error-border': status === 'error',
    'bg-primary-bg text-primary outline-primary-border': status === 'processing',
  });
}
