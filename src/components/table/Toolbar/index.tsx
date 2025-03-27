import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import { ArrowPathOutline, MagnifyingGlassOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject, RequiredWith } from '@util/type';
import Input from '../../input';
import Tooltip from '../../tooltip';
import type {
  ColumnTitleProps,
  InternalColumnsType,
  Key,
  OptionConfig,
  TableActionType,
  TableLocale,
  ToolbarSearchProps,
  ToolbarSemanticClsType,
} from '../interface';
import ColumnSetting from './ColumnSetting';
import FullscreenButton from './FullscreenButton';

export type ToolBarProps<T extends AnyObject = AnyObject> = {
  prefixCls: string;
  className?: ToolbarSemanticClsType;
  headerTitle?: React.ReactNode;
  actions?: ReactNode[];
  tableAction: TableActionType;
  options?: OptionConfig | boolean;
  optionsRender?: (defaultDom: React.ReactNode[]) => React.ReactNode[];
  search?: ToolbarSearchProps | boolean;
  searchValues?: Record<Key, any>;
  onSearch?: (params: Record<Key, any>) => void;
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
  className,
  tableLocale,
  headerTitle,
  tableAction,
  actions,
  options: propsOptions,
  columns,
  optionsRender,
  columnTitleProps,
  search,
  searchValues: searchValue,
  onSearch,
}: ToolBarProps<T>) {
  const semanticCls = useSemanticCls(className);

  const options = useMemo(() => {
    if (!propsOptions) {
      return false;
    }

    const options: OptionConfig = {
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
    return options;
  }, [propsOptions]);

  const searchConfig = useMemo(() => {
    const defaultSearchConfig: RequiredWith<ToolbarSearchProps, 'name'> = {
      name: 'keyword',
    };

    if (typeof search === 'boolean') return defaultSearchConfig;

    return {
      ...defaultSearchConfig,
      ...search,
    };
  }, [search]);

  const optionDom = useMemo(() => {
    if (!options) {
      return [];
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
  }, [tableAction, columns, headerTitle, optionsRender, options]);

  const onSearchChange = (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.({ ...searchValue, [searchConfig.name]: value });
    searchConfig.onChange?.(value, e);
  };

  return (
    <div
      className={clsx(
        `${prefixCls}-toolbar`,
        'mb-4 flex items-center justify-end gap-3 xs:flex-col xs:items-start',
        semanticCls.root,
      )}
    >
      <div
        className={clsx(
          `${prefixCls}-toolbar-title`,
          'mr-auto text-base font-semibold',
          semanticCls.title,
        )}
      >
        {headerTitle}
      </div>
      {search && (
        <div className={clsx(`${prefixCls}-toolbar-search`, semanticCls.search)}>
          <Input
            suffix={<MagnifyingGlassOutline />}
            {...searchConfig}
            value={searchValue?.[searchConfig.name]}
            onChange={onSearchChange}
          />
        </div>
      )}
      <div
        className={clsx(
          `${prefixCls}-toolbar-actions`,
          'flex items-center justify-end gap-3',
          semanticCls.actions,
        )}
      >
        {actions}
      </div>
      <div
        className={clsx(
          `${prefixCls}-toolbar-options`,
          'flex items-center justify-end gap-2 *:inline-flex *:cursor-pointer *:items-center *:text-xl hover:*:text-primary',
          semanticCls.options,
        )}
      >
        {optionDom}
      </div>
    </div>
  );
}

export default ToolBar;
