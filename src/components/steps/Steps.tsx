/* eslint react/no-did-mount-set-state: 0, react/prop-types: 0 */
import React from 'react';
import { SemanticClassName, clsx, getSemanticCls, mergeSemanticCls } from '../_util/classNameUtils';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import type { StepProps } from './Step';
import Step from './Step';

export type StepsStatus = 'wait' | 'process' | 'finish' | 'error';

export type StepIconRender = (info: {
  index: number;
  status: StepsStatus;
  title: React.ReactNode;
  description: React.ReactNode;
  node: React.ReactNode;
}) => React.ReactNode;

export type StepItem = Omit<
  StepProps,
  | 'prefixCls'
  | 'active'
  | 'stepIndex'
  | 'stepNumber'
  | 'percent'
  | 'size'
  | 'vertical'
  | 'type'
  | 'onStepClick'
>;

export interface StepsProps {
  type?: 'default' | 'navigation' | 'inline' | 'dot';
  className?: SemanticClassName<'item' | 'title' | 'description'>;
  current?: number;
  direction?: 'horizontal' | 'vertical';
  initial?: number;
  prefixCls?: string;
  responsive?: boolean;
  size?: 'default' | 'small';
  status?: StepsStatus;
  style?: React.CSSProperties;
  percent?: number;
  items?: StepItem[];
  onChange?: (current: number) => void;
}

const Steps: React.FC<StepsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    style = {},
    className,
    direction = 'horizontal',
    type = 'default',
    status = 'process',
    size,
    current = 0,
    initial = 0,
    responsive,
    percent,
    onChange,
    items = [],
  } = props;

  const { xs } = useBreakpoint(responsive);
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('steps', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  const isNav = type === 'navigation';
  const isInline = type === 'inline';

  const mergedDirection =
    isInline || isNav ? 'horizontal' : responsive && xs ? 'vertical' : direction;
  const mergedSize = useSize(size);
  const mergedPercent = isInline ? undefined : percent;

  // ===========================Styles=============================
  const classString = clsx(
    prefixCls,
    `${prefixCls}-${mergedDirection}`,
    {
      [`${prefixCls}-${mergedSize}`]: mergedSize,
      [`${prefixCls}-${type}`]: type !== 'default',
    },
    'flex w-full text-neutral-text',
    mergedDirection === 'vertical' && 'flex-col',
    isInline && 'inline-flex w-auto',
    semanticCls.root,
  );

  const onStepClick = (next: number) => {
    if (onChange && current !== next) {
      onChange(next);
    }
  };

  const renderStep = (item: StepProps, index: number) => {
    const mergedItem: StepProps = { ...item };
    const stepNumber = initial + index;

    if (!mergedItem.status) {
      if (stepNumber === current) {
        mergedItem.status = status;
      } else if (stepNumber < current) {
        mergedItem.status = 'finish';
      } else {
        mergedItem.status = 'wait';
      }
    }

    const itemCls = mergeSemanticCls(
      {
        root: semanticCls.item,
        title: semanticCls.title,
        description: semanticCls.description,
      },
      mergedItem.className,
    );

    return (
      <Step
        {...mergedItem}
        className={itemCls}
        active={stepNumber === current}
        stepNumber={stepNumber + 1}
        stepIndex={stepNumber}
        key={stepNumber}
        prefixCls={prefixCls}
        size={mergedSize}
        percent={mergedPercent}
        vertical={mergedDirection === 'vertical'}
        type={type}
        onStepClick={onChange && onStepClick}
      />
    );
  };

  return (
    <div className={classString} style={style}>
      {items.filter(Boolean).map<React.ReactNode>(renderStep)}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Steps.displayName = 'Steps';
}

export default Steps;
