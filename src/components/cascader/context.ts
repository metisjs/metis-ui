import * as React from 'react';
import { InternalFieldNames } from './Cascader';
import {
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
}

const CascaderContext = React.createContext<CascaderContextProps>({} as CascaderContextProps);

export default CascaderContext;
