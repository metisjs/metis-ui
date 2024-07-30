import { TinyColor } from '@ctrl/tinycolor';
import { CheckCircleSolid, CheckOutline, XCircleSolid, XMarkOutline } from '@metisjs/icons';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import { devUseWarning } from '../_util/warning';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import Circle from './Circle';
import Line from './Line';
import Steps from './Steps';
import { getSize, validProgress } from './utils';

export const ProgressTypes = ['line', 'circle', 'dashboard'] as const;
export type ProgressType = (typeof ProgressTypes)[number];
const ProgressStatuses = ['normal', 'exception', 'active', 'success'] as const;
export type ProgressSize = 'default' | 'small';
export type StringGradients = Record<string, string>;
type FromToGradients = { from: string; to: string };
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients);
export interface PercentPositionType {
  align?: 'start' | 'center' | 'end';
  type?: 'inner' | 'outer';
}

export interface SuccessProps {
  percent?: number;
  strokeColor?: string;
}

export type ProgressAriaProps = Pick<React.AriaAttributes, 'aria-label' | 'aria-labelledby'>;

export interface ProgressProps extends ProgressAriaProps {
  prefixCls?: string;
  className?: SemanticClassName<'outer' | 'trail' | 'text'>;
  type?: ProgressType;
  percent?: number;
  format?: (percent?: number, successPercent?: number) => React.ReactNode;
  status?: (typeof ProgressStatuses)[number];
  showInfo?: boolean;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'square' | 'round';
  strokeColor?: string | string[] | ProgressGradient;
  trailColor?: string;
  success?: SuccessProps;
  style?: React.CSSProperties;
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  size?: number | [number | string, number] | ProgressSize | { width?: number; height?: number };
  steps?: number | { count: number; gap: number };
  percentPosition?: PercentPositionType;
  children?: React.ReactNode;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    steps,
    strokeColor,
    percent = 0,
    size = 'default',
    showInfo = true,
    type = 'line',
    status,
    format,
    style,
    percentPosition = {},
    success,
    ...restProps
  } = props;

  const { align: infoAlign = 'end', type: infoPosition = 'outer' } = percentPosition;
  const strokeColorNotArray = Array.isArray(strokeColor) ? strokeColor[0] : strokeColor;
  const strokeColorNotGradient =
    typeof strokeColor === 'string' || Array.isArray(strokeColor) ? strokeColor : undefined;
  const strokeColorIsBright = React.useMemo(() => {
    if (strokeColorNotArray) {
      const color =
        typeof strokeColorNotArray === 'string'
          ? strokeColorNotArray
          : Object.values(strokeColorNotArray)[0];
      return new TinyColor(color).isLight();
    }
    return false;
  }, [strokeColor]);

  const percentNumber = React.useMemo<number>(() => {
    const successPercent = success?.percent;
    return parseInt(
      successPercent !== undefined ? (successPercent ?? 0)?.toString() : (percent ?? 0)?.toString(),
      10,
    );
  }, [percent, props.success]);

  const progressStatus = React.useMemo<(typeof ProgressStatuses)[number]>(() => {
    if (!ProgressStatuses.includes(status!) && percentNumber >= 100) {
      return 'success';
    }
    return status || 'normal';
  }, [status, percentNumber]);

  const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('progress', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  const isLineType = type === 'line';
  const isPureLineType = isLineType && !steps;
  const progressInfo = React.useMemo<React.ReactNode>(() => {
    if (!showInfo) {
      return null;
    }
    const successPercent = success?.percent;
    let text: React.ReactNode;
    const textFormatter = format || ((number) => `${number}%`);
    const isBrightInnerColor = isLineType && strokeColorIsBright && infoPosition === 'inner';
    if (
      infoPosition === 'inner' ||
      format ||
      (progressStatus !== 'exception' && progressStatus !== 'success')
    ) {
      text = textFormatter(validProgress(percent), validProgress(successPercent));
    } else if (progressStatus === 'exception') {
      text = isLineType ? (
        <XCircleSolid
          className={clsx('h-4 w-4', size === 'small' && 'h-[0.875rem] w-[0.875rem]')}
        />
      ) : (
        <XMarkOutline className="text-[1.5em]" />
      );
    } else if (progressStatus === 'success') {
      text = isLineType ? (
        <CheckCircleSolid
          className={clsx('h-4 w-4', size === 'small' && 'h-[0.875rem] w-[0.875rem]')}
        />
      ) : (
        <CheckOutline className="text-[1.5em]" />
      );
    }

    return (
      <span
        className={clsx(
          `${prefixCls}-text`,
          {
            [`${prefixCls}-text-bright`]: isBrightInnerColor,
            [`${prefixCls}-text-${infoAlign}`]: isPureLineType,
            [`${prefixCls}-text-${infoPosition}`]: isPureLineType,
          },
          {
            'text-error': progressStatus === 'exception',
            'text-success': progressStatus === 'success',
          },
          (type === 'circle' || type === 'dashboard') &&
            'absolute left-0 top-1/2 w-full -translate-y-1/2 text-center',
          type === 'line' &&
            infoPosition === 'outer' && {
              'flex items-center': true,
              'ms-2': infoAlign === 'end',
              'ms-1': infoAlign === 'end' && size === 'small',
              'me-2': infoAlign === 'start',
              'me-1': infoAlign === 'start' && size === 'small',
              'mt-1': infoAlign === 'center',
              'mt-[0.125rem]': infoAlign === 'center' && size === 'small',
            },
          type === 'line' &&
            infoPosition === 'inner' && {
              'ms-0 flex h-full w-full items-center px-1 text-white': true,
              'justify-start': infoAlign === 'start',
              'justify-center': infoAlign === 'center',
              'justify-end': infoAlign === 'end',
              'text-text-tertiary': isBrightInnerColor,
            },
          semanticCls.text,
        )}
        title={typeof text === 'string' ? text : undefined}
      >
        {text}
      </span>
    );
  }, [showInfo, percent, percentNumber, progressStatus, type, prefixCls, format]);

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Progress');

    if (type === 'circle' || type === 'dashboard') {
      if (Array.isArray(size)) {
        warning(
          false,
          'usage',
          'Type "circle" and "dashboard" do not accept array as `size`, please use number or preset size instead.',
        );
      } else if (typeof size === 'object') {
        warning(
          false,
          'usage',
          'Type "circle" and "dashboard" do not accept object as `size`, please use number or preset size instead.',
        );
      }
    }
  }

  let progress: React.ReactNode;
  // Render progress shape
  if (type === 'line') {
    progress = steps ? (
      <Steps
        {...props}
        strokeColor={strokeColorNotGradient}
        prefixCls={prefixCls}
        steps={typeof steps === 'object' ? steps.count : steps}
        status={progressStatus}
      >
        {progressInfo}
      </Steps>
    ) : (
      <Line
        {...props}
        strokeColor={strokeColorNotArray}
        prefixCls={prefixCls}
        percentPosition={{
          align: infoAlign,
          type: infoPosition,
        }}
        status={progressStatus}
      >
        {progressInfo}
      </Line>
    );
  } else if (type === 'circle' || type === 'dashboard') {
    progress = (
      <Circle
        {...props}
        strokeColor={strokeColorNotArray}
        prefixCls={prefixCls}
        status={progressStatus}
      >
        {progressInfo}
      </Circle>
    );
  }

  const classString = clsx(
    prefixCls,
    `${prefixCls}-status-${progressStatus}`,
    'inline-block text-sm leading-[1] text-text',
    isPureLineType && 'relative w-full',
    { 'text-xs': size === 'small' },
    {
      [`${prefixCls}-${(type === 'dashboard' && 'circle') || type}`]: type !== 'line',
      [`${prefixCls}-inline-circle`]: type === 'circle' && getSize(size, 'circle')[0] <= 20,
      [`${prefixCls}-line`]: isPureLineType,
      [`${prefixCls}-line-align-${infoAlign}`]: isPureLineType,
      [`${prefixCls}-line-position-${infoPosition}`]: isPureLineType,
      [`${prefixCls}-steps`]: steps,
      [`${prefixCls}-show-info`]: showInfo,
      [`${prefixCls}-${size}`]: typeof size === 'string',
    },
    semanticCls.root,
  );

  return (
    <div
      ref={ref}
      style={style}
      className={classString}
      role="progressbar"
      aria-valuenow={percentNumber}
      aria-valuemin={0}
      aria-valuemax={100}
      {...omit(restProps, [
        'trailColor',
        'strokeWidth',
        'gapDegree',
        'gapPosition',
        'strokeLinecap',
      ])}
    >
      {progress}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Progress.displayName = 'Progress';
}

export default Progress;
