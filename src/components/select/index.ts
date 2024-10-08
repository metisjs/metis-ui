import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  CustomTagProps,
} from './BaseSelect';
import BaseSelect from './BaseSelect';
import useBaseProps from './hooks/useBaseProps';
import Select from './Select';

export type { SelectProps } from './interface';

export { BaseSelect, useBaseProps };
export type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  CustomTagProps,
  BaseSelectRef as SelectRef,
};

export default Select;
