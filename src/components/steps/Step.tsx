import * as React from 'react';
import { CheckOutline, XMarkOutline } from '@metisjs/icons';
import { inline } from '@rc-component/portal/es/mock';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Progress from '../progress';
import Tooltip from '../tooltip';
import type { StepsProps, StepsStatus } from './Steps';

export interface StepProps {
  prefixCls?: string;
  className?: SemanticClassName<
    { icon?: string; title?: string; description?: string; content?: string },
    { status: StepsStatus }
  >;
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
  type: StepsProps['type'];
  vertical?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onStepClick?: (index: number) => void;
}

const NavSplit = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
    <path
      d="M0 -2L20 40L0 82"
      vectorEffect="non-scaling-stroke"
      stroke="currentcolor"
      strokeLinejoin="round"
    ></path>
  </svg>
);

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
    stepIndex,
    icon,
    percent,
    size,
    vertical,
    type,
    onStepClick,
    onClick,
  } = props;

  const semanticCls = useSemanticCls(className, { status });

  const isNav = type === 'navigation';
  const isInline = type === 'inline';
  const isSimple = type === 'simple';

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
      const { key } = e;
      if (key === 'Enter' || key === 'Space') {
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
      'text-text-secondary': status === 'wait',
      'text-error': status === 'error',
    },
    !vertical &&
      !isNav && {
        'ps-4 whitespace-nowrap first-of-type:ps-0': true,
        'ps-3': size === 'small',
      },
    isNav && 'flex',
    (isInline || isSimple) && 'overflow-visible ps-0',
    semanticCls.root,
  );

  const containerCls = clsx(
    `${prefixCls}-item-container`,
    'flex gap-3',
    size === 'small' && 'gap-2',
    isNav && {
      'flex-1 items-center p-4': true,
      'py-3': description,
      'p-3': size === 'small',
      'py-2': description && size === 'small',
    },
    isInline &&
      'group-hover:bg-fill-quaternary mx-[0.125rem] cursor-pointer flex-col gap-1 rounded-sm px-1 pt-2 pb-1 transition-colors',
  );

  const tailCls = clsx(
    `${prefixCls}-item-tail`,
    'absolute hidden',
    vertical &&
      'after:bg-fill-secondary top-0 left-[1.125rem] block h-full w-[1px] pt-11 pb-2 group-last-of-type:hidden after:inline-block after:h-full after:w-[1px] after:transition-colors',
    vertical && status === 'finish' && 'after:bg-primary',
    size === 'small' && 'left-[1rem] pt-[2.375rem] pb-[0.375rem]',
    isInline &&
      'after:bg-border-secondary top-[0.40625rem] left-0 ms-0 inline-block w-full -translate-y-1/2 group-first:ms-[50%] group-first:w-1/2 group-last:w-1/2 after:inline-block after:h-[1px] after:w-full',
  );

  const iconCls = clsx(
    `${prefixCls}-item-icon`,
    'relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
    {
      'border-primary border-2': status === 'process',
      'bg-primary text-white': status === 'finish',
      'border-border-secondary border-2': status === 'wait',
      'border-error border-2': status === 'error',
    },
    clickable && {
      'group-hover:bg-primary-hover': status === 'finish',
      'group-hover:border-text-tertiary group-hover:text-text': status === 'wait',
    },
    size === 'small' && 'h-8 w-8',
    isSimple && {
      'h-[0.625rem] w-[0.625rem] border-0': true,
      'bg-primary ring-primary-bg-hover ring-4': status === 'process',
      'bg-border-secondary': status === 'wait',
      'bg-error': status === 'error',
      'group-hover:bg-text-tertiary': clickable && status === 'wait',
    },
    isInline && {
      'ms-[calc(50%-0.125rem)] h-[0.375rem] w-[0.375rem] border': true,
      'bg-primary': status === 'process',
      'bg-border-secondary': status === 'finish',
      'bg-error': status === 'error',
      'border-border-secondary bg-container': status === 'wait',
    },
    semanticCls.icon,
  );

  const contentCls = clsx(
    `${prefixCls}-item-content`,
    'relative mt-[0.375rem] flex-1 overflow-hidden',
    vertical && 'min-h-14',
    isNav && 'mt-0',
    isInline && 'w-auto overflow-visible text-center',
    semanticCls.content,
  );
  const titleCls = clsx(
    `${prefixCls}-item-title`,
    'relative inline-block pe-4 text-base leading-6',
    !vertical &&
      !isNav &&
      !isInline &&
      'after:bg-fill-secondary after:absolute after:start-full after:top-3 after:h-[1px] after:w-screen group-last-of-type:after:h-0',
    {
      'text-text after:bg-primary': status === 'finish',
    },
    clickable && {
      'group-hover:text-text': status === 'wait',
    },
    size === 'small' && 'pe-3 text-sm leading-5',
    isInline && 'text-text-tertiary pe-0 text-xs',
    semanticCls.title,
  );
  const descriptionCls = clsx(
    `${prefixCls}-item-description`,
    'text-text-tertiary truncate text-sm',
    {
      'text-error': status === 'error',
      ['hidden']: isInline,
    },
    vertical && 'pb-4',
    semanticCls.description,
  );

  const icons = {
    finish: <CheckOutline className={clsx(`${prefixCls}-finish-icon`, 'h-5 w-5')} />,
    error: <XMarkOutline className={clsx(`${prefixCls}-error-icon`, 'h-5 w-5')} />,
  };

  // ========================= Render =========================
  const renderIconNode = () => {
    let iconNode: React.ReactNode;
    if (type === 'inline' || type === 'simple') {
      iconNode = <span className={`${prefixCls}-icon`}></span>;
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
      const progressWidth = size === 'small' ? 24 : 28;
      return (
        <div className={`${prefixCls}-progress-icon`}>
          <Progress
            type="circle"
            percent={percent}
            size={progressWidth}
            strokeWidth={6}
            format={() => null}
            className={clsx('absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}
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
        {!isSimple && <div className={tailCls}></div>}
        <div className={iconCls}>{renderIconNode()}</div>
        {!isSimple && (
          <div className={contentCls}>
            <div className={titleCls}>{title}</div>
            {description && !inline && <div className={descriptionCls}>{description}</div>}
          </div>
        )}
      </div>
      {isNav && (
        <NavSplit
          className={clsx(
            'text-border-secondary h-[4.25rem] group-last-of-type:hidden',
            size === 'small' && 'h-14',
          )}
        />
      )}
    </div>
  );

  if (isInline && description) {
    stepNode = <Tooltip title={description}>{stepNode}</Tooltip>;
  }

  if (isSimple && title) {
    stepNode = <Tooltip title={title}>{stepNode}</Tooltip>;
  }

  return stepNode;
};

if (process.env.NODE_ENV !== 'production') {
  Step.displayName = 'rc-step';
}

export default Step;
