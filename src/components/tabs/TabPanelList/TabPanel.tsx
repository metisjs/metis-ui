import * as React from 'react';
import type { SemanticClassName } from '../../_util/classNameUtils';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';

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
  tabKey?: string;
  id?: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>((props, ref) => {
  const { prefixCls, className, style, id, active, tabKey, content } = props;

  const semanticCls = useSemanticCls(className, { active: !!active });

  const panelCls = clsx(prefixCls, active && `${prefixCls}-active`, '', semanticCls.root);

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
