import * as React from 'react';
import type { InternalFieldNames } from './Cascader';
import type {
  CascaderProps,
  DefaultOptionType,
  LabeledValueType,
  MultiValueType,
  SingleValueType,
} from './interface';

export interface CascaderContextProps {
  options: NonNullable<CascaderProps['options']>;
  fieldNames: InternalFieldNames;
  values: MultiValueType;
  halfValues: MultiValueType;
  changeOnSelect?: boolean;
  onSelect: (valuePath: SingleValueType | LabeledValueType) => void;
  searchOptions: DefaultOptionType[] | null;
  expandTrigger?: 'hover' | 'click';
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  optionRender?: CascaderProps['optionRender'];
  lazyLoad?: boolean;
  loadData?: (selectOption: DefaultOptionType) => Promise<void>;
  columnClassName?: string;
  optionClassName?: DefaultOptionType['className'];
}

const CascaderContext = React.createContext<CascaderContextProps>({} as CascaderContextProps);

export default CascaderContext;
