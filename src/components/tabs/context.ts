import { createContext } from 'react';
import type { SafeKey } from '@util/type';
import type { Tab } from './interface';
import type { TabsProps } from './Tabs';

export interface TabContextProps extends Pick<TabsProps, 'type' | 'size' | 'renderTabContextMenu'> {
  tabs: Tab[];
  prefixCls: string;
  renamingKey?: SafeKey;
  triggerRename: (key: SafeKey) => void;
  cancelRename: () => void;
}

export const TabContext = createContext<TabContextProps>(null!);
