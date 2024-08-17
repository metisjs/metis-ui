'use client';

import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { PresetColorType, PresetStatusColorType } from '../_util/colors';
import {
  getPresetColorCls,
  getPresetStatusCls,
  isPresetColor,
  isPresetStatusColor,
} from '../_util/colors';
import type { ClosableType } from '../_util/hooks/useClosable';
import useClosable from '../_util/hooks/useClosable';
import type { LiteralUnion } from '../_util/type';
import { ConfigContext } from '../config-provider';
import CheckableTag from './CheckableTag';

export type { CheckableTagProps } from './CheckableTag';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefixCls?: string;
  className?: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>;
  closable?: ClosableType;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
  icon?: React.ReactElement;
  bordered?: boolean;
}

export interface TagType
  extends React.ForwardRefExoticComponent<TagProps & React.RefAttributes<HTMLElement>> {
  CheckableTag: typeof CheckableTag;
}

const InternalTag: React.ForwardRefRenderFunction<HTMLSpanElement, TagProps> = (tagProps, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    children,
    icon,
    color,
    onClose,
    bordered = true,
    closable,
    ...restProps
  } = tagProps;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const [visible, setVisible] = React.useState(true);

  const isPreset = isPresetColor(color);
  const isStatus = isPresetStatusColor(color);
  const isInternalColor = isPreset || isStatus;

  const tagStyle: React.CSSProperties = {
    backgroundColor: color && !isInternalColor ? color : undefined,
    ...style,
  };

  const prefixCls = getPrefixCls('tag', customizePrefixCls);

  const tagClassName = clsx(
    prefixCls,
    'relative me-2 inline-flex h-auto items-center whitespace-nowrap rounded-md bg-fill-quaternary px-2 py-1 text-xs font-medium text-text-secondary outline outline-1 -outline-offset-1 outline-border-secondary transition-colors',
    {
      [getPresetColorCls(color as PresetColorType)]: color && isPreset,
      [getPresetStatusCls(color as PresetStatusColorType)]: color && isStatus,
      [`${prefixCls}-has-color text-white outline-0`]: color && !isInternalColor,
      [`${prefixCls}-hidden hidden`]: !visible,
      [`${prefixCls}-borderless outline-0`]: !bordered,
    },
    className,
  );

  const handleCloseClick = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    onClose?.(e);

    if (e.defaultPrevented) {
      return;
    }
    setVisible(false);
  };

  const iconClassName = clsx(
    `${prefixCls}-close-icon`,
    'ms-0.5 cursor-pointer text-text-tertiary hover:text-text-secondary',
    color &&
      isInternalColor && {
        'text-success hover:text-success-active': color === 'success',
        'text-warning hover:text-warning-active': color === 'warning',
        'text-error hover:text-error-active': color === 'error',
        'text-primary-hover hover:text-primary': color === 'processing',
      },
    color && !isInternalColor && 'text-white/65 hover:text-white',
  );

  const [, closeIcon] = useClosable(closable, {
    className: iconClassName,
    onClick: handleCloseClick,
  });

  const iconNode: React.ReactNode = icon ? (
    <span className="mr-1 inline-flex items-center text-sm">{icon}</span>
  ) : null;

  const kids: React.ReactNode = iconNode ? (
    <>
      {iconNode}
      {children && <span>{children}</span>}
    </>
  ) : (
    children
  );

  const tagNode: React.ReactNode = (
    <span {...restProps} ref={ref} className={tagClassName} style={tagStyle}>
      {kids}
      {closeIcon}
    </span>
  );

  return tagNode;
};

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(InternalTag) as TagType;

if (process.env.NODE_ENV !== 'production') {
  Tag.displayName = 'Tag';
}

Tag.CheckableTag = CheckableTag;

export default Tag;
