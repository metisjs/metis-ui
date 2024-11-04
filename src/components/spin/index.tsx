import * as React from 'react';
import { debounce } from 'throttle-debounce';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
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
  className?: SemanticClassName<{
    wrapper?: string;
    fullscreen?: string;
    indicator?: string;
    tip?: string;
  }>;
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
  const semanticCls = useSemanticCls(className, 'spin');
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

  const spinCls = clsx(
    prefixCls,
    'hidden transition-transform',
    {
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning inline-block`]: spinning,
      [`${prefixCls}-show-text`]: !!tip,
    },
    isNestedPattern &&
      'absolute z-[4] flex h-full max-h-[25rem] w-full flex-col items-center justify-center',
    fullscreen && 'flex flex-col items-center justify-center',
    semanticCls.root,
  );
  const nestedCls = clsx(`${prefixCls}-nested-loading`, 'relative', semanticCls.wrapper);
  const containerCls = clsx(
    `${prefixCls}-container`,
    {
      [`${prefixCls}-blur pointer-events-none select-none opacity-50`]: spinning,
    },
    'relative h-full transition-opacity',
  );
  const tipCls = clsx(
    `${prefixCls}-text`,
    'mt-2 text-text-tertiary',
    {
      'mt-1': size === 'small',
      'mt-3': size === 'large',
    },
    fullscreen && 'text-primary',
    semanticCls.tip,
  );
  const fullscreenCls = clsx(
    `${prefixCls}-fullscreen`,
    {
      [`${prefixCls}-fullscreen-show`]: spinning,
    },
    'invisible fixed inset-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-mask opacity-0 transition-all',
    spinning && 'visible opacity-100',
    semanticCls.fullscreen,
  );

  const spinElement: React.ReactNode = (
    <div {...restProps} style={style} className={spinCls} aria-live="polite" aria-busy={spinning}>
      <Indicator
        prefixCls={prefixCls}
        size={size}
        className={clsx(fullscreen && 'bg-primary', semanticCls.indicator)}
      />
      {tip && (isNestedPattern || fullscreen) ? <div className={tipCls}>{tip}</div> : null}
    </div>
  );

  if (isNestedPattern) {
    return (
      <div {...restProps} className={nestedCls}>
        {spinning && <div key="loading">{spinElement}</div>}
        <div className={containerCls} key="container">
          {children}
        </div>
      </div>
    );
  }

  if (fullscreen) {
    return <div className={fullscreenCls}>{spinElement}</div>;
  }

  return spinElement;
};

if (process.env.NODE_ENV !== 'production') {
  Spin.displayName = 'Spin';
}

export default Spin;
