import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  CustomTagProps,
} from './BaseSelect';
import BaseSelect from './BaseSelect';
import Select from './Select';
import useBaseProps from './hooks/useBaseProps';

export type {
  SelectProps,
  SelectPropsWithOptions,
  SelectPropsWithRequest,
  SelectPropsWithRequestPagination,
  SelectPropsWithRequestSearch,
  SelectPropsWithRequestSearchPagination,
} from './interface';

export { BaseSelect, useBaseProps };
export type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  CustomTagProps,
  BaseSelectRef as RefSelectProps,
};

export default Select;
