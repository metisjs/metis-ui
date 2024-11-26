import * as React from 'react';
import { clsx, mergeSemanticCls } from '../../_util/classNameUtils';
import type { SafeKey } from '../../_util/type';
import Transition from '../../transition';
import { TabContext } from '../context';
import type { AnimatedConfig, TabPosition } from '../interface';
import type { TabPanelProps } from './TabPanel';
import TabPanel from './TabPanel';

export interface TabPanelListProps {
  activeKey: SafeKey;
  id: string;
  animated?: AnimatedConfig;
  tabPosition?: TabPosition;
  destroyInactiveTabPane?: boolean;
  className?: string;
  panelClassName: TabPanelProps['className'];
}

const TabPanelList: React.FC<TabPanelListProps> = (props) => {
  const {
    id,
    activeKey,
    animated,
    tabPosition,
    destroyInactiveTabPane,
    className,
    panelClassName,
  } = props;
  const { prefixCls, tabs } = React.useContext(TabContext);
  const tabPaneAnimated = animated?.tabPane;

  return (
    <div
      className={clsx(
        `${prefixCls}-content`,
        `${prefixCls}-content-${tabPosition}`,
        {
          [`${prefixCls}-content-animated`]: tabPaneAnimated,
        },
        'relative min-h-0 min-w-0 flex-auto',
        {
          'order-1': tabPosition === 'bottom' || tabPosition === 'right',
        },
        className,
      )}
    >
      {tabs.map((item) => {
        const {
          key,
          forceRender,
          style: paneStyle,
          className: innerPanelClassName,
          destroyInactiveTabPane: itemDestroyInactiveTabPane,
          ...restTabProps
        } = item;
        const active = key === activeKey;
        return (
          <Transition
            key={key}
            visible={active}
            forceRender={forceRender}
            removeOnLeave={!!(destroyInactiveTabPane || itemDestroyInactiveTabPane)}
            appear={false}
            {...animated?.tabPaneTransition}
          >
            {({ style: transitionStyle, className: transitionClassName }, ref) => (
              <TabPanel
                {...restTabProps}
                prefixCls={`${prefixCls}-pane`}
                id={id}
                tabKey={key}
                animated={tabPaneAnimated}
                active={active}
                style={{ ...paneStyle, ...transitionStyle }}
                className={mergeSemanticCls(
                  panelClassName,
                  innerPanelClassName,
                  transitionClassName,
                )}
                ref={ref}
              />
            )}
          </Transition>
        );
      })}
    </div>
  );
};

export default TabPanelList;
