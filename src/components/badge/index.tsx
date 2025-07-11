import * as React from 'react';
import { useMemo, useRef } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import type { PresetColorType } from '@util/colors';
import { getPresetColorCls, isPresetColor, type PresetStatusColorType } from '@util/colors';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import type { LiteralUnion } from '@util/type';
import { ConfigContext } from '../config-provider';
import Transition from '../transition';
import Ribbon from './Ribbon';
import ScrollNumber from './ScrollNumber';

export type { ScrollNumberProps } from './ScrollNumber';

export interface BadgeProps {
  /** Number to show in badge */
  count?: React.ReactNode;
  showZero?: boolean;
  /** Max count to show */
  overflowCount?: number;
  /** Whether to show red dot without number */
  dot?: boolean;
  style?: React.CSSProperties;
  prefixCls?: string;
  scrollNumberPrefixCls?: string;
  className?: SemanticClassName<{ wrapper?: string }>;
  status?: PresetStatusColorType;
  color?: LiteralUnion<PresetColorType>;
  text?: React.ReactNode;
  size?: 'default' | 'small';
  offset?: [number | string, number | string];
  title?: string;
  children?: React.ReactNode;
}

const InternalBadge = React.forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    scrollNumberPrefixCls,
    children,
    status,
    color,
    text,
    count = null,
    overflowCount = 99,
    dot = false,
    size = 'default',
    title,
    offset,
    style,
    className,
    showZero = false,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('badge', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'badge');

  // ================================ Misc ================================
  const numberedDisplayCount = (
    (count as number) > (overflowCount as number) ? `${overflowCount}+` : count
  ) as string | number | null;

  const isZero = numberedDisplayCount === '0' || numberedDisplayCount === 0;

  const ignoreCount = count === null || (isZero && !showZero);

  const hasStatus =
    ((status !== null && status !== undefined) || (color !== null && color !== undefined)) &&
    ignoreCount;

  const showAsDot = dot && !isZero;

  const mergedCount = showAsDot ? '' : numberedDisplayCount;

  const isHidden = useMemo(() => {
    const isEmpty = mergedCount === null || mergedCount === undefined || mergedCount === '';
    return (isEmpty || (isZero && !showZero)) && !showAsDot;
  }, [mergedCount, isZero, showZero, showAsDot]);

  // Count should be cache in case hidden change it
  const countRef = useRef(count);
  if (!isHidden) {
    countRef.current = count;
  }
  const livingCount = countRef.current;

  // We need cache count since remove motion should not change count display
  const displayCountRef = useRef(mergedCount);
  if (!isHidden) {
    displayCountRef.current = mergedCount;
  }
  const displayCount = displayCountRef.current;

  // We will cache the dot status to avoid shaking on leaved motion
  const isDotRef = useRef(showAsDot);
  if (!isHidden) {
    isDotRef.current = showAsDot;
  }

  // =============================== Styles ===============================
  const mergedStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!offset) {
      return style;
    }

    const offsetStyle: React.CSSProperties = {
      marginTop: offset[1],
      right: -parseInt(offset[0] as string, 10),
    };

    return { ...offsetStyle, ...style };
  }, [offset, style]);

  // =============================== Render ===============================
  // >>> Title
  const titleNode =
    title ??
    (typeof livingCount === 'string' || typeof livingCount === 'number' ? livingCount : undefined);

  // >>> Status Text
  const statusTextNode =
    isHidden || !text ? null : <span className={`${prefixCls}-status-text`}>{text}</span>;

  // >>> Display Component
  const displayNode =
    !livingCount || typeof livingCount !== 'object'
      ? undefined
      : cloneElement(livingCount, (oriProps) => ({
          style: { ...mergedStyle, ...oriProps.style },
        }));

  // InternalColor
  const isInternalColor = isPresetColor(color);

  // Shared styles
  const presetStatusCls = clsx({
    'bg-text-quaternary': status === 'default',
    'bg-success': status === 'success',
    'bg-warning': status === 'warning',
    'bg-error': status === 'error',
    'bg-primary after:bg-primary after:absolute after:inset-0 after:inline-flex after:animate-ping after:rounded-full after:opacity-75':
      status === 'processing',
  });

  const statusCls = clsx(
    {
      [`${prefixCls}-status-dot`]: hasStatus,
      [`${prefixCls}-status-${status}`]: !!status,
      [`${prefixCls}-color-${color}`]: isInternalColor,
    },
    'bg-text-quaternary relative -top-[2px] inline-block h-[0.375rem] w-[0.375rem] rounded-full',
    isInternalColor && getPresetColorCls(color, { rawBackground: true }),
    presetStatusCls,
    semanticCls.root,
  );

  const statusTextCls = clsx(`${prefixCls}-status-text`, 'text-text ms-2 text-sm');

  const statusStyle: React.CSSProperties = {};
  if (color && !isInternalColor) {
    statusStyle.color = color;
    statusStyle.background = color;
  }

  const badgeClassName = clsx(
    prefixCls,
    {
      [`${prefixCls}-status`]: hasStatus,
      [`${prefixCls}-not-a-wrapper`]: !children,
    },
    'relative inline-block w-fit leading-none',
    {
      'align-middle only:block': !children,
    },
    semanticCls.wrapper,
  );

  const isDot = isDotRef.current;
  const multiWords = !isDot && displayCount && displayCount.toString().length > 1;
  const scrollNumberCls = clsx(
    {
      [`${prefixCls}-dot`]: isDot,
      [`${prefixCls}-count`]: !isDot,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-multiple-words`]: multiWords,
      [`${prefixCls}-status-${status}`]: !!status,
    },
    'relative z-auto text-center transition-colors',
    {
      'bg-error h-2 w-2 rounded-full': isDot,
      'bg-error inline-flex min-w-5 justify-center overflow-hidden rounded-full text-xs leading-5 text-white':
        !isDot,
      'outline-container absolute end-0 top-0 origin-center translate-x-1/2 -translate-y-1/2 outline-2':
        children,
      'relative top-auto block origin-center outline-0': !children,
      'px-2': multiWords,
    },
    size === 'small' && {
      'min-w-4 leading-4': !isDot,
      'h-[0.375rem] w-[0.375rem]': isDot,
      'px-1': multiWords,
    },
    isInternalColor && getPresetColorCls(color, { rawBackground: true }),
    isDot && !!status && presetStatusCls,
    semanticCls.root,
  );
  const customComponentCls = clsx(
    !!children &&
      'absolute end-0 top-0 origin-center translate-x-1/2 -translate-y-1/2 overflow-hidden',
  );

  if (!children && hasStatus) {
    return (
      <span {...restProps} className={badgeClassName} style={mergedStyle}>
        <span className={statusCls} style={statusStyle} />
        {text && <span className={statusTextCls}>{text}</span>}
      </span>
    );
  }

  let scrollNumberStyle: React.CSSProperties = {
    ...mergedStyle,
  };
  if (color && !isInternalColor) {
    scrollNumberStyle = scrollNumberStyle || {};
    scrollNumberStyle.background = color;
  }

  return (
    <span ref={ref} {...restProps} className={badgeClassName}>
      {children}
      <Transition
        visible={!isHidden}
        appear={false}
        enter="transition duration-300"
        enterFrom="scale-0 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition duration-300"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-0 opacity-0"
        deadline={1000}
      >
        {({ className: transitionCls, style: transitionStyle }, ref) => (
          <ScrollNumber
            ref={ref}
            prefixCls={scrollNumberPrefixCls}
            show={!isHidden}
            className={clsx(scrollNumberCls, transitionCls)}
            customComponentCls={customComponentCls}
            count={displayCount}
            title={titleNode}
            style={{ ...scrollNumberStyle, ...transitionStyle }}
            key="scrollNumber"
          >
            {displayNode}
          </ScrollNumber>
        )}
      </Transition>
      {statusTextNode}
    </span>
  );
});

type CompoundedComponent = typeof InternalBadge & {
  Ribbon: typeof Ribbon;
};

const Badge = InternalBadge as CompoundedComponent;

Badge.Ribbon = Ribbon;

if (process.env.NODE_ENV !== 'production') {
  Badge.displayName = 'Badge';
}

export default Badge;
