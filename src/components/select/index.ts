import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  CustomTagProps,
} from './BaseSelect';
import BaseSelect from './BaseSelect';
import OptGroup from './OptGroup';
import Option from './Option';
import type { SelectProps } from './Select';
import Select from './Select';
import useBaseProps from './hooks/useBaseProps';

export { BaseSelect, OptGroup, Option, useBaseProps };
export type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  CustomTagProps,
  BaseSelectRef as RefSelectProps,
  SelectProps,
};

export default Select;
