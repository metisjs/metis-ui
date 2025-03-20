import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import { ArrowPathOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import Tooltip from '../../tooltip';
import type {
  ColumnTitleProps,
  InternalColumnsType,
  OptionConfig,
  TableActionType,
  TableLocale,
} from '../interface';
import ColumnSetting from './ColumnSetting';
import FullscreenButton from './FullscreenButton';

export type ToolBarProps<T extends AnyObject = AnyObject> = {
  prefixCls: string;
  headerTitle?: React.ReactNode;
  actions?: ReactNode[];
  tableAction: TableActionType;
  options?: OptionConfig | boolean;
  optionsRender?: (defaultDom: React.ReactNode[]) => React.ReactNode[];
  onSearch?: (keyWords: string) => void;
  columns: InternalColumnsType<T>;
  tableLocale: TableLocale;
  columnTitleProps: ColumnTitleProps<T>;
};

function renderDefaultOption<T extends AnyObject = AnyObject>(
  prefixCls: string,
  tableLocale: TableLocale,
  options: OptionConfig,
  tableAction: TableActionType,
  columns: InternalColumnsType<T>,
  columnTitleProps: ColumnTitleProps<T>,
) {
  return Object.keys(options)
    .filter((item) => item)
    .map((key: keyof OptionConfig) => {
      const value = options[key];
      if (!value) {
        return null;
      }

      let onClick =
        typeof value === 'function'
          ? (event: any) => {
              value?.(event, tableAction);
            }
          : () => {};

      if (key === 'setting') {
        return (
          <ColumnSetting
            prefixCls={`${prefixCls}-column-setting`}
            tableLocale={tableLocale}
            columns={columns}
            key={key}
            columnTitleProps={columnTitleProps}
          />
        );
      }
      if (key === 'fullScreen') {
        return <FullscreenButton key={key} onClick={onClick} />;
      }

      if (key === 'reload') {
        return (
          <Tooltip key={key} title={tableLocale.toolbar?.reload}>
            <div onClick={onClick}>
              <ArrowPathOutline />
            </div>
          </Tooltip>
        );
      }
      return null;
    })
    .filter((item) => item);
}

function ToolBar<T extends AnyObject = AnyObject>({
  prefixCls,
  tableLocale,
  headerTitle,
  tableAction,
  actions,
  options: propsOptions,
  columns,
  optionsRender,
  columnTitleProps,
}: ToolBarProps<T>) {
  const optionDom = useMemo(() => {
    if (!propsOptions) {
      return [];
    }

    const options: OptionConfig = {
      search: false,
      reload: () => tableAction.reload(),
      fullScreen: () => tableAction.fullScreen(),
      setting: true,
    };

    if (typeof propsOptions === 'object') {
      Object.entries(propsOptions).forEach(([key, value]: [keyof OptionConfig, any]) => {
        if (value !== true || typeof options[key] !== 'function') {
          options[key] = value;
        }
      });
    }

    const settings = renderDefaultOption<T>(
      prefixCls,
      tableLocale,
      options,
      tableAction,
      columns,
      columnTitleProps,
    );
    if (optionsRender) {
      return optionsRender(settings);
    }
    return settings;
  }, [tableAction, columns, headerTitle, optionsRender, propsOptions]);

  return (
    <div
      className={clsx(
        `${prefixCls}-toolbar`,
        'mb-4 flex items-center justify-end gap-3 xs:flex-col xs:items-start',
      )}
    >
      <div className={clsx(`${prefixCls}-toolbar-title`, 'text-base font-semibold')}>
        {headerTitle}
      </div>
      <div
        className={clsx(
          `${prefixCls}-toolbar-actions`,
          'flex flex-1 items-center justify-end gap-3',
        )}
      >
        {actions}
      </div>
      <div
        className={clsx(
          `${prefixCls}-toolbar-options`,
          'flex items-center justify-end gap-2 *:inline-flex *:cursor-pointer *:items-center *:text-xl hover:*:text-primary',
        )}
      >
        {optionDom}
      </div>
    </div>
  );
}

export default ToolBar;
