import * as React from 'react';
import type { RawValueType, RenderNode } from './BaseSelect';
import type {
  BaseOptionType,
  FlattenOptionData,
  OnActiveValue,
  OnInternalSelect,
  SelectProps,
} from './interface';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: BaseOptionType[];
  optionRender?: SelectProps['optionRender'];
  flattenOptions: FlattenOptionData<BaseOptionType>[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
  onSelect: OnInternalSelect;
  menuItemSelectedIcon?: RenderNode;
  rawValues: Set<RawValueType>;
  fieldNames?: SelectProps['fieldNames'];
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;
}

const noop = () => {};

export const SelectContext = React.createContext<SelectContextProps>({
  options: [],
  flattenOptions: [],
  onActiveValue: noop,
  onSelect: noop,
  rawValues: new Set(),
  listHeight: 0,
});
