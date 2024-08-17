import * as React from 'react';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import { useCompactItemContext } from '../space/Compact';
import LoadingIcon from './LoadingIcon';
import { isTwoCNChar, isUnBorderedButtonType, spaceChildren } from './utils';

const ButtonTypes = ['default', 'primary', 'link', 'text'] as const;
export type ButtonType = (typeof ButtonTypes)[number];

const ButtonShapes = ['default', 'round'] as const;
export type ButtonShape = (typeof ButtonShapes)[number];

const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const;
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

type MergedHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLElement> &
    React.ButtonHTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLElement>,
  'type' | 'className'
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
  autoInsertSpace?: boolean;
}

type LoadingConfigType = {
  loading: boolean;
  delay: number;
};

function getLoadingConfig(loading: BaseButtonProps['loading']): LoadingConfigType {
  if (typeof loading === 'object' && loading) {
    let delay = loading?.delay;
    delay = !Number.isNaN(delay) && typeof delay === 'number' ? delay : 0;
    return {
      loading: delay <= 0,
      delay,
    };
  }

  return {
    loading: !!loading,
    delay: 0,
  };
}

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
    autoInsertSpace,
    htmlType = 'button',
    ...rest
  } = props;

  const semanticCls = getSemanticCls(className);
  const { getPrefixCls, button } = React.useContext(ConfigContext);

  const mergedInsertSpace = autoInsertSpace ?? button?.autoInsertSpace ?? true;

  const prefixCls = getPrefixCls('btn', customizePrefixCls);

  const size = React.useContext(SizeContext);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const loadingOrDelay = React.useMemo<LoadingConfigType>(
    () => getLoadingConfig(loading),
    [loading],
  );

  const [innerLoading, setLoading] = React.useState<boolean>(loadingOrDelay.loading);

  const [hasTwoCNChar, setHasTwoCNChar] = React.useState<boolean>(false);

  const internalRef = React.createRef<HTMLButtonElement | HTMLAnchorElement>();

  const buttonRef = composeRef(ref, internalRef);

  const needInserted =
    React.Children.count(children) === 1 && !icon && !isUnBorderedButtonType(type);

  React.useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    if (loadingOrDelay.delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setLoading(true);
      }, loadingOrDelay.delay);
    } else {
      setLoading(loadingOrDelay.loading);
    }

    function cleanupTimer() {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    }

    return cleanupTimer;
  }, [loadingOrDelay]);

  React.useEffect(() => {
    if (!buttonRef || !(buttonRef as any).current || !mergedInsertSpace) {
      return;
    }
    const buttonText = (buttonRef as any).current.textContent;
    if (needInserted && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true);
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  }, [buttonRef]);

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

  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

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

  const iconNode =
    icon && !innerLoading ? (
      cloneElement(icon, ({ className: originCls }) => ({
        className: clsx(iconCls, originCls),
      }))
    ) : (
      <LoadingIcon
        existIcon={!!icon}
        prefixCls={prefixCls}
        loading={innerLoading}
        className={iconCls}
      />
    );

  const kids =
    children || children === 0 ? spaceChildren(children, needInserted && mergedInsertSpace) : null;

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
    'relative inline-flex w-fit items-center justify-center whitespace-nowrap text-sm font-medium shadow-sm transition ease-in-out focus:outline-none focus-visible:ring-2',
    {
      'bg-container text-text ring-1 ring-inset ring-border focus-visible:ring-primary enabled:hover:bg-fill-quinary':
        type === 'default',
      'bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-0 enabled:hover:bg-primary-hover':
        type === 'primary',
      'text-text shadow-none ring-inset focus-visible:ring-primary enabled:hover:bg-fill-tertiary':
        type === 'text',
      'focus-visible:ring-none text-primary shadow-none ring-inset focus-visible:ring-primary enabled:hover:text-primary-hover':
        type === 'link',
    },
    {
      'gap-x-1.5 rounded-md px-3 py-1.5': mergedSize === 'small',
      'gap-x-1.5 rounded-md px-4 py-2': mergedSize === 'middle',
      'gap-x-2 rounded-md px-4 py-2 text-base': mergedSize === 'large',
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
      'text-error ring-error focus-visible:ring-error enabled:hover:bg-error-bg': danger,
      'cursor-not-allowed': innerLoading,
    },
    isHref &&
      !mergedDisabled && {
        'hover:bg-fill-quinary': type === 'default',
        'hover:bg-primary-hover': type === 'primary',
        'hover:bg-fill-secondary': type === 'text',
        'hover:text-primary-hover': type === 'link',
      },
    danger && {
      'enabled:hover:bg-transparent enabled:hover:text-error-hover': type === 'link',
      'bg-error text-white focus-visible:outline-error enabled:hover:bg-error-hover enabled:hover:text-white':
        type === 'primary',
    },
    compactItemClassnames,
    semanticCls.root,
  );

  if (isHref) {
    return (
      <a
        {...linkButtonRestProps}
        className={classes}
        onClick={handleClick}
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        tabIndex={mergedDisabled ? -1 : 0}
      >
        {iconNode}
        {kids}
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
      ref={buttonRef as React.Ref<HTMLButtonElement>}
    >
      {iconNode}
      {kids}
    </button>
  );

  return buttonNode;
};

type CompoundedComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
> & {
  /** @internal */
  __METIS_BUTTON: boolean;
};

const Button = React.forwardRef<unknown, ButtonProps>(InternalButton) as CompoundedComponent;
if (process.env.NODE_ENV !== 'production') {
  Button.displayName = 'Button';
}

Button.__METIS_BUTTON = true;

export default Button;
