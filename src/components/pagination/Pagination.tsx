import React, { useEffect } from 'react';
import {
  ChevronDoubleLeftOutline,
  ChevronDoubleRightOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
} from '@metisjs/icons';
import { isInteger } from 'lodash';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx } from '../_util/classNameUtils';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import Input from '../input';
import { useLocale } from '../locale';
import type { PaginationProps } from './interface';
import Options from './Options';
import type { PagerProps } from './Pager';
import Pager from './Pager';

const defaultItemRender: PaginationProps['itemRender'] = (_, __, element) => element;

const calculatePage = (p: number | undefined, pageSize: number, total: number) => {
  const _pageSize = typeof p === 'undefined' ? pageSize : p;
  return Math.floor((total - 1) / _pageSize) + 1;
};

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    current: customizeCurrent,
    defaultCurrent = 1,
    total = 0,
    pageSize: customizePageSize,
    defaultPageSize = 10,
    size: customizeSize,
    locale: customLocale,
    responsive,
    hideOnSinglePage,
    showQuickJumper,
    showLessItems,
    showTitle = true,
    style,
    disabled,
    simple,
    showTotal,
    showSizeChanger,
    pageSizeOptions,
    onChange,
    onShowSizeChange,
    itemRender = defaultItemRender,
  } = props;

  const { xs, md } = useBreakpoint(responsive);

  const { getPrefixCls, pagination = {} } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('pagination', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'pagination');

  const paginationRef = React.useRef<HTMLUListElement>(null);

  const [pageSize, setPageSize] = useMergedState<number>(10, {
    value: customizePageSize,
    defaultValue: defaultPageSize,
  });

  const [current, setCurrent] = useMergedState<number>(1, {
    value: customizeCurrent,
    defaultValue: defaultCurrent,
    postState: (c) => Math.max(1, Math.min(c, calculatePage(undefined, pageSize, total))),
  });

  const [internalInputVal, setInternalInputVal] = React.useState(current);

  useEffect(() => {
    setInternalInputVal(current);
  }, [current]);

  const mergedShowSizeChanger = showSizeChanger ?? pagination.showSizeChanger;

  const [contextLocale] = useLocale('Pagination');
  const locale = { ...contextLocale, ...customLocale };

  const mergedSize = useSize(customizeSize);
  let size = mergedSize;
  if (!customizeSize && responsive) {
    if (md) {
      size = 'small';
    } else if (xs) {
      size = 'mini';
    }
  }

  const hasOnChange = onChange !== undefined;
  const hasCurrent = 'current' in props;

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Pagination');
    warning(
      hasCurrent ? hasOnChange : true,
      'usage',
      'You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.',
    );
  }

  const jumpPrevPage = Math.max(1, current - (showLessItems ? 3 : 5));
  const jumpNextPage = Math.min(
    calculatePage(undefined, pageSize, total),
    current + (showLessItems ? 3 : 5),
  );

  const ellipsis = (
    <span
      className={clsx(
        `${prefixCls}-item-ellipsis`,
        'absolute text-text-quaternary transition-opacity',
        !disabled && 'group-hover/jump:opacity-0',
      )}
    >
      •••
    </span>
  );
  const prevIcon = <ChevronLeftOutline className="h-4 w-4" />;
  const nextIcon = <ChevronRightOutline className="h-4 w-4" />;
  const jumpPrevIcon = (
    <>
      <ChevronDoubleLeftOutline
        className={clsx(
          'h-4 w-4 text-primary opacity-0 transition-opacity',
          !disabled && 'group-hover/jump:opacity-100',
        )}
      />
      {ellipsis}
    </>
  );
  const jumpNextIcon = (
    <>
      <ChevronDoubleRightOutline
        className={clsx(
          'h-4 w-4 text-primary opacity-0 transition-opacity',
          !disabled && 'group-hover/jump:opacity-100',
        )}
      />
      {ellipsis}
    </>
  );

  const getValidValue = (e: any): number => {
    const inputValue = e.target.value;
    const allPages = calculatePage(undefined, pageSize, total);
    let value: number;
    if (inputValue === '') {
      value = inputValue;
    } else if (Number.isNaN(Number(inputValue))) {
      value = internalInputVal;
    } else if (inputValue >= allPages) {
      value = allPages;
    } else {
      value = Number(inputValue);
    }
    return value;
  };

  const isValid = (page: number) => {
    return isInteger(page) && page !== current && isInteger(total) && total > 0;
  };

  const shouldDisplayQuickJumper = total > pageSize ? showQuickJumper : false;

  const handleChange = (page?: number) => {
    if (page && isValid(page) && !disabled) {
      const currentPage = calculatePage(undefined, pageSize, total);
      let newPage = page;
      if (page > currentPage) {
        newPage = currentPage;
      } else if (page < 1) {
        newPage = 1;
      }

      if (newPage !== internalInputVal) {
        setInternalInputVal(newPage);
      }

      setCurrent(newPage);
      onChange?.(newPage, pageSize);

      return newPage;
    }

    return current;
  };

  /**
   * prevent "up arrow" key reseting cursor position within textbox
   * @see https://stackoverflow.com/a/1081114
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === KeyCode.UP || event.keyCode === KeyCode.DOWN) {
      event.preventDefault();
    }
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = getValidValue(event);
    if (value !== internalInputVal) {
      setInternalInputVal(value);
    }

    switch ((event as React.KeyboardEvent<HTMLInputElement>).keyCode) {
      case KeyCode.ENTER:
        handleChange(value);
        break;
      case KeyCode.UP:
        handleChange(value - 1);
        break;
      case KeyCode.DOWN:
        handleChange(value + 1);
        break;
      default:
        break;
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    handleChange(getValidValue(event));
  };

  const changePageSize = (size: number) => {
    const newCurrent = calculatePage(size, pageSize, total);
    const nextCurrent = current > newCurrent && newCurrent !== 0 ? newCurrent : current;

    setPageSize(size);
    setInternalInputVal(nextCurrent);
    onShowSizeChange?.(current, size);
    setCurrent(nextCurrent);
    onChange?.(nextCurrent, size);
  };

  const hasPrev = current > 1;
  const hasNext = current < calculatePage(undefined, pageSize, total);

  const prevHandle = () => {
    if (hasPrev) handleChange(current - 1);
  };

  const nextHandle = () => {
    if (hasNext) handleChange(current + 1);
  };

  const jumpPrevHandle = () => {
    handleChange(jumpPrevPage);
  };

  const jumpNextHandle = () => {
    handleChange(jumpNextPage);
  };

  const runIfEnter = (event: React.KeyboardEvent<HTMLLIElement>, callback: () => void) => {
    if (
      event.key === 'Enter' ||
      event.charCode === KeyCode.ENTER ||
      event.keyCode === KeyCode.ENTER
    ) {
      callback();
    }
  };

  const runIfEnterPrev = (event: React.KeyboardEvent<HTMLLIElement>) => {
    runIfEnter(event, prevHandle);
  };

  const runIfEnterNext = (event: React.KeyboardEvent<HTMLLIElement>) => {
    runIfEnter(event, nextHandle);
  };

  const runIfEnterJumpPrev = (event: React.KeyboardEvent<HTMLLIElement>) => {
    runIfEnter(event, jumpPrevHandle);
  };

  const runIfEnterJumpNext = (event: React.KeyboardEvent<HTMLLIElement>) => {
    runIfEnter(event, jumpNextHandle);
  };

  const renderPrev = (prevPage: number) => {
    const prevButton = itemRender(prevPage, 'prev', prevIcon);
    return React.isValidElement<HTMLButtonElement>(prevButton)
      ? React.cloneElement(prevButton, { disabled: !hasPrev })
      : prevButton;
  };

  const renderNext = (nextPage: number) => {
    const nextButton = itemRender(nextPage, 'next', nextIcon);
    return React.isValidElement<HTMLButtonElement>(nextButton)
      ? React.cloneElement(nextButton, { disabled: !hasNext })
      : nextButton;
  };

  let jumpPrev: React.ReactElement | null = null;

  const dataOrAriaAttributeProps = pickAttrs(props, {
    aria: true,
    data: true,
  });

  const totalText = showTotal && (
    <li className={clsx(`${prefixCls}-total-text`, 'me-1', semanticCls.total)}>
      {showTotal(total, [
        total === 0 ? 0 : (current - 1) * pageSize + 1,
        current * pageSize > total ? total : current * pageSize,
      ])}
    </li>
  );

  let jumpNext: React.ReactElement | null = null;

  const allPages = calculatePage(undefined, pageSize, total);

  // ================== Render ==================
  // When hideOnSinglePage is true and there is only 1 page, hide the pager
  if (hideOnSinglePage && total <= pageSize) {
    return null;
  }

  const pagerList: React.ReactElement<PagerProps>[] = [];

  const pagerProps: PagerProps = {
    rootPrefixCls: prefixCls,
    onClick: handleChange,
    onKeyPress: runIfEnter,
    showTitle,
    itemRender,
    page: -1,
    size,
    disabled,
    className: semanticCls.item,
  };

  const prevPage = current - 1 > 0 ? current - 1 : 0;
  const nextPage = current + 1 < allPages ? current + 1 : allPages;

  // ================== Simple ==================
  const isReadOnly = typeof simple === 'object' ? simple.readOnly : !simple;
  let simplePager: React.ReactNode = null;

  if (simple) {
    simplePager = (
      <li
        title={showTitle ? `${current}/${allPages}` : undefined}
        className={clsx(`${prefixCls}-simple-pager`, 'mx-1 inline-flex items-center gap-2', {
          'text-text-quaternary': disabled,
        })}
      >
        {isReadOnly ? (
          internalInputVal
        ) : (
          <Input
            value={internalInputVal}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onChange={(_, e) => handleKeyUp(e)}
            onBlur={handleBlur}
            size={size === 'default' ? 'middle' : size}
            className={clsx('w-12')}
          />
        )}
        <span className={`${prefixCls}-slash`}>/</span>
        {allPages}
      </li>
    );
  }

  // ====================== Normal ======================
  const pageBufferSize = showLessItems ? 1 : 2;
  if (allPages <= 3 + pageBufferSize * 2) {
    if (!allPages) {
      pagerList.push(
        <Pager {...pagerProps} key="noPager" page={1} className={`${prefixCls}-item-disabled`} />,
      );
    }

    for (let i = 1; i <= allPages; i += 1) {
      pagerList.push(<Pager {...pagerProps} key={i} page={i} active={current === i} />);
    }
  } else {
    const prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
    const nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;

    const jumpPrevContent = itemRender(jumpPrevPage, 'jump-prev', jumpPrevIcon);
    const jumpNextContent = itemRender(jumpNextPage, 'jump-next', jumpNextIcon);

    jumpPrev = jumpPrevContent ? (
      <li
        title={showTitle ? prevItemTitle : undefined}
        key="prev"
        onClick={jumpPrevHandle}
        tabIndex={0}
        onKeyDown={runIfEnterJumpPrev}
        className={clsx(
          `${prefixCls}-jump-prev`,
          'group/jump flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md',
          { 'h-8 min-w-8': size === 'small', 'h-7 min-w-7 rounded': size === 'mini' },
          {
            'cursor-not-allowed': disabled,
          },
        )}
      >
        {jumpPrevContent}
      </li>
    ) : null;

    jumpNext = jumpNextContent ? (
      <li
        title={showTitle ? nextItemTitle : undefined}
        key="next"
        onClick={jumpNextHandle}
        tabIndex={0}
        onKeyDown={runIfEnterJumpNext}
        className={clsx(
          `${prefixCls}-jump-next`,
          'group/jump flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md',
          { 'h-8 min-w-8': size === 'small', 'h-7 min-w-7 rounded': size === 'mini' },
          {
            'cursor-not-allowed': disabled,
          },
        )}
      >
        {jumpNextContent}
      </li>
    ) : null;

    let left = Math.max(1, current - pageBufferSize);
    let right = Math.min(current + pageBufferSize, allPages);

    if (current - 1 <= pageBufferSize) {
      right = 1 + pageBufferSize * 2;
    }
    if (allPages - current <= pageBufferSize) {
      left = allPages - pageBufferSize * 2;
    }

    for (let i = left; i <= right; i += 1) {
      pagerList.push(<Pager {...pagerProps} key={i} page={i} active={current === i} />);
    }

    if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
      pagerList[0] = React.cloneElement<PagerProps>(pagerList[0], {
        className: clsx(`${prefixCls}-item-after-jump-prev`, pagerList[0].props.className),
      });

      if (jumpPrev) {
        pagerList.unshift(jumpPrev);
      }
    }

    if (allPages - current >= pageBufferSize * 2 && current !== allPages - 2) {
      const lastOne = pagerList[pagerList.length - 1];
      pagerList[pagerList.length - 1] = React.cloneElement(lastOne, {
        className: clsx(`${prefixCls}-item-before-jump-next`, lastOne.props.className),
      });

      if (jumpNext) {
        pagerList.push(jumpNext);
      }
    }

    if (left !== 1) {
      pagerList.unshift(<Pager {...pagerProps} key={1} page={1} />);
    }
    if (right !== allPages) {
      pagerList.push(<Pager {...pagerProps} key={allPages} page={allPages} />);
    }
  }

  let prev = renderPrev(prevPage);
  if (prev) {
    const prevDisabled = !hasPrev || !allPages;
    prev = (
      <li
        title={showTitle ? locale.prev_page : undefined}
        onClick={prevHandle}
        tabIndex={prevDisabled ? undefined : 0}
        onKeyDown={runIfEnterPrev}
        className={clsx(
          `${prefixCls}-prev`,
          {
            [`${prefixCls}-disabled`]: prevDisabled,
          },
          'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md',
          {
            'cursor-not-allowed text-text-quaternary': prevDisabled || disabled,
            'hover:bg-fill-tertiary': !prevDisabled && !disabled,
          },
          { 'h-8 min-w-8': size === 'small', 'h-7 min-w-7 rounded': size === 'mini' },
          semanticCls.prev,
        )}
        aria-disabled={prevDisabled}
      >
        {prev}
      </li>
    );
  }

  let next = renderNext(nextPage);
  if (next) {
    let nextDisabled: boolean, nextTabIndex: number | undefined;

    if (simple) {
      nextDisabled = !hasNext;
      nextTabIndex = hasPrev ? 0 : undefined;
    } else {
      nextDisabled = !hasNext || !allPages;
      nextTabIndex = nextDisabled ? undefined : 0;
    }

    next = (
      <li
        title={showTitle ? locale.next_page : undefined}
        onClick={nextHandle}
        tabIndex={nextTabIndex}
        onKeyDown={runIfEnterNext}
        className={clsx(
          `${prefixCls}-next`,
          {
            [`${prefixCls}-disabled`]: nextDisabled,
          },
          'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md',
          {
            'cursor-not-allowed text-text-quaternary': nextDisabled || disabled,
            'hover:bg-fill-tertiary': !nextDisabled && !disabled,
          },
          { 'h-8 min-w-8': size === 'small', 'h-7 min-w-7 rounded': size === 'mini' },
          semanticCls.next,
        )}
        aria-disabled={nextDisabled}
      >
        {next}
      </li>
    );
  }

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-${size}`]: size !== 'default',
      [`${prefixCls}-simple`]: simple,
      [`${prefixCls}-disabled`]: disabled,
    },
    'inline-flex items-center gap-1 text-sm text-text',
    semanticCls.root,
  );

  return (
    <ul className={rootCls} style={style} ref={paginationRef} {...dataOrAriaAttributeProps}>
      {totalText}
      {prev}
      {simple ? simplePager : pagerList}
      {next}
      <Options
        locale={locale}
        rootPrefixCls={prefixCls}
        disabled={disabled}
        size={size}
        changeSize={mergedShowSizeChanger ? changePageSize : undefined}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        quickGo={shouldDisplayQuickJumper ? handleChange : undefined}
      />
    </ul>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Pagination.displayName = 'Pagination';
}

export default Pagination;
