import * as React from 'react';
import { clsx } from '@util/classNameUtils';
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
        // >>> Vertical
        mode !== 'inline' &&
          'bg-elevated ring-border-secondary flex max-h-[calc(100vh-6.25rem)] min-w-[10rem] flex-col gap-1 rounded-md py-1 text-sm shadow-lg ring-1 focus:outline-hidden',
        // >>> Inline
        mode === 'inline' && 'mt-1 flex flex-col gap-1 font-normal',
        theme === 'dark' && 'bg-gray-800 text-white ring-gray-800',
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
