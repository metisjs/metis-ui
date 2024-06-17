import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  CustomTagProps,
} from './BaseSelect';
import BaseSelect from './BaseSelect';
import OptGroup from './OptGroup';
import Option from './Option';
import Select from './Select';
import useBaseProps from './hooks/useBaseProps';
import type { SelectPropsWithoutRequest } from './interface';

export { BaseSelect, OptGroup, Option, useBaseProps };
export type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  CustomTagProps,
  BaseSelectRef as RefSelectProps,
  SelectPropsWithoutRequest as SelectProps,
};

export default Select;
