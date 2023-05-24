import { LoadingOutline } from '@metaoa/icons';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import cva from '../_util/cva';
import { tuple } from '../_util/type';
import warning from '../_util/warning';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import { useCompactItemContext } from '../space/Compact';
import Group, { GroupSizeContext } from './ButtonGroup';

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
  className?: string;
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
  Group: typeof Group;
  /** @internal */
  __META_BUTTON: boolean;
};

type Loading = number | boolean;

const variantStyles = cva(
  'meta-btn relative inline-flex items-center justify-center gap-x-1.5 text-sm font-medium shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2',
  {
    variants: {
      type: {
        default:
          'bg-neutral-container bg-neutral-bg-container text-neutral-text ring-1 ring-inset ring-neutral-border focus-visible:ring-primary enabled:hover:text-primary-text-hover enabled:hover:ring-primary-hover',
        primary:
          'bg-primary text-white focus-visible:ring-primary focus-visible:ring-offset-2 enabled:hover:bg-primary-hover',
        text: 'text-neutral-text shadow-none ring-inset focus-visible:ring-primary enabled:hover:bg-neutral-fill-tertiary',
        link: 'focus-visible:ring-none text-primary shadow-none ring-inset focus-visible:ring-primary enabled:hover:text-primary-hover',
      },
      size: {
        small: 'px-2.5 py-1.5',
        middle: 'px-3 py-2',
        large: 'gap-x-2 px-4 py-2.5',
      },
      shape: {
        default: 'rounded-md',
        round: 'rounded-full',
      },
      iconOnly: {
        true: 'h-9 w-9 justify-center pe-0 ps-0 text-base',
      },
      link: { true: '' },
      disabled: { true: 'cursor-not-allowed opacity-40 focus-visible:ring-0' },
      danger: {
        true: 'text-error ring-error focus-visible:ring-error enabled:hover:text-error-hover enabled:hover:ring-error-hover',
      },
      ghost: { true: 'bg-transparent text-white ring-white enabled:hover:bg-transparent' },
      loading: { true: 'cursor-not-allowed' },
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
        link: true,
        disabled: false,
        className: 'hover:text-primary-text-hover hover:ring-primary-hover',
      },
      {
        type: 'primary',
        link: true,
        disabled: false,
        className: 'hover:bg-primary-hover',
      },
      {
        type: 'text',
        link: true,
        disabled: false,
        className: 'hover:bg-neutral-fill-secondary',
      },
      {
        type: 'link',
        link: true,
        disabled: false,
        className: 'hover:text-primary-hover',
      },
      {
        type: 'primary',
        danger: true,
        ghost: false,
        className: 'bg-error text-white enabled:hover:bg-error-hover enabled:hover:text-white',
      },
      {
        type: 'text',
        danger: true,
        className: 'enabled:hover:bg-error-bg',
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

const InternalButton: React.ForwardRefRenderFunction<unknown, ButtonProps> = (props, ref) => {
  const {
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

  const size = React.useContext(SizeContext);
  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = React.useContext(GroupSizeContext);
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

  const { compactSize, compactItemClassnames } = useCompactItemContext();

  const mergedSize = compactSize || groupSize || customizeSize || size;

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate']);

  const iconNode = innerLoading ? <LoadingOutline className="animate-spin" /> : icon;

  const variants = {
    type,
    size: mergedSize,
    shape,
    iconOnly: !children && children !== 0 && !!iconType,
    link: linkButtonRestProps.href !== undefined,
    disabled: mergedDisabled,
    danger: !!danger,
    ghost: type !== 'text' && type !== 'link' && ghost,
    loading: !!innerLoading,
  };
  const classes = variantStyles(variants, [compactItemClassnames, className]);

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

Button.Group = Group;
Button.__META_BUTTON = true;

export default Button;
