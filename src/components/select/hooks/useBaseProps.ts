/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

import * as React from 'react';
import type { BaseSelectProps } from '../BaseSelect';
import OptionList from '../OptionList';

export interface BaseSelectContextProps extends BaseSelectProps {
  triggerOpen: boolean;
  multiple: boolean;
  toggleOpen: (open?: boolean) => void;
}

const noop = () => {};

export const BaseSelectContext = React.createContext<BaseSelectContextProps>({
  triggerOpen: false,
  multiple: false,
  toggleOpen: noop,
  id: '',
  prefixCls: '',
  displayValues: [],
  onDisplayValuesChange: noop,
  searchValue: '',
  onSearch: noop,
  OptionList: OptionList,
  emptyOptions: false,
});

export default function useBaseProps() {
  return React.useContext(BaseSelectContext);
}
