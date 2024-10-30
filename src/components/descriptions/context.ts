import React from 'react';
import type { ItemClassNameType } from '.';

export interface DescriptionsContextProps {
  size?: 'middle' | 'small' | 'default';
  itemClassName?: ItemClassNameType;
}

const DescriptionsContext = React.createContext<DescriptionsContextProps>({});

export { DescriptionsContext };
