import { clsx } from './classNameUtils';

export const PresetColors = [
  'blue',
  'purple',
  'cyan',
  'green',
  'pink',
  'red',
  'orange',
  'yellow',
  'lime',
  'amber',
  'emerald',
  'teal',
  'sky',
  'indigo',
  'violet',
] as const;

export const PresetStatusColorTypes = [
  'success',
  'processing',
  'error',
  'default',
  'warning',
] as const;

export type PresetColorType = (typeof PresetColors)[number];
export type PresetStatusColorType = (typeof PresetStatusColorTypes)[number];

export function isPresetColor(color?: any): color is PresetColorType {
  return PresetColors.includes(color);
}

export function getPresetColorCls(
  color: PresetColorType,
  {
    text,
    background,
    outline,
    rawBackground,
  }: { text?: boolean; background?: boolean; outline?: boolean; rawBackground?: boolean } = {
    text: true,
    background: true,
    outline: true,
    rawBackground: false,
  },
) {
  return clsx(
    text && {
      'text-blue-600': color === 'blue',
      'text-purple-600': color === 'purple',
      'text-cyan-600': color === 'cyan',
      'text-green-600': color === 'green',
      'text-pink-600': color === 'pink',
      'text-red-600': color === 'red',
      'text-orange-600': color === 'orange',
      'text-yellow-600': color === 'yellow',
      'text-lime-600': color === 'lime',
      'text-amber-600': color === 'amber',
      'text-emerald-600': color === 'emerald',
      'text-teal-600': color === 'teal',
      'text-sky-600': color === 'sky',
      'text-indigo-600': color === 'indigo',
      'text-violet-600': color === 'violet',
    },
    background && {
      'bg-blue-100': color === 'blue',
      'bg-purple-100': color === 'purple',
      'bg-cyan-100': color === 'cyan',
      'bg-green-100': color === 'green',
      'bg-pink-100': color === 'pink',
      'bg-red-100': color === 'red',
      'bg-orange-100': color === 'orange',
      'bg-yellow-100': color === 'yellow',
      'bg-lime-100': color === 'lime',
      'bg-amber-100': color === 'amber',
      'bg-emerald-100': color === 'emerald',
      'bg-teal-100': color === 'teal',
      'bg-sky-100': color === 'sky',
      'bg-indigo-100': color === 'indigo',
      'bg-violet-100': color === 'violet',
    },
    rawBackground && {
      'bg-blue-600': color === 'blue',
      'bg-purple-600': color === 'purple',
      'bg-cyan-600': color === 'cyan',
      'bg-green-600': color === 'green',
      'bg-pink-600': color === 'pink',
      'bg-red-600': color === 'red',
      'bg-orange-600': color === 'orange',
      'bg-yellow-600': color === 'yellow',
      'bg-lime-600': color === 'lime',
      'bg-amber-600': color === 'amber',
      'bg-emerald-600': color === 'emerald',
      'bg-teal-600': color === 'teal',
      'bg-sky-600': color === 'sky',
      'bg-indigo-600': color === 'indigo',
      'bg-violet-600': color === 'violet',
    },
    outline && {
      'outline-blue-600/10': color === 'blue',
      'outline-purple-600/10': color === 'purple',
      'outline-cyan-600/10': color === 'cyan',
      'outline-green-600/10': color === 'green',
      'outline-pink-600/10': color === 'pink',
      'outline-red-600/10': color === 'red',
      'outline-orange-600/10': color === 'orange',
      'outline-yellow-600/10': color === 'yellow',
      'outline-lime-600/10': color === 'lime',
      'outline-amber-600/10': color === 'amber',
      'outline-emerald-600/10': color === 'emerald',
      'outline-teal-600/10': color === 'teal',
      'outline-sky-600/10': color === 'sky',
      'outline-indigo-600/10': color === 'indigo',
      'outline-violet-600/10': color === 'violet',
    },
  );
}

export function isPresetStatusColor(status?: any): status is PresetStatusColorType {
  return PresetStatusColorTypes.includes(status);
}

export function getPresetStatusCls(
  status: PresetStatusColorType,
  { text, background, outline }: { text?: boolean; background?: boolean; outline?: boolean } = {
    text: true,
    background: true,
    outline: true,
  },
) {
  return clsx(
    text && {
      'text-success-active': status === 'success',
      'text-warning-active': status === 'warning',
      'text-error-active': status === 'error',
      'text-primary': status === 'processing',
    },
    background && {
      'bg-success-bg': status === 'success',
      'bg-warning-bg': status === 'warning',
      'bg-error-bg': status === 'error',
      'bg-primary-bg': status === 'processing',
    },
    outline && {
      'outline-success-border-secondary': status === 'success',
      'outline-warning-border-secondary': status === 'warning',
      'outline-error-border-secondary': status === 'error',
      'outline-primary-border-secondary': status === 'processing',
    },
  );
}
