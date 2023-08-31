import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { MenuContext } from './context/MenuContext';
import { useMeasure } from './context/PathContext';
import type { MenuDividerType } from './interface';

export type MenuDividerProps = Omit<MenuDividerType, 'type'>;

export default function MenuDivider({ className, style, dashed }: MenuDividerProps) {
  const { prefixCls, theme } = React.useContext(MenuContext);
  const measure = useMeasure();

  if (measure) {
    return null;
  }

  return (
    <li
      role="separator"
      className={clsx(
        `${prefixCls}-item-divider`,
        'my-1 overflow-hidden border-t border-neutral-border-secondary leading-[0]',
        {
          [`${prefixCls}-item-divider-dashed border-dashed`]: !!dashed,
          'border-gray-500': theme === 'dark',
        },
        className,
      )}
      style={style}
    />
  );
}
