import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import { MenuContext } from '../context/MenuContext';

export interface SubMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

const InternalSubMenuList = (
  { className, children, ...restProps }: SubMenuListProps,
  ref: React.Ref<HTMLUListElement>,
) => {
  const { prefixCls, mode, theme } = React.useContext(MenuContext);

  return (
    <ul
      className={clsx(
        prefixCls,
        `${prefixCls}-sub`,
        `${prefixCls}-${mode === 'inline' ? 'inline' : 'vertical'}`,
        'flex flex-col gap-1 rounded-md bg-neutral-bg-container p-1 text-sm shadow-lg ring-1 ring-neutral-border-secondary focus:outline-none',
        '[.submenu-popup_&]:max-h-[calc(100vh-6.25rem)] [.submenu-popup_&]:min-w-[10rem]',
        theme === 'dark' && 'bg-gray-800 text-white',
        className,
      )}
      role="menu"
      {...restProps}
      data-menu-list
      ref={ref}
    >
      {children}
    </ul>
  );
};

const SubMenuList = React.forwardRef(InternalSubMenuList);
SubMenuList.displayName = 'SubMenuList';

export default SubMenuList;
