import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { SafeKey } from '@util/type';
import { TabContext } from '../context';

export interface TabPanelProps {
  tab?: React.ReactNode;
  className?: SemanticClassName<{ root?: string }, { active: boolean }>;
  style?: React.CSSProperties;
  disabled?: boolean;
  content?: React.ReactNode;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  icon?: React.ReactNode;

  // Pass by TabPaneList
  prefixCls?: string;
  tabKey?: SafeKey;
  id?: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>((props, ref) => {
  const { prefixCls, className, style, id, active, tabKey, content } = props;

  const { type } = React.useContext(TabContext);

  const semanticCls = useSemanticCls(className, { active: !!active });

  const panelCls = clsx(
    prefixCls,
    active && `${prefixCls}-active`,
    type === 'card' && 'bg-(--card-active-background-color,var(--container))',
    semanticCls.root,
  );

  return (
    <div
      id={id && `${id}-panel-${tabKey}`}
      role="tabpanel"
      tabIndex={active ? 0 : -1}
      aria-labelledby={id && `${id}-tab-${tabKey}`}
      aria-hidden={!active}
      style={style}
      className={panelCls}
      ref={ref}
    >
      {content}
    </div>
  );
});

export default TabPanel;
