import type { ThemeOptions } from '.';
import { genThemeVariables } from './util';

export default [
  {
    name: 'light',
    default: true,
    dark: false,
    'color-scheme': 'light',

    primary: 'indigo-600',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'indigo-600',
    text: 'gray-900',
    border: 'gray-300',
    fill: 'black/20',
    'fill-quinary': 'gray-50',
    container: 'white',
    layout: 'gray-100',
    spotlight: 'gray-900/85',
    mask: 'gray-900/45',
    'scrollbar-track': 'black/5',
    'scrollbar-thumb': 'black/50',
  },
  {
    name: 'dark',
    default: false,
    dark: true,
    'color-scheme': 'dark',

    primary: 'indigo-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'indigo-500',
    text: 'white/85',
    border: 'gray-50/10',
    'border-secondary': 'gray-50/6',
    'border-tertiary': 'gray-50/2',
    fill: 'white/20',
    container: 'white/5',
    layout: 'gray-800',
    spotlight: 'gray-700/85',
    mask: 'gray-900/45',
    'scrollbar-track': 'white/5',
    'scrollbar-thumb': 'white/50',
  },
].map((theme) => genThemeVariables(theme)) as ThemeOptions[];
