import {
  ChevronDoubleLeftOutline,
  ChevronDoubleRightOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
} from '@metisjs/icons';
import classNames from 'classnames';
import type { PaginationLocale, PaginationProps as RcPaginationProps } from 'rc-pagination';
import RcPagination from 'rc-pagination';
import enUS from 'rc-pagination/lib/locale/en_US';
import * as React from 'react';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import { useLocale } from '../locale';
import { MiddleSelect, MiniSelect } from './Select';

export interface PaginationProps extends RcPaginationProps {
  showQuickJumper?: boolean | { goButton?: React.ReactNode };
  size?: 'default' | 'small';
  responsive?: boolean;
  role?: string;
  totalBoundaryShowSizeChanger?: number;
  className?: string;
}

export type PaginationPosition = 'top' | 'bottom' | 'both';

export type PaginationAlign = 'start' | 'center' | 'end';

export interface PaginationConfig extends PaginationProps {
  position?: PaginationPosition;
  align?: PaginationAlign;
}

export type { PaginationLocale };

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    selectPrefixCls: customizeSelectPrefixCls,
    className,
    size: customizeSize,
    locale: customLocale,
    selectComponentClass,
    responsive,
    showSizeChanger,
    ...restProps
  } = props;
  const { sm } = useBreakpoint(responsive);

  const { getPrefixCls, pagination = {} } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('pagination', customizePrefixCls);

  const mergedShowSizeChanger = showSizeChanger ?? pagination.showSizeChanger;

  const iconsProps = React.useMemo<Record<PropertyKey, React.ReactNode>>(() => {
    const ellipsis = <span className={`${prefixCls}-item-ellipsis`}>•••</span>;
    const prevIcon = (
      <button className={`${prefixCls}-item-link`} type="button" tabIndex={-1}>
        <ChevronLeftOutline />
      </button>
    );
    const nextIcon = (
      <button className={`${prefixCls}-item-link`} type="button" tabIndex={-1}>
        <ChevronRightOutline />
      </button>
    );
    const jumpPrevIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>
          <ChevronDoubleLeftOutline className={`${prefixCls}-item-link-icon`} />
          {ellipsis}
        </div>
      </a>
    );
    const jumpNextIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>
          <ChevronDoubleRightOutline />
          {ellipsis}
        </div>
      </a>
    );
    return { prevIcon, nextIcon, jumpPrevIcon, jumpNextIcon };
  }, [prefixCls]);

  const [contextLocale] = useLocale('Pagination', enUS);

  const locale = { ...contextLocale, ...customLocale };

  const mergedSize = useSize(customizeSize);

  const isSmall = mergedSize === 'small' || !!(sm && !mergedSize && responsive);

  const selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);

  const extendedClassName = classNames(
    {
      [`${prefixCls}-mini`]: isSmall,
    },
    className,
  );

  return (
    <>
      <RcPagination
        {...iconsProps}
        {...restProps}
        prefixCls={prefixCls}
        selectPrefixCls={selectPrefixCls}
        className={extendedClassName}
        selectComponentClass={selectComponentClass || (isSmall ? MiniSelect : MiddleSelect)}
        locale={locale}
        showSizeChanger={mergedShowSizeChanger}
      />
    </>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Pagination.displayName = 'Pagination';
}

export default Pagination;
