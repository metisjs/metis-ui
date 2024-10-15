import type { Key } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Squares2X2Outline } from '@metisjs/icons';
import {
  clsx,
  getSemanticCls,
  mergeSemanticCls,
  type SemanticClassName,
} from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import type { StatisticProps } from './Statistic';
import Statistic from './Statistic';

type StatisticItem = StatisticProps & { key?: Key };

export interface StatisticGroupProps {
  prefixCls?: string;
  className?: SemanticClassName<'', void, { item?: StatisticProps['className'] }>;
  items: StatisticItem[];
  max?: number;
  expandable?: boolean;
  loading?: boolean;
}

const StatisticGroup: React.FC<StatisticGroupProps> = ({
  prefixCls: customizePrefixCls,
  className,
  items,
  max = 4,
  expandable = true,
}) => {
  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('statistic-group', customizePrefixCls);

  const colRef = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(false);
  const [singleDivHeight, setSingleDivHeight] = useState(0);

  const showExpand = expandable && items.length > max;

  useEffect(() => {
    setSingleDivHeight(colRef.current?.offsetHeight || 0);
  }, []);

  const [local] = useLocale('Statistic');

  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(prefixCls, '', semanticCls.root);

  const itemCls = mergeSemanticCls('w-full', semanticCls.item);

  return (
    <div className={rootCls}>
      <div className={`${prefixCls}-content`}>
        {items.map(({ key, ...rest }, index) => (
          <div
            className={clsx(`${prefixCls}-item`, {
              [`${prefixCls}-item-hidden`]: index >= max && !expand && expandable,
            })}
            key={key ?? index}
            style={{ flex: `${100 / max}%` }}
          >
            <div className={`${prefixCls}-left-item`}>
              <Statistic {...rest} className={mergeSemanticCls(itemCls, rest.className)} />
            </div>
          </div>
        ))}
      </div>
      {showExpand && (
        <div
          className={`${prefixCls}-action`}
          ref={colRef}
          style={singleDivHeight > 0 ? { maxHeight: singleDivHeight } : undefined}
        >
          <div className={`${prefixCls}-expand`} onClick={() => setExpand(!expand)}>
            <div className={`${prefixCls}-expand-icon`}>
              <Squares2X2Outline />
            </div>
            <div className={`${prefixCls}-expand-text`}>{expand ? local.collapse : local.all}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticGroup;
