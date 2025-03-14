import React from 'react';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import type { Key, SelectionAlertRenderType, TableLocale } from '../interface';

export type TableAlertProps<T extends AnyObject> = {
  prefixCls: string;
  locale: TableLocale;
  selectedRowKeys: Key[];
  selectedRows: T[];
  alwaysShowAlert?: boolean;
  alertInfoRender?: SelectionAlertRenderType<T>;
  onClearSelected: () => void;
  alertOptionRender?: SelectionAlertRenderType<T>;
};

const defaultAlertInfoRender = (
  local: TableLocale,
  selectedRowKeys: Key[],
  onClearSelected: () => void,
) => {
  return (
    <div className="flex items-center gap-1">
      <span>{local.selection!.alertSelected}</span>
      <span>{selectedRowKeys.length}</span>
      <span>{local.selection!.alertSelectedItems}</span>
      <a className="ml-2" onClick={onClearSelected}>
        {local.selection!.alertSelectedClear}
      </a>
    </div>
  );
};

function TableAlert<T extends AnyObject>({
  prefixCls,
  locale,
  selectedRowKeys = [],
  onClearSelected,
  alwaysShowAlert,
  selectedRows,
  alertInfoRender,
  alertOptionRender,
}: TableAlertProps<T>) {
  const option = alertOptionRender?.({
    onClearSelected,
    selectedRowKeys,
    selectedRows,
  });

  const dom =
    alertInfoRender?.({
      selectedRowKeys,
      selectedRows,
      onClearSelected,
    }) ?? defaultAlertInfoRender(locale, selectedRowKeys, onClearSelected);

  if (dom === false || (selectedRowKeys.length < 1 && !alwaysShowAlert)) {
    return null;
  }

  const rootCls = clsx(
    `${prefixCls}-alert`,
    'mb-4 flex items-center gap-4 bg-fill-quinary px-4 py-3',
  );
  const infoCls = clsx(`${prefixCls}-alert-info`, 'flex-1 text-text-secondary');
  const optionCls = clsx(`${prefixCls}-alert-option`);

  return (
    <div className={rootCls}>
      <div className={infoCls}>{dom}</div>
      {!!option && <div className={optionCls}>{option}</div>}
    </div>
  );
}

export default TableAlert;
