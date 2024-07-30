import React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { PaginationProps } from './interface';

export interface PagerProps extends Pick<PaginationProps, 'itemRender'> {
  rootPrefixCls: string;
  page: number;
  active?: boolean;
  className?: string;
  showTitle: boolean;
  isSmall?: boolean;
  disabled?: boolean;
  onClick?: (page: number) => void;
  onKeyPress?: (
    e: React.KeyboardEvent<HTMLLIElement>,
    onClick: PagerProps['onClick'],
    page: PagerProps['page'],
  ) => void;
}

const Pager: React.FC<PagerProps> = (props) => {
  const {
    rootPrefixCls,
    page,
    active,
    className,
    showTitle,
    isSmall,
    disabled,
    onClick,
    onKeyPress,
    itemRender,
  } = props;
  const prefixCls = `${rootPrefixCls}-item`;

  const cls = clsx(
    prefixCls,
    `${prefixCls}-${page}`,
    {
      [`${prefixCls}-active`]: active,
    },
    'min-w-9 cursor-pointer rounded-md px-2 text-center leading-9',
    {
      'bg-primary-bg font-medium text-primary shadow-sm': active,
      'hover:bg-fill-tertiary': !active,
      'min-w-8 leading-8': isSmall,
    },
    disabled && {
      'cursor-not-allowed opacity-50': active,
      'cursor-not-allowed text-text-quaternary hover:bg-transparent': !active,
    },
    className,
  );

  const handleClick = () => {
    onClick?.(page);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLLIElement>) => {
    onKeyPress?.(e, onClick, page);
  };

  const pager = itemRender?.(page, 'page', page);

  return pager ? (
    <li
      title={showTitle ? String(page) : undefined}
      className={cls}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {pager}
    </li>
  ) : null;
};

if (process.env.NODE_ENV !== 'production') {
  Pager.displayName = 'Pager';
}

export default Pager;
