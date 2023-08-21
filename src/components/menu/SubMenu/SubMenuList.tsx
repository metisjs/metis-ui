import classNames from 'classnames';
import * as React from 'react';
import { MenuContext } from '../context/MenuContext';

export interface SubMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

const InternalSubMenuList = (
  { className, children, ...restProps }: SubMenuListProps,
  ref: React.Ref<HTMLUListElement>,
) => {
  const { prefixCls, mode } = React.useContext(MenuContext);

  return (
    <ul
      className={classNames(
        prefixCls,
        `${prefixCls}-sub`,
        `${prefixCls}-${mode === 'inline' ? 'inline' : 'vertical'}`,
        'rounded-md bg-neutral-bg-container text-sm shadow-lg ring-1 ring-neutral-border-secondary focus:outline-none',
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
