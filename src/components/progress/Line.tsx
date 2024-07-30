import * as React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { devUseWarning } from '../_util/warning';
import type {
  PercentPositionType,
  ProgressGradient,
  ProgressProps,
  StringGradients,
} from './Progress';
import { getSize, validProgress } from './utils';

interface LineProps extends ProgressProps {
  prefixCls: string;
  strokeColor?: string | ProgressGradient;
  percentPosition: PercentPositionType;
}

export const LineStrokeColorVar = '--progress-line-stroke-color';
export const PercentVar = '--progress-percent';

/**
 * @example
 *   {
 *     "0%": "#afc163",
 *     "75%": "#009900",
 *     "50%": "green", // ====> '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *     "25%": "#66FF00",
 *     "100%": "#ffffff"
 *   }
 */
export const sortGradient = (gradients: StringGradients) => {
  let tempArr: any[] = [];
  Object.keys(gradients).forEach((key) => {
    const formattedKey = parseFloat(key.replace(/%/g, ''));
    if (!isNaN(formattedKey)) {
      tempArr.push({
        key: formattedKey,
        value: gradients[key],
      });
    }
  });
  tempArr = tempArr.sort((a, b) => a.key - b.key);
  return tempArr.map(({ key, value }) => `${value} ${key}%`).join(', ');
};

/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
export const handleGradient = (strokeColor: ProgressGradient): React.CSSProperties => {
  const {
    from = 'hsla(var(--primary))',
    to = 'hsla(var(--primary))',
    direction = 'to right',
    ...rest
  } = strokeColor;
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest as StringGradients);
    const background = `linear-gradient(${direction}, ${sortedGradients})`;
    return { background, [LineStrokeColorVar]: background } as React.CSSProperties;
  }
  const background = `linear-gradient(${direction}, ${from}, ${to})`;
  return { background, [LineStrokeColorVar]: background } as React.CSSProperties;
};

const Line: React.FC<LineProps> = (props) => {
  const {
    prefixCls,
    percent,
    size,
    strokeWidth,
    strokeColor,
    strokeLinecap = 'round',
    children,
    trailColor = null,
    percentPosition,
    success,
    className,
    status,
  } = props;
  const semanticCls = getSemanticCls(className);

  const { align: infoAlign, type: infoPosition } = percentPosition;

  const backgroundProps =
    strokeColor && typeof strokeColor !== 'string'
      ? handleGradient(strokeColor)
      : { [LineStrokeColorVar]: strokeColor, background: strokeColor };

  const borderRadius = strokeLinecap === 'square' || strokeLinecap === 'butt' ? 0 : undefined;

  const mergedSize = size ?? [-1, strokeWidth || (size === 'small' ? 6 : 8)];

  const [width, height] = getSize(mergedSize, 'line', { strokeWidth });

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Progress');

    warning.deprecated(!('strokeWidth' in props), 'strokeWidth', 'size');
  }

  const trailStyle: React.CSSProperties = {
    backgroundColor: trailColor || undefined,
    borderRadius,
  };

  const percentStyle = {
    width: `${validProgress(percent)}%`,
    height,
    borderRadius,
    ...backgroundProps,
    [PercentVar]: validProgress(percent) / 100,
  };

  const successPercent = success?.percent;

  const successPercentStyle = {
    width: `${validProgress(successPercent)}%`,
    height,
    borderRadius,
    backgroundColor: success?.strokeColor,
  } as React.CSSProperties;

  const outerStyle: React.CSSProperties = {
    width: width < 0 ? '100%' : width,
  };

  const outerCls = clsx(`${prefixCls}-outer`, 'inline-flex w-full items-center', semanticCls.outer);
  const innerCls = clsx(
    `${prefixCls}-inner`,
    'relative inline-block w-full flex-1 overflow-hidden rounded-full bg-fill-quaternary align-middle',
    semanticCls.trail,
  );
  const innerBgCls = clsx(
    `${prefixCls}-bg`,
    `${prefixCls}-bg-${infoPosition}`,
    'relative overflow-hidden rounded-full bg-primary transition-all duration-300',
    {
      'before:absolute before:inset-0 before:animate-[2.4s_ease-in-out_infinite_progress-active] before:rounded-full before:bg-container before:opacity-0':
        status === 'active',
      'bg-success': status === 'success',
      'bg-error': status === 'exception',
    },
    {
      'min-w-max': infoPosition === 'inner',
    },
  );

  const lineInner = (
    <div className={innerCls} style={trailStyle}>
      <div className={innerBgCls} style={percentStyle}>
        {infoPosition === 'inner' && children}
      </div>
      {successPercent !== undefined && (
        <div
          className={clsx(
            `${prefixCls}-success-bg`,
            'absolute left-0 top-0 overflow-hidden rounded-full bg-success transition-all duration-300',
          )}
          style={successPercentStyle}
        />
      )}
    </div>
  );

  const isOuterStart = infoPosition === 'outer' && infoAlign === 'start';
  const isOuterEnd = infoPosition === 'outer' && infoAlign === 'end';

  return infoPosition === 'outer' && infoAlign === 'center' ? (
    <div
      className={clsx(`${prefixCls}-layout-bottom`, 'flex flex-col items-center justify-center')}
    >
      {lineInner}
      {children}
    </div>
  ) : (
    <div className={outerCls} style={outerStyle}>
      {isOuterStart && children}
      {lineInner}
      {isOuterEnd && children}
    </div>
  );
};

export default Line;
