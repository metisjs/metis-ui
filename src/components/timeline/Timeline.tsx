import * as React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { clsx, getSemanticCls, type SemanticClassName } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { TimelineItemProps } from './TimelineItem';
import TimelineItem from './TimelineItem';

export interface TimelineProps {
  prefixCls?: string;
  className?: SemanticClassName<''>;
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending?: React.ReactNode;
  pendingDot?: React.ReactNode;
  style?: React.CSSProperties;
  reverse?: boolean;
  mode?: 'left' | 'alternate' | 'right';
  items?: TimelineItemProps[];
}

const Timeline: React.FC<TimelineProps> = ({
  prefixCls: customizePrefixCls,
  className,
  pending = false,
  items,
  reverse = false,
  pendingDot,
  mode = '' as TimelineProps['mode'],
  ...restProps
}) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('timeline', customizePrefixCls);

  // ========================= Items ===========================
  const mergedItems = React.useMemo(() => {
    const internalItems = [...(items || [])];
    const pendingNode = typeof pending === 'boolean' ? null : pending;

    if (pending) {
      internalItems.push({
        pending: !!pending,
        dot: pendingDot || <LoadingOutline />,
        children: pendingNode,
      });
    }

    if (reverse) {
      internalItems.reverse();
    }
    return internalItems;
  }, [items, pending, pendingDot, reverse]);

  const hasLabelItem = mergedItems.some((item: TimelineItemProps) => !!item?.label);

  // ========================= Style ===========================
  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-pending`]: !!pending,
      [`${prefixCls}-reverse`]: !!reverse,
      [`${prefixCls}-${mode}`]: !!mode && !hasLabelItem,
      [`${prefixCls}-label`]: hasLabelItem,
    },
    'text-sm text-text',
    semanticCls.root,
  );

  const getPositionCls = (position: string, idx: number) => {
    if (mode === 'alternate') {
      if (position === 'right') return `${prefixCls}-item-right`;
      if (position === 'left') return `${prefixCls}-item-left`;
      return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
    }
    if (mode === 'left') return `${prefixCls}-item-left`;
    if (mode === 'right') return `${prefixCls}-item-right`;
    if (position === 'right') return `${prefixCls}-item-right`;
    return '';
  };

  const itemsCount = mergedItems.length;
  const lastCls = `${prefixCls}-item-last`;

  const itemsList = mergedItems
    .filter((item: TimelineItemProps) => !!item)
    .map((item: TimelineItemProps, idx: number) => {
      const pendingClass = idx === itemsCount - 2 ? lastCls : '';
      const readyClass = idx === itemsCount - 1 ? lastCls : '';
      const { className: itemClassName, ...itemProps } = item;

      return (
        <TimelineItem
          {...itemProps}
          className={clsx([
            itemClassName,
            !reverse && !!pending ? pendingClass : readyClass,
            getPositionCls(item?.position ?? '', idx),
          ])}
          key={item?.key || idx}
        />
      );
    });

  return (
    <ul {...restProps} className={rootCls}>
      {itemsList}
    </ul>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Timeline.displayName = 'Timeline';
}

export default Timeline;
