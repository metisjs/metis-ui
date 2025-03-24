import React, { useEffect, useMemo } from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useBreakpoint from '@util/hooks/useBreakpoint';
import { matchScreen } from '@util/responsiveObserver';
import toArray from '@util/toArray';
import type { AnyObject } from '@util/type';
import { get, useMergedState } from 'rc-util';
import isEqual from 'rc-util/lib/isEqual';
import Button from '../../button';
import type { SizeType } from '../../config-provider/SizeContext';
import Form from '../../form';
import type { FieldValueObject, FieldValueType } from '../../form/interface';
import Space from '../../space';
import type {
  ColumnSearchType,
  InternalColumnType,
  Key,
  TableLocale,
  TableSearchConfig,
} from '../interface';
import { EXCLUDE_TYPES } from '../utils/filterUtil';

export interface SearchFormProps<RecordType extends AnyObject> extends TableSearchConfig {
  prefixCls: string;
  tableKey: string;
  tableLocale: TableLocale;
  columns: readonly InternalColumnType<RecordType>[];
  loading?: boolean;
  values?: Record<Key, any>;
  size?: SizeType;
}

export function isColumnSearchable<RecordType extends AnyObject>({
  valueType = 'text',
  search,
  dataIndex,
}: InternalColumnType<RecordType>) {
  return (
    !!search &&
    typeof valueType !== 'function' &&
    !EXCLUDE_TYPES.includes(typeof valueType === 'object' ? valueType.type : valueType) &&
    !!dataIndex
  );
}

function resetValueType(valueType: FieldValueType | FieldValueObject) {
  const rawValueType = (
    typeof valueType === 'object' ? valueType.type : valueType
  ) as FieldValueType;
  const fieldValueType = (
    typeof valueType === 'object' ? valueType : { type: valueType }
  ) as FieldValueObject;

  if (
    [
      'money',
      'percent',
      'digit',
      'date',
      'dateWeek',
      'dateMonth',
      'dateQuarter',
      'dateYear',
      'dateTime',
      'time',
    ].includes(rawValueType)
  ) {
    fieldValueType.type = `${rawValueType}Range` as FieldValueType;
  } else if (rawValueType === 'fromNow') {
    fieldValueType.type = `dateTimeRange`;
  } else if (rawValueType === 'progress') {
    fieldValueType.type = `percentRange`;
  }

  return fieldValueType;
}

function isDateRangeType(valueType: FieldValueType) {
  return [
    'dateRange',
    'dateWeekRange',
    'dateMonthRange',
    'dateQuarterRange',
    'dateYearRange',
    'dateTimeRange',
    'timeRange',
  ].includes(valueType);
}

const SearchForm = <RecordType extends AnyObject>({
  prefixCls,
  tableKey,
  tableLocale,
  loading,
  defaultCollapsed = true,
  collapsed: propsCollapsed,
  items,
  column = { lg: 3, md: 2, sm: 1 },
  defaultItemsNumber,
  form: propsForm,
  values,
  columns,
  size,
  onCollapsedChange,
  onSearch,
  onFinish,
  onReset,
  ...restProps
}: SearchFormProps<RecordType>) => {
  const [form] = Form.useForm(propsForm);

  const needResponsive = Object.keys(column || {}).some((key) =>
    ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(key),
  );
  const screens = useBreakpoint(needResponsive);
  const mergedColumn = React.useMemo(() => {
    if (typeof column === 'number') {
      return column;
    }

    return matchScreen(screens, column)!;
  }, [screens, column]);

  const [collapsed, setCollapsed] = useMergedState<boolean>(!!defaultCollapsed, {
    value: propsCollapsed,
    onChange: onCollapsedChange,
  });
  useEffect(() => {
    if (!isEqual(values, form.getFieldsValue())) {
      form.resetFields();
      form.setFieldsValue(values);
    }
  }, [JSON.stringify(values)]);

  const handleFinish = (v: Record<string, any>) => {
    onFinish?.(v);
    onSearch?.(v);
  };
  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    onReset?.(e);
    onSearch?.(form.getFieldsValue());
  };

  const mergedItems = useMemo(() => {
    let innerItems: TableSearchConfig['items'] = [...(items ?? [])];

    columns.forEach((column, index) => {
      if (isColumnSearchable(column)) {
        const search = column.search === true ? {} : (column.search as ColumnSearchType);
        const valueType = resetValueType(column.valueType as any);
        const path = toArray(column.dataIndex);
        innerItems.push({
          key: `${tableKey}-cell-${column.key}`,
          name: column.dataIndex,
          label: column.rawTitle,
          valueType: valueType as any,
          valueEnum: typeof column.valueEnum === 'function' ? undefined : column.valueEnum,
          order: index,
          shouldUpdate: (pre, next) => {
            if (pre === next) return false;
            try {
              return (
                JSON.stringify(get(pre, path as any)) !== JSON.stringify(get(next, path as any))
              );
            } catch (error) {
              return true;
            }
          },
          ...search,
          fieldProps: {
            ...(isDateRangeType(valueType.type) && { allowEmpty: [true, true] }),
            ...search.fieldProps,
          },
        });
      }
    });

    innerItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const mergedDefaultItemsNumber = defaultItemsNumber ?? mergedColumn - 1;

    let totalSpan = 0;
    innerItems = innerItems.map((item, index) => {
      const { span = 1 } = item;
      const cloned = { ...item };
      const spanNum = typeof span === 'number' ? span : matchScreen(screens, span)!;
      totalSpan += spanNum;

      if (index !== 0 && totalSpan > mergedDefaultItemsNumber && collapsed) {
        cloned.className = mergeSemanticCls(item.className, 'hidden');
      }

      cloned.fieldProps = {
        ...item.fieldProps,
        className: mergeSemanticCls('w-full', item.fieldProps?.className),
      };

      return cloned;
    });

    const showCollapse = totalSpan > mergedDefaultItemsNumber;

    // Actions
    innerItems.push({
      key: 'search-actions',
      noStyle: true,
      shouldUpdate: false,
      fieldRender: () => (
        <Space
          size={16}
          justify="end"
          align="center"
          className={clsx(`${prefixCls}-search-actions`, 'mb-4')}
          style={{ gridColumn: mergedColumn }}
        >
          <Space size={8}>
            <Button size={size} htmlType="reset">
              {tableLocale.search?.reset}
            </Button>
            <Button size={size} type="primary" loading={loading} htmlType="submit">
              {tableLocale.search?.search}
            </Button>
          </Space>
          {showCollapse && (
            <a
              className={clsx(
                `${prefixCls}-search-collapse-button`,
                'inline-flex items-center gap-2',
              )}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? tableLocale.search?.expand : tableLocale.search?.collapsed}
              <ChevronDownOutline
                className={clsx('h-4 w-4 rotate-180 transition-all duration-300', {
                  'rotate-0': collapsed,
                })}
              />
            </a>
          )}
        </Space>
      ),
    });

    return innerItems;
  }, [items, columns, collapsed, mergedColumn, screens, defaultItemsNumber, loading]);

  const layout = restProps.layout === 'inline' ? 'horizontal' : restProps.layout;

  return (
    <div className={clsx(`${prefixCls}-search-form`, 'mb-4 border-b border-border-tertiary')}>
      <Form
        layout={layout}
        form={form}
        column={mergedColumn}
        items={mergedItems}
        size={size}
        onFinish={handleFinish}
        onReset={handleReset}
        {...restProps}
      />
    </div>
  );
};

export default SearchForm;
