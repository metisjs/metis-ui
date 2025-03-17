import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import { ArrowPathOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import Tooltip from '../../tooltip';
import type { ColumnsType, OptionConfig, TableActionType, TableLocale } from '../interface';
import FullscreenButton from './FullscreenButton';

export type ToolBarProps<T extends AnyObject = AnyObject> = {
  prefixCls: string;
  headerTitle?: React.ReactNode;
  actions?: ReactNode[];
  tableAction: TableActionType;
  options?: OptionConfig | boolean;
  optionsRender?: (defaultDom: React.ReactNode[]) => React.ReactNode[];
  onSearch?: (keyWords: string) => void;
  columns: ColumnsType<T>;
  tableLocale: TableLocale;
};

function renderDefaultOption<T extends AnyObject = AnyObject>(
  tableLocale: TableLocale,
  options: OptionConfig,
  tableAction: TableActionType,
  columns: ColumnsType<T>,
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
        return null;
        // return (
        //   <ColumnSetting {...(options[key] as SettingOptionType)} columns={columns} key={key} />
        // );
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
}: ToolBarProps<T>) {
  const optionDom = useMemo(() => {
    if (!propsOptions) {
      return [];
    }

    const options: OptionConfig = {
      reload: () => tableAction.reload(),
      setting: true,
      search: false,
      fullScreen: () => tableAction.fullScreen(),
    };

    if (typeof propsOptions === 'object') {
      Object.entries(propsOptions).forEach(([key, value]: [keyof OptionConfig, any]) => {
        if (value !== true || typeof options[key] !== 'function') {
          options[key] = value;
        }
      });
    }

    const settings = renderDefaultOption<T>(tableLocale, options, tableAction, columns);
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
          'flex items-center justify-end gap-2 *:inline-flex *:cursor-pointer *:items-center *:text-xl *:hover:text-primary',
        )}
      >
        {optionDom}
      </div>
    </div>
  );
}

export default ToolBar;
