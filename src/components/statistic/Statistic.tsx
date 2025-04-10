import * as React from 'react';
import { InformationCircleOutline } from '@metisjs/icons';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import type { HTMLAriaDataAttributes } from '@util/aria-data-attrs';
import { clsx, mergeSemanticCls, type SemanticClassName } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
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
  className?: SemanticClassName<{
    title?: string;
    suffix?: string;
    prefix?: string;
    content?: string;
    value?: StatisticNumberProps['className'];
  }>;
  style?: React.CSSProperties;
  value?: valueType;
  valueRender?: (node: React.ReactNode) => React.ReactNode;
  title?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  tooltip?: string | TooltipProps;
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
    tooltip,
    /* --- FormatConfig starts --- */
    formatter,
    precision,
    decimalSeparator = '.',
    groupSeparator = ',',
    /* --- FormatConfig starts --- */
    onMouseEnter,
    onMouseLeave,
    style,
    ...rest
  } = props;

  const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('statistic', customizePrefixCls);

  const semanticCls = useSemanticCls(className, 'statistic');

  const rootCls = clsx(prefixCls, 'text-text relative text-sm', semanticCls.root);

  const titleCls = clsx(
    `${prefixCls}-title`,
    'text-text-tertiary mb-1 inline-flex items-center gap-1',
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

  const skeletonCls = clsx(`${prefixCls}-skeleton`, 'pt-2');

  const _prefixCls = clsx(
    `${prefixCls}-content-prefix`,
    'mr-1 inline-flex items-center text-2xl',
    semanticCls.prefix,
  );

  const suffixCls = clsx(
    `${prefixCls}-content-suffix`,
    'text-text-tertiary mb-0.5 ml-1 self-end text-base',
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
  if (tooltip) {
    const tooltipProps: TooltipProps = typeof tooltip === 'string' ? { title: tooltip } : tooltip;
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
    <div
      {...restProps}
      className={rootCls}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
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
