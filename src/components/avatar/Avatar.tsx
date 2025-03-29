import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import ResizeObserver from 'rc-resize-observer';
import { composeRef } from 'rc-util/es/ref';
import { ConfigContext } from '../config-provider';
import type { AvatarSize } from './SizeContext';
import SizeContext from './SizeContext';

export interface AvatarProps {
  shape?: 'circle' | 'square';
  size?: AvatarSize;
  gap?: number;
  /** Src of image avatar */
  src?: React.ReactNode;
  /** Srcset of image avatar */
  srcSet?: string;
  draggable?: boolean;
  /** Icon to be used in avatar */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: SemanticClassName<{ children?: string }>;
  children?: React.ReactNode;
  alt?: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  /* callback when img load error */
  /* return false to prevent Avatar show default fallback behavior, then you can do fallback by your self */
  onError?: () => boolean;
}

const InternalAvatar: React.ForwardRefRenderFunction<HTMLSpanElement, AvatarProps> = (
  props,
  ref,
) => {
  const groupSize = React.useContext(SizeContext);

  const [scale, setScale] = React.useState(1);
  const [mounted, setMounted] = React.useState(false);
  const [isImgExist, setIsImgExist] = React.useState(true);

  const avatarNodeRef = React.useRef<HTMLSpanElement>(null);
  const avatarChildrenRef = React.useRef<HTMLSpanElement>(null);
  const avatarNodeMergeRef = composeRef<HTMLSpanElement>(ref, avatarNodeRef);

  const { getPrefixCls } = React.useContext(ConfigContext);

  const setScaleParam = () => {
    if (!avatarChildrenRef.current || !avatarNodeRef.current) {
      return;
    }
    const childrenWidth = avatarChildrenRef.current.offsetWidth; // offsetWidth avoid affecting be transform scale
    const nodeWidth = avatarNodeRef.current.offsetWidth;
    // denominator is 0 is no meaning
    if (childrenWidth !== 0 && nodeWidth !== 0) {
      const { gap = 4 } = props;
      if (gap * 2 < nodeWidth) {
        setScale(nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1);
      }
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setIsImgExist(true);
    setScale(1);
  }, [props.src]);

  React.useEffect(() => {
    setScaleParam();
  }, [props.gap]);

  const handleImgLoadError = () => {
    const { onError } = props;
    const errorFlag = onError ? onError() : undefined;
    if (errorFlag !== false) {
      setIsImgExist(false);
    }
  };

  const {
    prefixCls: customizePrefixCls,
    shape = 'circle',
    size: customSize = 'default',
    src,
    srcSet,
    icon,
    className,
    alt,
    draggable,
    children,
    crossOrigin,
    ...others
  } = props;

  const semanticCls = useSemanticCls(className, 'avatar');

  const size = customSize === 'default' ? groupSize : customSize;

  const hasImageElement = React.isValidElement(src);

  const prefixCls = getPrefixCls('avatar', customizePrefixCls);

  const sizeStyle: React.CSSProperties =
    typeof size === 'number'
      ? {
          width: size,
          height: size,
          lineHeight: `${size}px`,
          fontSize: icon ? size / 2 : 18,
        }
      : {};

  let childrenToRender: React.ReactNode;
  if (typeof src === 'string' && isImgExist) {
    childrenToRender = (
      <img
        src={src}
        draggable={draggable}
        srcSet={srcSet}
        onError={handleImgLoadError}
        alt={alt}
        crossOrigin={crossOrigin}
        className={clsx('h-full w-full object-cover', semanticCls.children)}
      />
    );
  } else if (hasImageElement) {
    childrenToRender = src;
  } else if (icon) {
    childrenToRender = (
      <span
        className={clsx('inline-flex h-full items-center justify-center', semanticCls.children)}
      >
        {icon}
      </span>
    );
  } else if (mounted || scale !== 1) {
    const transformString = `scale(${scale}) translateX(-50%)`;
    const childrenStyle: React.CSSProperties = {
      msTransform: transformString,
      WebkitTransform: transformString,
      transform: transformString,
    };

    const sizeChildrenStyle: React.CSSProperties =
      typeof size === 'number'
        ? {
            lineHeight: `${size}px`,
          }
        : {};

    childrenToRender = (
      <ResizeObserver onResize={setScaleParam}>
        <span
          className={clsx('absolute left-[50%] origin-[0_center]', semanticCls.children)}
          ref={avatarChildrenRef}
          style={{ ...sizeChildrenStyle, ...childrenStyle }}
        >
          {children}
        </span>
      </ResizeObserver>
    );
  } else {
    childrenToRender = (
      <span
        className={clsx('absolute left-[50%] origin-[0_center]', semanticCls.children)}
        style={{ opacity: 0 }}
        ref={avatarChildrenRef}
      >
        {children}
      </span>
    );
  }

  // The event is triggered twice from bubbling up the DOM tree.
  // see https://codesandbox.io/s/kind-snow-9lidz
  delete others.onError;
  delete others.gap;

  const avatarCls = clsx(
    prefixCls,
    'relative inline-block overflow-hidden whitespace-nowrap bg-fill text-center align-middle text-sm text-white [.group_&]:ring-2 [.group_&]:ring-container',
    typeof size === 'string' && {
      'h-12 w-12 leading-[3rem]': size === 'large',
      'h-10 w-10 leading-10': size === 'default',
      'h-8 w-8 leading-8': size === 'small',
    },
    typeof size === 'string' &&
      icon && {
        'text-2xl': size === 'large',
        'text-xl': size === 'default',
      },
    {
      'rounded-full': shape === 'circle',
      'rounded-md': shape === 'square',
    },
    (hasImageElement || (!!src && isImgExist)) && 'bg-transparent',
    semanticCls.root,
  );

  return (
    <span
      {...others}
      style={{ ...sizeStyle, ...others.style }}
      className={avatarCls}
      ref={avatarNodeMergeRef}
    >
      {childrenToRender}
    </span>
  );
};

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(InternalAvatar);

if (process.env.NODE_ENV !== 'production') {
  Avatar.displayName = 'Avatar';
}

export default Avatar;
