import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { MenuContext } from './context/MenuContext';
import { useFullPath, useMeasure } from './context/PathContext';
import type { MenuItemGroupType } from './interface';
import { parseChildren } from './utils/commonUtil';

export interface MenuItemGroupProps extends Omit<MenuItemGroupType, 'type' | 'children' | 'label'> {
  title?: React.ReactNode;

  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;
}

const InternalMenuItemGroup = ({
  className,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  eventKey,
  children,
  ...restProps
}: MenuItemGroupProps) => {
  const { prefixCls, theme } = React.useContext(MenuContext);

  const groupPrefixCls = `${prefixCls}-item-group`;

  return (
    <li
      role="presentation"
      {...restProps}
      onClick={(e) => e.stopPropagation()}
      className={clsx(groupPrefixCls, 'item-group', className)}
    >
      <div
        role="presentation"
        className={clsx(`${groupPrefixCls}-title`, {
          'px-3 py-1 text-neutral-text-tertiary': theme === 'light',
          'px-3 py-1 text-white/[0.65]': theme === 'dark',
        })}
        title={typeof title === 'string' ? title : undefined}
      >
        {title}
      </div>
      <ul role="group" className={clsx(`${groupPrefixCls}-list`, 'flex flex-col gap-1')}>
        {children}
      </ul>
    </li>
  );
};

export default function MenuItemGroup({
  children,
  ...props
}: MenuItemGroupProps): React.ReactElement {
  const connectedKeyPath = useFullPath(props.eventKey);
  const childList: React.ReactElement[] = parseChildren(children, connectedKeyPath);

  const measure = useMeasure();
  if (measure) {
    return childList as any as React.ReactElement;
  }

  return <InternalMenuItemGroup {...omit(props, ['warnKey'])}>{childList}</InternalMenuItemGroup>;
}
