import omit from 'rc-util/lib/omit';
import * as React from 'react';
import cva from '../_util/cva';
import { tuple } from '../_util/type';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import { useCompactItemContext } from '../space/Compact';
import LoadingIcon from './LoadingIcon';
import Group, { GroupSizeContext } from './button-group';

const ButtonTypes = tuple('default', 'primary', 'text', 'link');
export type ButtonType = (typeof ButtonTypes)[number];
const ButtonShapes = tuple('default', 'circle', 'round');
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

const clsVariants = cva('relative inline-flex items-center font-medium text-sm shadow-sm', {
  variants: {
    type: {
      default:
        'text-neutral-text hover:ring-primary hover:text-primary ring-1 ring-inset ring-neutral-border focus-visible:ring-primary',
      primary:
        'bg-primary text-white hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
      text: '',
      link: 'text-primary shadow-none focus:outline-none focus-visible:ring-none hover:text-primary-hover',
    },
    shape: {
      default: '',
      round: 'rounded-full',
    },
    size: {
      small: 'py-1 px-3 rounded',
      middle: 'py-1.5 px-4 rounded-md',
      large: 'py-2 px-6 rounded-lg',
    },
    loading: { true: '' },
  },
  defaultVariants: {
    type: 'default',
    shape: 'default',
    size: 'middle',
  },
});

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

  const { compactSize, compactItemClassnames } = useCompactItemContext();

  const mergedSize = compactSize || groupSize || customizeSize || size;

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate']);

  const iconNode =
    icon && !innerLoading ? icon : <LoadingIcon existIcon={!!icon} loading={!!innerLoading} />;

  const variants = { type, size: mergedSize, shape };
  const classes = clsVariants(variants, [compactItemClassnames, className]);

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
