/* eslint react/no-did-mount-set-state: 0, react/prop-types: 0 */
import React from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
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

export type ProgressDotRender = (
  iconDot: React.ReactNode,
  info: {
    index: number;
    status: StepsStatus;
    title: React.ReactNode;
    description: React.ReactNode;
  },
) => React.ReactNode;

export type StepItem = Omit<
  StepProps,
  | 'prefixCls'
  | 'active'
  | 'stepIndex'
  | 'stepNumber'
  | 'percent'
  | 'size'
  | 'inline'
  | 'vertical'
  | 'progressDot'
  | 'onStepClick'
>;

export interface StepsProps {
  type?: 'default' | 'navigation' | 'inline';
  className?: SemanticClassName<'item'>;
  current?: number;
  direction?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical';
  prefixCls?: string;
  progressDot?: boolean | ProgressDotRender;
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
    labelPlacement = 'horizontal',
    status = 'process',
    size,
    current = 0,
    progressDot = false,
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

  const mergedProgressDot = isInline || progressDot;
  const mergedDirection = React.useMemo<StepsProps['direction']>(
    () => (isInline ? 'horizontal' : responsive && xs ? 'vertical' : direction),
    [xs, direction, isInline, responsive],
  );
  const mergedSize = useSize(size);
  const mergedPercent = isInline ? undefined : percent;

  const adjustedLabelPlacement = mergedProgressDot ? 'vertical' : labelPlacement;

  // ===========================Styles=============================
  const classString = clsx(
    prefixCls,
    `${prefixCls}-${mergedDirection}`,
    {
      [`${prefixCls}-${mergedSize}`]: mergedSize,
      [`${prefixCls}-label-${adjustedLabelPlacement}`]: mergedDirection === 'horizontal',
      [`${prefixCls}-dot`]: !!mergedProgressDot,
      [`${prefixCls}-navigation`]: isNav,
      [`${prefixCls}-inline`]: isInline,
    },
    'flex w-full text-neutral-text',
    mergedDirection === 'vertical' && 'flex-col',
    semanticCls.root,
  );

  const onStepClick = (next: number) => {
    if (onChange && current !== next) {
      onChange(next);
    }
  };

  const renderStep = (item: StepProps, stepNumber: number) => {
    const mergedItem: StepProps = { ...item };

    if (!mergedItem.status) {
      if (stepNumber === current) {
        mergedItem.status = status;
      } else if (stepNumber < current) {
        mergedItem.status = 'finish';
      } else {
        mergedItem.status = 'wait';
      }
    }

    return (
      <Step
        {...mergedItem}
        className={clsx(semanticCls.item, mergedItem.className)}
        active={stepNumber === current}
        stepNumber={stepNumber + 1}
        stepIndex={stepNumber}
        key={stepNumber}
        prefixCls={prefixCls}
        progressDot={mergedProgressDot}
        size={mergedSize}
        inline={isInline}
        percent={mergedPercent}
        vertical={mergedDirection === 'vertical'}
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
