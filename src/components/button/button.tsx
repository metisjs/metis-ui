import omit from 'rc-util/lib/omit';
import * as React from 'react';
import cva from '../_util/cva';
import { cloneElement, isFragment } from '../_util/reactNode';
import { tuple } from '../_util/type';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import { useCompactItemContext } from '../space/Compact';
import LoadingIcon from './LoadingIcon';
import Group, { GroupSizeContext } from './button-group';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isString(str: any) {
  return typeof str === 'string';
}

function isUnBorderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}

// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactElement | string | number, needInserted: boolean) {
  // Check the child if is undefined or null.
  if (child === null || child === undefined) {
    return;
  }
  const SPACE = needInserted ? ' ' : '';
  // strictNullChecks oops.
  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child.type) &&
    isTwoCNChar(child.props.children)
  ) {
    return cloneElement(child, {
      children: child.props.children.split('').join(SPACE),
    });
  }
  if (typeof child === 'string') {
    return isTwoCNChar(child) ? <span>{child.split('').join(SPACE)}</span> : <span>{child}</span>;
  }
  if (isFragment(child)) {
    return <span>{child}</span>;
  }
  return child;
}

function spaceChildren(children: React.ReactNode, needInserted: boolean) {
  let isPrevChildPure: boolean = false;
  const childList: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    const type = typeof child;
    const isCurrentChildPure = type === 'string' || type === 'number';
    if (isPrevChildPure && isCurrentChildPure) {
      const lastIndex = childList.length - 1;
      const lastChild = childList[lastIndex];
      childList[lastIndex] = `${lastChild}${child}`;
    } else {
      childList.push(child);
    }

    isPrevChildPure = isCurrentChildPure;
  });

  // Pass to React.Children.map to auto fill key
  return React.Children.map(childList, (child) =>
    insertSpace(child as React.ReactElement | string | number, needInserted),
  );
}

const ButtonTypes = tuple('default', 'primary', 'dashed', 'link', 'text');
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
  block?: boolean;
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

const clsVariants = cva('relative inline-block font-medium text-sm shadow', {
  variants: {
    type: {
      default: '',
      primary: 'bg-primary text-primary-content',
      dashed: 'border-dashed border shadow-none',
      link: '',
      text: '',
    },
    shape: {
      default: '',
      circle: 'rounded-full',
      round: '',
    },
    size: {
      small: 'py-1 px-2 rounded',
      middle: 'py-1.5 px-2.5 rounded-md',
      large: 'py-2 px-3 rounded-lg',
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
    block = false,
    htmlType = 'button',
    ...rest
  } = props;

  const size = React.useContext(SizeContext);
  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const groupSize = React.useContext(GroupSizeContext);
  const [innerLoading, setLoading] = React.useState<Loading>(!!loading);
  const [hasTwoCNChar, setHasTwoCNChar] = React.useState(false);
  const { autoInsertSpaceInButton } = React.useContext(ConfigContext);
  const buttonRef = (ref as any) || React.createRef<HTMLElement>();
  const isNeedInserted = () =>
    React.Children.count(children) === 1 && !icon && !isUnBorderedButtonType(type);

  const fixTwoCNChar = () => {
    // Fix for HOC usage like <FormatMessage />
    if (!buttonRef || !buttonRef.current || autoInsertSpaceInButton === false) {
      return;
    }
    const buttonText = buttonRef.current.textContent;
    if (isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true);
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  };

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

  React.useEffect(fixTwoCNChar, [buttonRef]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    if (innerLoading || mergedDisabled) {
      e.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
  };

  const autoInsertSpace = autoInsertSpaceInButton !== false;
  const { compactSize, compactItemClassnames } = useCompactItemContext();

  const mergedSize = compactSize || groupSize || customizeSize || size;

  const iconType = innerLoading ? 'loading' : icon;

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate']);

  const iconNode =
    icon && !innerLoading ? icon : <LoadingIcon existIcon={!!icon} loading={!!innerLoading} />;

  const kids =
    children || children === 0
      ? spaceChildren(children, isNeedInserted() && autoInsertSpace)
      : null;

  const variants = { type, size: mergedSize };
  const classes = clsVariants(variants, [compactItemClassnames, className]);

  if (linkButtonRestProps.href !== undefined) {
    return (
      <a {...linkButtonRestProps} className={classes} onClick={handleClick} ref={buttonRef}>
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
      ref={buttonRef}
    >
      {iconNode}
      {kids}
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
