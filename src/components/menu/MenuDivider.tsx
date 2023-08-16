import classNames from 'classnames';
import * as React from 'react';
import { MenuContext } from './context/MenuContext';
import { useMeasure } from './context/PathContext';
import type { MenuDividerType } from './interface';

export type MenuDividerProps = Omit<MenuDividerType, 'type'>;

export default function MenuDivider({ className, style }: MenuDividerProps) {
  const { prefixCls } = React.useContext(MenuContext);
  const measure = useMeasure();

  if (measure) {
    return null;
  }

  return (
    <li
      role="separator"
      className={classNames(`${prefixCls}-item-divider`, className)}
      style={style}
    />
  );
}
