import type * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';

export type CollapsibleType = 'header' | 'icon' | 'disabled';

export interface ItemType
  extends Omit<
    CollapsePanelProps,
    | 'header'
    | 'prefixCls'
    | 'isActive'
    | 'accordion'
    | 'expandIcon'
    | 'panelKey'
    | 'expandIconPosition'
  > {
  key?: React.Key;
  label?: CollapsePanelProps['header'];
  ref?: React.RefObject<HTMLDivElement>;
}

export type ExpandIconPosition = 'start' | 'end' | undefined;

export interface CollapseProps {
  activeKey?: React.Key | React.Key[];
  defaultActiveKey?: React.Key | React.Key[];
  /** 手风琴效果 */
  accordion?: boolean;
  destroyInactivePanel?: boolean;
  onChange?: (key: React.Key | React.Key[]) => void;
  style?: React.CSSProperties;
  className?: SemanticClassName<{ root?: string; panel?: CollapsePanelProps['className'] }>;
  bordered?: boolean;
  prefixCls?: string;
  expandIcon?: (panelProps: CollapsePanelProps) => React.ReactNode;
  expandIconPosition?: ExpandIconPosition;
  ghost?: boolean;
  collapsible?: CollapsibleType;
  items: ItemType[];
}

export interface CollapsePanelProps {
  prefixCls: string;
  panelKey: React.Key;
  isActive?: boolean;
  header?: React.ReactNode;
  className?: SemanticClassName<{ icon?: string; header?: string; content?: string }>;
  style?: React.CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  extra?: React.ReactNode;
  collapsible?: CollapsibleType;
  accordion?: boolean;
  destroyInactivePanel?: boolean;
  children?: React.ReactNode;
  expandIconPosition?: ExpandIconPosition;
  onItemClick?: (key: React.Key) => void;
  expandIcon: (panelProps: CollapsePanelProps) => React.ReactNode;
}
