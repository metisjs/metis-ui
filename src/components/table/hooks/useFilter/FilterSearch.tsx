import * as React from 'react';
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '../../../_util/type';
import Input from '../../../input';
import type { FilterSearchType, TableLocale } from '../../interface';

interface FilterSearchProps<RecordType = AnyObject> {
  value: string;
  onChange: (value: string) => void;
  filterSearch: FilterSearchType<RecordType>;
  tablePrefixCls: string;
  locale: TableLocale;
}

const FilterSearch = <RecordType extends AnyObject = AnyObject>(
  props: FilterSearchProps<RecordType>,
) => {
  const { value, filterSearch, tablePrefixCls, locale, onChange } = props;
  if (!filterSearch) {
    return null;
  }
  return (
    <div
      className={clsx(
        `${tablePrefixCls}-filter-dropdown-search`,
        'border-b border-b-border-secondary p-2',
      )}
    >
      <Input
        prefix={<MagnifyingGlassOutline />}
        placeholder={locale.filterSearchPlaceholder}
        onChange={onChange}
        value={value}
        // for skip min-width of input
        htmlSize={1}
        size="small"
        className={clsx(`${tablePrefixCls}-filter-dropdown-search-input`, 'min-w-44')}
      />
    </div>
  );
};

export default FilterSearch;
