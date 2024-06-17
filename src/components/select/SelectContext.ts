import * as React from 'react';
import type { RawValueType, RenderNode } from './BaseSelect';
import type {
  BaseOptionType,
  FieldNames,
  FlattenOptionData,
  OnActiveValue,
  OnInternalSelect,
} from './interface';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: BaseOptionType[];
  flattenOptions: FlattenOptionData<BaseOptionType>[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
  onSelect: OnInternalSelect;
  menuItemSelectedIcon?: RenderNode;
  rawValues: Set<RawValueType>;
  fieldNames?: FieldNames;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;
  childrenAsData?: boolean;
}

const noop = () => {};

const SelectContext = React.createContext<SelectContextProps>({
  options: [],
  flattenOptions: [],
  onActiveValue: noop,
  onSelect: noop,
  rawValues: new Set(),
});

export default SelectContext;
