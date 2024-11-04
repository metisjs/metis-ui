import { createContext } from 'react';
import type { Tab, TabsType } from './interface';

export interface TabContextProps {
  tabs: Tab[];
  prefixCls: string;
  type: TabsType;
}

export const TabContext = createContext<TabContextProps>(null!);
