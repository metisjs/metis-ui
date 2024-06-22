import { LoadingOutline } from '@metisjs/icons';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { ComplexClassName, getComplexCls } from '../_util/classNameUtils';
import cva from '../_util/cva';
import { cloneElement } from '../_util/reactNode';
import { tuple } from '../_util/type';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { useCompactItemContext } from '../space/Compact';

function isUnBorderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}

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
  className?: ComplexClassName<'icon'>;
  ghost?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
}

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

type CompoundedComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
> & {
  /** @internal */
  __METIS_BUTTON: boolean;
};

type Loading = number | boolean;

const btnVariantStyles = cva(
  'relative inline-flex items-center justify-center gap-x-1.5 text-sm font-medium shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2',
  {
    variants: {
      type: {
        default:
          'bg-neutral-bg-container text-neutral-text ring-1 ring-inset ring-neutral-border focus-visible:ring-primary enabled:hover:bg-neutral-fill-quinary',
        primary:
          'bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-0 enabled:hover:bg-primary-hover',
        text: 'text-neutral-text shadow-none ring-inset focus-visible:ring-primary enabled:hover:bg-neutral-fill-tertiary',
        link: 'focus-visible:ring-none text-primary shadow-none ring-inset focus-visible:ring-primary enabled:hover:text-primary-hover',
      },
      size: {
        small: 'px-2.5 py-1.5',
        middle: 'px-3 py-2',
        large: 'gap-x-2 px-4 py-2 text-base',
      },
      shape: {
        default: 'rounded-md',
        round: 'rounded-full',
      },
      iconOnly: {
        true: 'h-9 w-9 justify-center pe-0 ps-0 text-base',
      },
      disabled: { true: 'cursor-not-allowed opacity-disabled focus-visible:ring-0' },
      danger: {
        true: 'text-error ring-error-bg-hover focus-visible:ring-error enabled:hover:bg-error-bg',
      },
      ghost: { true: 'bg-transparent text-white ring-white enabled:hover:bg-transparent' },
      loading: { true: 'cursor-not-allowed' },
      href: { true: '' },
    },
    compoundVariants: [
      {
        size: 'small',
        iconOnly: true,
        className: 'h-8 w-8',
      },
      {
        size: 'large',
        iconOnly: true,
        className: 'h-10 w-10',
      },
      {
        type: 'default',
        href: true,
        disabled: false,
        className: 'hover:bg-neutral-fill-quinary',
      },
      {
        type: 'primary',
        href: true,
        disabled: false,
        className: 'hover:bg-primary-hover',
      },
      {
        type: 'text',
        href: true,
        disabled: false,
        className: 'hover:bg-neutral-fill-secondary',
      },
      {
        type: 'link',
        href: true,
        disabled: false,
        className: 'hover:text-primary-hover',
      },
      {
        type: 'link',
        danger: true,
        disabled: false,
        className: 'enabled:hover:bg-transparent enabled:hover:text-error-hover',
      },
      {
        type: 'primary',
        danger: true,
        ghost: false,
        className:
          'bg-error text-white  focus-visible:outline-error enabled:hover:bg-error-hover enabled:hover:text-white',
      },
      {
        type: 'default',
        ghost: true,
        danger: false,
        className: 'enabled:hover:text-primary-hover enabled:hover:ring-primary-hover',
      },
      {
        type: 'primary',
        ghost: true,
        danger: false,
        className:
          'text-primary ring-1 ring-primary enabled:hover:text-primary-hover enabled:hover:ring-primary-hover',
      },
      {
        danger: true,
        ghost: true,
        className: 'text-error ring-1 ring-error',
      },
    ],
    defaultVariants: {
      type: 'default',
      shape: 'default',
      size: 'middle',
    },
  },
);

const iconVariantStyles = cva('', {
  variants: {
    size: { small: 'h-4 w-4', middle: 'h-4 w-4', large: 'h-5 w-5' },
    iconOnly: { true: '' },
  },
  compoundVariants: [
    { size: 'small', iconOnly: true, className: 'h-5 w-5' },
    { size: 'middle', iconOnly: true, className: 'h-5 w-5' },
    { size: 'large', iconOnly: true, className: 'h-6 w-6' },
  ],
  defaultVariants: {
    size: 'middle',
  },
});

const InternalButton: React.ForwardRefRenderFunction<unknown, ButtonProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    loading = false,
    type = 'default',
    danger,
    shape = 'default',
    size: customizeSize,
    disabled: customDisabled,
    className,
    children,
    icon,
    ghost = false,
    htmlType = 'button',
    ...rest
  } = props;

  const complexCls = getComplexCls(className);
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

  warning(
    !(ghost && isUnBorderedButtonType(type)),
    'Button',
    "`link` or `text` button can't be a `ghost` button.",
  );

  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };

  const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? ctxSize);

  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] || '' : '';

  const mergedSize = compactSize || customizeSize || size;

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate']);

  const iconOnly = !children && children !== 0 && !!iconType;

  const iconNode = innerLoading ? (
    <LoadingOutline
      className={iconVariantStyles({ size: mergedSize, iconOnly }, [
        'animate-spin',
        complexCls.icon,
      ])}
    />
  ) : (
    cloneElement(icon, ({ className: originCls }) => ({
      className: iconVariantStyles({ size: mergedSize, iconOnly }, [originCls, complexCls.icon]),
    }))
  );

  const variants = {
    type,
    size: mergedSize,
    shape,
    iconOnly,
    href: linkButtonRestProps.href !== undefined,
    disabled: mergedDisabled,
    danger: !!danger,
    ghost: type !== 'text' && type !== 'link' && ghost,
    loading: !!innerLoading,
  };
  const classes = btnVariantStyles(variants, [
    prefixCls,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-dangerous`]: !!danger,
    },
    compactItemClassnames,
    complexCls.root,
  ]);

  if (linkButtonRestProps.href !== undefined) {
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
