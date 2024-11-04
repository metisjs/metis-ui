import * as React from 'react';
import type { TabNavListProps } from '.';
import TabNavList from '.';
import type { RenderTabBar } from '../interface';

export type TabNavListWrapperProps = TabNavListProps & { renderTabBar?: RenderTabBar };

const TabNavListWrapper: React.FC<TabNavListWrapperProps> = ({ renderTabBar, ...restProps }) => {
  if (renderTabBar) {
    return renderTabBar(restProps, TabNavList);
  }

  return <TabNavList {...restProps} />;
};

export default TabNavListWrapper;
