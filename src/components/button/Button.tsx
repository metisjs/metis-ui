import { LoadingOutline } from '@metisjs/icons';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import { cloneElement } from '../_util/reactNode';
import { tuple } from '../_util/type';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { useCompactItemContext } from '../space/Compact';

const ButtonTypes = tuple('default', 'primary', 'text', 'link');
export type ButtonType = (typeof ButtonTypes)[number];
const ButtonShapes = tuple('default', 'round');
export type ButtonShape = (typeof ButtonShapes)[number];
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: SemanticClassName<'icon'>;
  danger?: boolean;
  children?: React.ReactNode;
}

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick' | 'className'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick' | 'className'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

type CompoundedComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
> & {
  /** @internal */
  __METIS_BUTTON: boolean;
};

type Loading = number | boolean;

const InternalButton: React.ForwardRefRenderFunction<unknown, ButtonProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    loading = false,
    type = 'default',
    danger,
    shape = 'default',
    size: customizeSize = 'middle',
    disabled: customDisabled,
    className,
    children,
    icon,
    htmlType = 'button',
    ...rest
  } = props;

  const semanticCls = getSemanticCls(className);
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const size = React.useContext(SizeContext);
  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const [innerLoading, setLoading] = React.useState<Loading>(!!loading);
  const buttonRef = (ref as any) || React.createRef<HTMLElement>();

  // =============== Update Loading ===============
  const loadingOrDelay: Loading = typeof loading === 'boolean' ? loading : loading?.delay || true;

  React.useEffect(() => {
    let delayTimer: number | null = null;

    if (typeof loadingOrDelay === 'number') {
      delayTimer = window.setTimeout(() => {
        delayTimer = null;
        setLoading(loadingOrDelay);
      }, loadingOrDelay);
    } else {
      setLoading(loadingOrDelay);
    }

    return () => {
      if (delayTimer) {
        // in order to not perform a React state update on an unmounted component
        // and clear timer after 'loadingOrDelay' updated.
        window.clearTimeout(delayTimer);
        delayTimer = null;
      }
    };
  }, [loadingOrDelay]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    if (innerLoading || mergedDisabled) {
      e.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
  };

  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };

  const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? ctxSize);

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] || '' : '';

  const mergedSize = compactSize || customizeSize || size;

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate']);

  const iconOnly = !children && children !== 0 && !!iconType;

  const iconCls = clsx(
    {
      'h-4 w-4': mergedSize === 'small' || mergedSize === 'middle',
      'h-5 w-5': mergedSize === 'large',
    },
    iconOnly && {
      'h-5 w-5': mergedSize === 'small' || mergedSize === 'middle',
      'h-6 w-6': mergedSize === 'large',
    },
    semanticCls.icon,
  );

  const iconNode = innerLoading ? (
    <LoadingOutline className={clsx('animate-spin', iconCls)} />
  ) : (
    cloneElement(icon, ({ className: originCls }) => ({
      className: clsx(iconCls, originCls),
    }))
  );

  const isHref = linkButtonRestProps.href !== undefined;

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-dangerous`]: !!danger,
    },
    'relative inline-flex items-center justify-center gap-x-1.5 whitespace-nowrap rounded-md text-sm font-medium shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2',
    {
      'bg-neutral-bg-container text-neutral-text ring-1 ring-inset ring-neutral-border focus-visible:ring-primary enabled:hover:bg-neutral-fill-quinary':
        type === 'default',
      'bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-0 enabled:hover:bg-primary-hover':
        type === 'primary',
      'text-neutral-text shadow-none ring-inset focus-visible:ring-primary enabled:hover:bg-neutral-fill-tertiary':
        type === 'text',
      'focus-visible:ring-none text-primary shadow-none ring-inset focus-visible:ring-primary enabled:hover:text-primary-hover':
        type === 'link',
    },
    {
      'px-3 py-1.5': mergedSize === 'small',
      'px-4 py-2': mergedSize === 'middle',
      'gap-x-2 px-4 py-2 text-base': mergedSize === 'large',
    },
    iconOnly && {
      'h-8 w-8': mergedSize === 'small',
      'h-9 w-9': mergedSize === 'middle',
      'h-10 w-10': mergedSize === 'large',
    },
    {
      'rounded-full': shape === 'round',
      'justify-center pe-0 ps-0 text-base': iconOnly,
      'cursor-not-allowed opacity-disabled focus-visible:ring-0': mergedDisabled,
      'text-error ring-error-bg-hover focus-visible:ring-error enabled:hover:bg-error-bg': danger,
      'cursor-not-allowed': innerLoading,
    },
    isHref &&
      !mergedDisabled && {
        'hover:bg-neutral-fill-quinary': type === 'default',
        'hover:bg-primary-hover': type === 'primary',
        'hover:bg-neutral-fill-secondary': type === 'text',
        'hover:text-primary-hover': type === 'link',
      },
    danger && {
      'enabled:hover:bg-transparent enabled:hover:text-error-hover': type === 'link',
      'bg-error text-white focus-visible:outline-error enabled:hover:bg-error-hover enabled:hover:text-white':
        type === 'primary',
    },
    semanticCls.root,
    compactItemClassnames,
  );

  if (isHref) {
    return (
      <a {...linkButtonRestProps} className={classes} onClick={handleClick} ref={buttonRef}>
        {iconNode}
        {children}
      </a>
    );
  }

  const buttonNode = (
    <button
      {...rest}
      // eslint-disable-next-line react/button-has-type
      type={htmlType}
      className={classes}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef}
    >
      {iconNode}
      {children}
    </button>
  );

  return buttonNode;
};

const Button = React.forwardRef<unknown, ButtonProps>(InternalButton) as CompoundedComponent;
if (process.env.NODE_ENV !== 'production') {
  Button.displayName = 'Button';
}

Button.__METIS_BUTTON = true;

export default Button;
