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
    text: 'gray-950',
    border: 'gray-300',
    fill: 'gray-950/20',
    'fill-quinary': 'gray-50',
    container: 'white',
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
    text: 'white/88',
    border: 'gray-50/10',
    'border-secondary': 'gray-50/6',
    'border-tertiary': 'gray-50/2',
    fill: 'white/25',
    container: 'white/5',
    spotlight: 'white/10',
    mask: 'gray-950/65',
    'scrollbar-track': 'white/5',
    'scrollbar-thumb': 'white/50',
  },
].map((theme) => genThemeVariables(theme)) as ThemeOptions[];
