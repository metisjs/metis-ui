import type React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { InputProps } from '../input';
import type { SelectProps } from '../select';

export interface PaginationLocale {
  // Options
  items_per_page?: string;
  jump_to?: string;
  page?: string;

  // Pagination
  prev_page?: string;
  next_page?: string;
  prev_5?: string;
  next_5?: string;
  prev_3?: string;
  next_3?: string;
  page_size?: string;
}

export type PaginationPosition = 'top' | 'bottom' | 'both';

export type PaginationAlign = 'start' | 'center' | 'end';

export interface PaginationConfig extends PaginationProps {
  position?: PaginationPosition;
  align?: PaginationAlign;
}

export interface PaginationProps extends React.AriaAttributes {
  className?: SemanticClassName<{
    options?: string;
    item?: string;
    prev?: string;
    next?: string;
    total?: string;
    jumper?: InputProps['className'];
    sizeChanger?: SelectProps['className'];
  }>;
  prefixCls?: string;
  pageSizeOptions?: string[] | number[];

  current?: number;
  defaultCurrent?: number;
  total?: number;
  pageSize?: number;
  defaultPageSize?: number;

  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  showLessItems?: boolean;
  showQuickJumper?: boolean;
  showTitle?: boolean;
  simple?: boolean | { readOnly?: boolean };
  disabled?: boolean;
  size?: 'default' | 'small' | 'mini';
  responsive?: boolean;

  locale?: PaginationLocale;

  style?: React.CSSProperties;

  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode,
  ) => React.ReactNode;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;

  role?: string;
}

export interface PaginationState {
  current: number;
  currentInputValue: number;
  pageSize: number;
}
