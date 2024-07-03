import { CheckOutline, XMarkOutline } from '@metisjs/icons';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import Progress from '../progress';
import Tooltip from '../tooltip';
import type { ProgressDotRender, StepsStatus } from './Steps';

export interface StepProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  stepIndex: number;
  stepNumber: number;
  status?: StepsStatus;
  title?: React.ReactNode;
  description?: React.ReactNode;
  percent?: number;
  size?: 'default' | 'small';
  inline?: boolean;
  vertical?: boolean;
  progressDot?: ProgressDotRender | boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onStepClick?: (index: number) => void;
}

const Step: React.FC<StepProps> = (props) => {
  const {
    className,
    prefixCls,
    style,
    active,
    status = 'wait',
    stepNumber,
    disabled,
    description,
    title,
    progressDot,
    stepIndex,
    icon,
    percent,
    size,
    inline,
    vertical,
    onStepClick,
    onClick,
  } = props;

  // ========================= Click ==========================
  const clickable = !!onStepClick && !disabled && !active;

  const accessibilityProps: {
    role?: string;
    tabIndex?: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  } = {};
  if (clickable) {
    accessibilityProps.role = 'button';
    accessibilityProps.tabIndex = 0;
    accessibilityProps.onClick = (e) => {
      onClick?.(e);
      onStepClick(stepIndex);
    };
    accessibilityProps.onKeyDown = (e) => {
      const { which } = e;
      if (which === KeyCode.ENTER || which === KeyCode.SPACE) {
        onStepClick(stepIndex);
      }
    };
  }

  const rootCls = clsx(
    `${prefixCls}-item`,
    `${prefixCls}-item-${status}`,
    {
      [`${prefixCls}-item-active`]: active,
      [`${prefixCls}-item-disabled`]: disabled === true,
    },
    'group relative inline-block flex-1 overflow-hidden align-top',
    {
      'text-primary': status === 'process' || status === 'finish',
      'text-neutral-text-secondary': status === 'wait',
      'text-error': status === 'error',
    },
    !vertical && 'whitespace-nowrap ps-4 first-of-type:ps-0',
    size === 'small' && !vertical && 'ps-3',
    className,
  );

  const containerCls = clsx(
    `${prefixCls}-item-container`,
    'flex gap-3',
    size === 'small' && 'gap-2',
  );

  const tailCls = clsx(
    `${prefixCls}-item-tail`,
    'hidden',
    vertical &&
      'absolute left-[1.125rem] top-0 block h-full w-[1px] pb-2 pt-11 after:inline-block after:h-full after:w-[1px] after:bg-neutral-fill-secondary after:transition-colors group-last-of-type:hidden',
    vertical && status === 'finish' && 'after:bg-primary',
    size === 'small' && 'left-[1rem] pb-[0.375rem] pt-[2.375rem]',
  );

  const iconCls = clsx(
    `${prefixCls}-item-icon`,
    'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
    {
      'border-2 border-primary': status === 'process',
      'bg-primary text-white': status === 'finish',
      'border-2 border-neutral-fill-secondary': status === 'wait',
      'border-2 border-error': status === 'error',
    },
    clickable && {
      'group-hover:bg-primary-hover': status === 'finish',
      'group-hover:border-neutral-fill group-hover:text-neutral-text': status === 'wait',
    },
    size === 'small' && 'h-8 w-8',
  );

  const contentCls = clsx(
    `${prefixCls}-item-content`,
    'relative mt-[0.125rem] flex-1 overflow-hidden',
    vertical && 'min-h-14',
  );
  const titleCls = clsx(
    `${prefixCls}-item-title`,
    'relative inline-block pe-4 text-base leading-8',
    !vertical &&
      'after:absolute after:start-full after:top-[0.9375rem] after:h-[1px] after:w-screen after:bg-neutral-fill-secondary group-last-of-type:after:h-0',
    {
      'text-neutral-text after:bg-primary': status === 'finish',
    },
    clickable && {
      'group-hover:text-neutral-text': status === 'wait',
    },
    size === 'small' && 'pe-3 text-sm leading-7',
  );
  const descriptionCls = clsx(
    `${prefixCls}-item-description`,
    'truncate text-sm text-neutral-text-tertiary',
    {
      'text-primary': status === 'process',
      'text-error': status === 'error',
    },
    vertical && 'pb-4',
  );

  const icons = {
    finish: <CheckOutline className={clsx(`${prefixCls}-finish-icon`, 'h-5 w-5')} />,
    error: <XMarkOutline className={clsx(`${prefixCls}-error-icon`, 'h-5 w-5')} />,
  };

  // ========================= Render =========================
  const renderIconNode = () => {
    let iconNode: React.ReactNode;
    const iconDot = <span className={`${prefixCls}-icon-dot`} />;
    if (progressDot) {
      if (typeof progressDot === 'function') {
        iconNode = (
          <span className={`${prefixCls}-icon`}>
            {progressDot(iconDot, {
              index: stepNumber - 1,
              status,
              title,
              description,
            })}
          </span>
        );
      } else {
        iconNode = <span className={`${prefixCls}-icon`}>{iconDot}</span>;
      }
    } else if (icon) {
      iconNode = (
        <span className={clsx(`${prefixCls}-icon`, 'flex items-center justify-center text-xl')}>
          {icon}
        </span>
      );
    } else if (status in icons) {
      iconNode = <span className={`${prefixCls}-icon`}>{icons[status as keyof typeof icons]}</span>;
    } else {
      iconNode = <span className={`${prefixCls}-icon`}>{stepNumber}</span>;
    }

    if (status === 'process' && percent !== undefined) {
      const progressWidth = size === 'small' ? 32 : 40;
      return (
        <div className={`${prefixCls}-progress-icon`}>
          <Progress
            type="circle"
            percent={percent}
            size={progressWidth}
            strokeWidth={4}
            format={() => null}
          />
          {iconNode}
        </div>
      );
    }

    return iconNode;
  };

  let stepNode: React.ReactNode = (
    <div className={rootCls} style={style}>
      <div onClick={onClick} {...accessibilityProps} className={containerCls}>
        <div className={tailCls}></div>
        <div className={iconCls}>{renderIconNode()}</div>
        <div className={contentCls}>
          <div className={titleCls}>{title}</div>
          {description && <div className={descriptionCls}>{description}</div>}
        </div>
      </div>
    </div>
  );

  if (inline && description) {
    stepNode = <Tooltip title={description}>{stepNode}</Tooltip>;
  }

  return stepNode;
};

if (process.env.NODE_ENV !== 'production') {
  Step.displayName = 'rc-step';
}

export default Step;
