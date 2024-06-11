import * as React from 'react';
import { debounce } from 'throttle-debounce';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import Indicator from './Indicator';

const SpinSizes = ['small', 'default', 'large'] as const;
export type SpinSize = (typeof SpinSizes)[number];
export type SpinIndicator = React.ReactElement<HTMLElement>;

export interface SpinProps {
  /** Customize prefix class name */
  prefixCls?: string;
  /** Additional class name of Spin */
  className?: ComplexClassName<'wrapper' | 'fullscreen' | 'item'>;
  /** Whether Spin is spinning */
  spinning?: boolean;
  /** Style of Spin */
  style?: React.CSSProperties;
  /** Size of Spin, options: `small`, `default` and `large` */
  size?: SpinSize;
  /** Customize description content when Spin has children */
  tip?: React.ReactNode;
  /** Specifies a delay in milliseconds for loading state (prevent flush) */
  delay?: number;
  /** React node of the spinning indicator */
  indicator?: SpinIndicator;
  /** Children of Spin */
  children?: React.ReactNode;
  /** Display a backdrop with the `Spin` component */
  fullscreen?: boolean;
}

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

const Spin: React.FC<SpinProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    spinning: customSpinning = true,
    delay = 0,
    className,
    size = 'default',
    tip,
    style,
    children,
    fullscreen = false,
    ...restProps
  } = props;
  const complexCls = getComplexCls(className);
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('spin', customizePrefixCls);

  const [spinning, setSpinning] = React.useState<boolean>(
    () => customSpinning && !shouldDelay(customSpinning, delay),
  );

  React.useEffect(() => {
    if (customSpinning) {
      const showSpinning = debounce(delay, () => {
        setSpinning(true);
      });
      showSpinning();
      return () => {
        showSpinning?.cancel?.();
      };
    }

    setSpinning(false);
  }, [delay, customSpinning]);

  const isNestedPattern = React.useMemo<boolean>(
    () => typeof children !== 'undefined' && !fullscreen,
    [children, fullscreen],
  );

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Spin');

    warning(
      !tip || isNestedPattern || fullscreen,
      'usage',
      '`tip` only work in nest or fullscreen pattern.',
    );
  }

  const spinClassName = clsx(
    prefixCls,
    'hidden transition-transform',
    {
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning inline-block`]: spinning,
      [`${prefixCls}-show-text`]: !!tip,
    },
    complexCls.root,
  );

  const containerClassName = clsx(`${prefixCls}-container`, {
    [`${prefixCls}-blur`]: spinning,
  });

  const spinElement: React.ReactNode = (
    <div
      {...restProps}
      style={style}
      className={spinClassName}
      aria-live="polite"
      aria-busy={spinning}
    >
      <Indicator prefixCls={prefixCls} size={size} className={complexCls.item} />
      {tip && (isNestedPattern || fullscreen) ? (
        <div className={`${prefixCls}-text`}>{tip}</div>
      ) : null}
    </div>
  );

  if (isNestedPattern) {
    return (
      <div {...restProps} className={clsx(`${prefixCls}-nested-loading`, complexCls.wrapper)}>
        {spinning && <div key="loading">{spinElement}</div>}
        <div className={containerClassName} key="container">
          {children}
        </div>
      </div>
    );
  }

  if (fullscreen) {
    return (
      <div
        className={clsx(
          `${prefixCls}-fullscreen`,
          {
            [`${prefixCls}-fullscreen-show`]: spinning,
          },
          complexCls.fullscreen,
        )}
      >
        {spinElement}
      </div>
    );
  }

  return spinElement;
};

if (process.env.NODE_ENV !== 'production') {
  Spin.displayName = 'Spin';
}

export default Spin;
