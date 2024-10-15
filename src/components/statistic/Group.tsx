import type { Key } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Squares2X2Outline } from '@metisjs/icons';
import {
  clsx,
  getSemanticCls,
  mergeSemanticCls,
  type SemanticClassName,
} from '../_util/classNameUtils';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import { matchScreen, type Breakpoint } from '../_util/responsiveObserver';
import { collapseTransition } from '../_util/transition';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import Transition from '../transition';
import type { StatisticProps } from './Statistic';
import Statistic from './Statistic';

type StatisticItem = StatisticProps & { key?: Key };

export interface StatisticGroupProps {
  prefixCls?: string;
  className?: SemanticClassName<'content' | 'action', void, { item?: StatisticProps['className'] }>;
  items: StatisticItem[];
  column?: number | Partial<Record<Breakpoint, number>>;
  expandable?: boolean;
  loading?: boolean;
}

const DEFAULT_COLUMN_MAP: Record<Breakpoint, number> = {
  '2xl': 4,
  xl: 4,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 1,
};

const StatisticGroup: React.FC<StatisticGroupProps> = ({
  prefixCls: customizePrefixCls,
  className,
  items,
  column,
  expandable = true,
  loading,
}) => {
  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('statistic-group', customizePrefixCls);

  const colRef = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(false);
  const [singleDivHeight, setSingleDivHeight] = useState(0);

  const screens = useBreakpoint();

  // Column count
  const mergedColumn = React.useMemo(() => {
    if (typeof column === 'number') {
      return column;
    }

    return (
      matchScreen(screens, {
        ...DEFAULT_COLUMN_MAP,
        ...column,
      }) ?? 4
    );
  }, [screens, column]);

  const showExpand = expandable && items.length > mergedColumn;

  useEffect(() => {
    setSingleDivHeight(colRef.current?.offsetHeight || 0);
  }, []);

  const [local] = useLocale('Statistic');

  const semanticCls = getSemanticCls(className);
  const rootCls = clsx(prefixCls, 'flex gap-4', semanticCls.root);
  const contentCls = clsx(`${prefixCls}-content`, 'flex flex-auto flex-col', semanticCls.content);
  const rowCls = clsx(`${prefixCls}-row`, 'grid gap-6');
  const itemCls = clsx(
    `${prefixCls}-item`,
    'pe-4 transition-[height] ease-in after:absolute after:right-0 after:top-[12.5%] after:h-3/4 after:border-r after:border-border-secondary',
  );
  const actionWrapperCls = clsx(
    `${prefixCls}-action-wrapper`,
    'flex w-28 items-center justify-center',
  );
  const expandCls = clsx(
    `${prefixCls}-action`,
    'flex cursor-pointer flex-col items-center justify-center gap-1',
    semanticCls.action,
  );

  const [visibleItems, collapseItems] = useMemo(
    () => (expandable ? [items.slice(0, mergedColumn), items.slice(mergedColumn)] : [items, []]),
    [items, mergedColumn, expandable],
  );

  return (
    <div className={rootCls}>
      <div className={contentCls}>
        <div
          className={rowCls}
          style={{ gridTemplateColumns: `repeat(${mergedColumn}, minmax(0, 1fr))` }}
        >
          {visibleItems.map(({ key, ...rest }, index) => (
            <Statistic
              key={key ?? `item-visible-${index}`}
              loading={loading}
              {...rest}
              className={mergeSemanticCls(
                clsx(itemCls, !expandable && (index + 1) % mergedColumn === 0 && 'after:hidden'),
                semanticCls.item,
                rest.className,
              )}
            />
          ))}
        </div>
        <Transition appear={false} visible={expand && expandable} {...collapseTransition}>
          {({ className: transitionCls, style: transitionStyle }, ref) => (
            <div
              ref={ref}
              className={clsx(rowCls, transitionCls)}
              style={{
                gridTemplateColumns: `repeat(${mergedColumn}, minmax(0, 1fr))`,
                ...transitionStyle,
              }}
            >
              {collapseItems.map(({ key, ...rest }, index) => (
                <Statistic
                  key={key ?? `item-collapse-${index}`}
                  loading={loading}
                  {...rest}
                  className={mergeSemanticCls(
                    clsx(itemCls, index < mergedColumn && 'mt-6'),
                    semanticCls.item,
                    rest.className,
                  )}
                />
              ))}
            </div>
          )}
        </Transition>
      </div>
      {showExpand && (
        <div
          className={actionWrapperCls}
          ref={colRef}
          style={singleDivHeight > 0 ? { maxHeight: singleDivHeight } : undefined}
        >
          <a className={expandCls} onClick={() => setExpand(!expand)}>
            <Squares2X2Outline className="h-6 w-6" />
            <div>{expand ? local.collapse : local.all}</div>
          </a>
        </div>
      )}
    </div>
  );
};

export default StatisticGroup;
