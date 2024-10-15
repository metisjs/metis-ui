import * as React from 'react';
import { InformationCircleOutline } from '@metisjs/icons';
import pickAttrs from 'rc-util/lib/pickAttrs';
import type { HTMLAriaDataAttributes } from '../_util/aria-data-attrs';
import {
  clsx,
  getSemanticCls,
  mergeSemanticCls,
  type SemanticClassName,
} from '../_util/classNameUtils';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import Skeleton from '../skeleton';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';
import type { StatisticNumberProps } from './Number';
import StatisticNumber from './Number';
import type { FormatConfig, valueType } from './utils';

interface StatisticReactProps extends FormatConfig {
  prefixCls?: string;
  className?: SemanticClassName<
    'title' | 'suffix' | 'prefix' | 'content',
    void,
    { value?: StatisticNumberProps['className'] }
  >;
  style?: React.CSSProperties;
  value?: valueType;
  valueRender?: (node: React.ReactNode) => React.ReactNode;
  title?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  tip?: string | TooltipProps;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export type StatisticProps = HTMLAriaDataAttributes & StatisticReactProps;

const Statistic: React.FC<StatisticProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    value = 0,
    title,
    valueRender,
    prefix,
    suffix,
    loading = false,
    tip,
    /* --- FormatConfig starts --- */
    formatter,
    precision,
    decimalSeparator = '.',
    groupSeparator = ',',
    /* --- FormatConfig starts --- */
    onMouseEnter,
    onMouseLeave,
    ...rest
  } = props;

  const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('statistic', customizePrefixCls);

  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(prefixCls, 'text-sm text-text', semanticCls.root);

  const titleCls = clsx(
    `${prefixCls}-title`,
    'mb-1 inline-flex items-center gap-1 text-text-tertiary',
    semanticCls.title,
  );

  const contentCls = clsx(`${prefixCls}-content`, 'flex items-center', semanticCls.content);

  const valueCls = mergeSemanticCls(
    {
      root: clsx(`${prefixCls}-content-value`, 'text-2xl font-medium'),
      int: clsx(`${prefixCls}-content-value-int`),
      decimal: clsx(`${prefixCls}-content-value-decimal`, 'text-base'),
    },
    semanticCls.value,
  );

  const skeletonCls = clsx(`${prefixCls}-skeleton`, 'pt-3');

  const _prefixCls = clsx(
    `${prefixCls}-content-prefix`,
    'mr-1 inline-flex items-center text-2xl',
    semanticCls.prefix,
  );

  const suffixCls = clsx(
    `${prefixCls}-content-suffix`,
    'mb-0.5 ml-1 self-end text-base text-text-tertiary',
    semanticCls.suffix,
  );

  const tipCls = clsx(`${className}-tooltip-icon`, 'h-4 w-4');

  const valueNode: React.ReactNode = (
    <StatisticNumber
      decimalSeparator={decimalSeparator}
      groupSeparator={groupSeparator}
      className={valueCls}
      formatter={formatter}
      precision={precision}
      value={value}
    />
  );

  let mergedTitle: React.ReactNode = title;
  if (tip) {
    const tooltipProps: TooltipProps = typeof tip === 'string' ? { title: tip } : tip;
    mergedTitle = (
      <>
        {title}
        <Tooltip {...tooltipProps}>
          <InformationCircleOutline className={tipCls} />
        </Tooltip>
      </>
    );
  }

  const restProps = pickAttrs(rest, { aria: true, data: true });
  return (
    <div {...restProps} className={rootCls} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {mergedTitle && <div className={titleCls}>{mergedTitle}</div>}
      <Skeleton paragraph={false} loading={loading} className={skeletonCls}>
        <div className={contentCls}>
          {prefix && <span className={_prefixCls}>{prefix}</span>}
          {valueRender ? valueRender(valueNode) : valueNode}
          {suffix && <span className={suffixCls}>{suffix}</span>}
        </div>
      </Skeleton>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Statistic.displayName = 'Statistic';
}

export default Statistic;
