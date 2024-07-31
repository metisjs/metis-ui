import * as React from 'react';
import { InternalFieldNames } from './Cascader';
import { CascaderProps, DefaultOptionType, MultiValueType, SingleValueType } from './interface';

export interface CascaderContextProps {
  options: NonNullable<CascaderProps['options']>;
  fieldNames: InternalFieldNames;
  values: MultiValueType;
  halfValues: MultiValueType;
  changeOnSelect?: boolean;
  onSelect: (valuePath: SingleValueType) => void;
  searchOptions: DefaultOptionType[];
  expandTrigger?: 'hover' | 'click';
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  optionRender?: CascaderProps['optionRender'];
  lazeLoad?: boolean;
}

const CascaderContext = React.createContext<CascaderContextProps>({} as CascaderContextProps);

export default CascaderContext;
