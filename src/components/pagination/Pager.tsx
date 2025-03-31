import React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { PaginationProps } from './interface';

export interface PagerProps extends Pick<PaginationProps, 'itemRender' | 'size'> {
  rootPrefixCls: string;
  page: number;
  active?: boolean;
  className?: SemanticClassName<{ root: string }, { active?: boolean; disabled?: boolean }>;
  showTitle: boolean;
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
    size,
    disabled,
    onClick,
    onKeyPress,
    itemRender,
  } = props;
  const prefixCls = `${rootPrefixCls}-item`;

  const semanticCls = useSemanticCls(className, { active, disabled });

  const cls = clsx(
    prefixCls,
    `${prefixCls}-${page}`,
    {
      [`${prefixCls}-active`]: active,
    },
    'min-w-9 cursor-pointer rounded-md text-center leading-9',
    {
      'bg-primary-bg text-primary font-medium shadow-xs': active,
      'hover:bg-fill-tertiary': !active,
    },
    {
      'min-w-8 leading-8': size === 'small',
      'min-w-7 rounded-sm leading-7': size === 'mini',
    },
    disabled && {
      'cursor-not-allowed opacity-50': active,
      'text-text-quaternary cursor-not-allowed hover:bg-transparent': !active,
    },
    semanticCls.root,
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
