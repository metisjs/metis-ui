import * as React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { clsx, mergeSemanticCls, type SemanticClassName } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { ConfigContext } from '../config-provider';
import type { TimelineItemProps } from './TimelineItem';
import TimelineItem from './TimelineItem';

export type TimelineItemType = Omit<
  TimelineItemProps,
  'prefixCls' | 'last' | 'pending' | 'alternate'
>;

export interface TimelineProps {
  prefixCls?: string;
  className?: SemanticClassName<{ root?: string; item?: TimelineItemProps['className'] }>;
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
        dot: pendingDot || <LoadingOutline className="h-3.5 w-3.5 animate-spin" />,
        content: pendingNode,
      });
    }

    if (reverse) {
      internalItems.reverse();
    }
    return internalItems;
  }, [items, pending, pendingDot, reverse]);

  const hasLabelItem = mergedItems.some((item: TimelineItemProps) => !!item?.label);

  // ========================= Style ===========================
  const semanticCls = useSemanticCls(className, 'timeline');

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

  const getPosition = (position: string, idx: number) => {
    if (mode === 'alternate') {
      if (position === 'right') return 'right';
      if (position === 'left') return 'left';
      return idx % 2 === 0 ? 'left' : 'right';
    }
    if (mode === 'left') return 'left';
    if (mode === 'right') return 'right';
    if (position === 'right') return 'right';
    return 'left';
  };

  const itemsCount = mergedItems.length;
  const hasLabel = mergedItems.some((item) => !!item?.label);

  const itemsList = mergedItems
    .filter((item: TimelineItemProps) => !!item)
    .map((item: TimelineItemProps, idx: number) => {
      const { className: itemClassName, position, ...itemProps } = item;
      const last = !reverse && !!pending ? idx === itemsCount - 2 : idx === itemsCount - 1;
      const mergedPosition = getPosition(position ?? '', idx);

      return (
        <TimelineItem
          prefixCls={prefixCls}
          last={last}
          position={mergedPosition}
          alternate={mode === 'alternate' || hasLabel}
          {...itemProps}
          className={mergeSemanticCls(
            {
              tail: clsx({
                ['hidden']: (last && (reverse || !pending)) || (item.pending && !reverse),
              }),
            },
            semanticCls.item,
            itemClassName,
          )}
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
