import type { InputProps } from './Input';

export function hasPrefixSuffix(props: InputProps) {
  return !!(props.prefix || props.suffix || props.allowClear);
}
