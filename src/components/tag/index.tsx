'use client';

import { XMarkOutline } from '@metisjs/icons';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import {
  PresetStatusColorType,
  getPresetStatusClassName,
  isPresetStatusColor,
} from '../_util/colors';
import useClosable, { pickClosable } from '../_util/hooks/useClosable';
import { LiteralUnion } from '../_util/type';
import { ConfigContext } from '../config-provider';
import CheckableTag from './CheckableTag';

export type { CheckableTagProps } from './CheckableTag';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefixCls?: string;
  className?: string;
  color?: LiteralUnion<PresetStatusColorType>;
  closable?: boolean;
  /** Advised to use closeIcon instead. */
  closeIcon?: boolean | React.ReactNode;
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
    ...restProps
  } = tagProps;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const [visible, setVisible] = React.useState(true);

  const domProps = omit(restProps, ['closeIcon', 'closable']);

  const isInternalColor = isPresetStatusColor(color);

  const tagStyle: React.CSSProperties = {
    backgroundColor: color && !isInternalColor ? color : undefined,
    ...style,
  };

  const prefixCls = getPrefixCls('tag', customizePrefixCls);

  const tagClassName = clsx(
    prefixCls,
    'relative me-2 inline-flex h-auto items-center whitespace-nowrap rounded bg-neutral-fill-quaternary px-2 py-1 text-xs shadow-sm outline outline-1 -outline-offset-1 outline-neutral-border transition-colors',
    {
      [getPresetStatusClassName(color as PresetStatusColorType)]: color && isInternalColor,
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
    'ms-0.5 cursor-pointer text-neutral-text-tertiary hover:text-neutral-text-secondary',
  );

  const [, mergedCloseIcon] = useClosable(pickClosable(tagProps), null, {
    closable: false,
    closeIconRender: (iconNode: React.ReactNode) =>
      iconNode === null ? (
        <XMarkOutline className={iconClassName} onClick={handleCloseClick} />
      ) : (
        <span className={clsx(iconClassName, 'flex items-center')} onClick={handleCloseClick}>
          {iconNode}
        </span>
      ),
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
    <span {...domProps} ref={ref} className={tagClassName} style={tagStyle}>
      {kids}
      {mergedCloseIcon}
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
