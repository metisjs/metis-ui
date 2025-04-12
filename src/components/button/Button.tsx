import * as React from 'react';
import omit from '@rc-component/util/es/omit';
import { composeRef } from '@rc-component/util/es/ref';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
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
  className?: SemanticClassName<{ icon?: string }>;
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
    size: customizeSize,
    disabled: customDisabled,
    className,
    children,
    icon,
    autoInsertSpace,
    htmlType = 'button',
    ...rest
  } = props;

  const semanticCls = useSemanticCls(className, 'button');
  const { getPrefixCls, button } = React.useContext(ConfigContext);

  const mergedInsertSpace = autoInsertSpace ?? button?.autoInsertSpace ?? true;

  const prefixCls = getPrefixCls('btn', customizePrefixCls);

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

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
      if (innerLoading || mergedDisabled) {
        e.preventDefault();
        return;
      }
      (props.onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
    },
    [props.onClick, innerLoading, mergedDisabled],
  );

  const { compactSize, vertical, isCompactItem, compactItemClassnames } =
    useCompactItemContext(prefixCls);

  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined, mini: 'mini' };

  const mergedSize = useSize((ctxSize) => customizeSize ?? compactSize ?? ctxSize);

  const sizeCls = mergedSize ? (sizeClassNameMap[mergedSize] ?? '') : '';

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, ['navigate']);

  const iconOnly = !children && children !== 0 && !!iconType;

  const iconCls = clsx(
    {
      'size-4': mergedSize === 'small' || mergedSize === 'middle' || mergedSize === 'mini',
      'size-5': mergedSize === 'large',
    },
    iconOnly && {
      'size-4': mergedSize === 'mini',
      'h-[1.125rem] w-[1.125rem]': mergedSize === 'small' || mergedSize === 'middle',
      'size-5': mergedSize === 'large',
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
    'button focus-visible:outline-primary relative inline-flex w-fit cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap shadow-xs transition-[background-color] ease-in-out focus-visible:outline-2 focus-visible:-outline-offset-2',
    {
      'bg-container text-text outline-border enabled:hover:bg-fill-quinary outline -outline-offset-1':
        type === 'default',
      'bg-primary enabled:hover:bg-primary-hover text-white focus-visible:outline-offset-2':
        type === 'primary',
      'text-text enabled:hover:bg-fill-tertiary shadow-none': type === 'text',
      'text-primary enabled:hover:text-primary-hover shadow-none': type === 'link',
    },
    {
      'gap-x-1.5 rounded-sm px-3 py-1': mergedSize === 'mini',
      'gap-x-1.5 px-3 py-1.5': mergedSize === 'small',
      'gap-x-1.5 px-4 py-2': mergedSize === 'middle',
      'gap-x-2 px-4 py-2.5': mergedSize === 'large',
    },
    iconOnly && {
      'h-7 w-7': mergedSize === 'mini',
      'h-8 w-8': mergedSize === 'small',
      'h-9 w-9': mergedSize === 'middle',
      'h-10 w-10': mergedSize === 'large',
    },
    {
      'rounded-full': shape === 'round',
      'justify-center ps-0 pe-0 text-base': iconOnly,
      'opacity-disabled cursor-not-allowed focus-visible:outline-0': mergedDisabled,
      'text-error outline-error focus-visible:outline-error enabled:hover:bg-error-bg': danger,
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
      'enabled:hover:text-error-hover enabled:hover:bg-transparent': type === 'link',
      'bg-error focus-visible:outline-error enabled:hover:bg-error-hover text-white enabled:hover:text-white':
        type === 'primary',
    },
    isCompactItem &&
      type === 'primary' && [
        '[&+.button]:before:bg-primary-hover [&+.button]:before:absolute [&+.button]:before:-start-px [&+.button]:before:inline-block [&+.button]:before:h-full [&+.button]:before:w-px',
        vertical &&
          '[&+.button]:before:start-auto [&+.button]:before:-top-px [&+.button]:before:h-px [&+.button]:before:w-full',
      ],
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
