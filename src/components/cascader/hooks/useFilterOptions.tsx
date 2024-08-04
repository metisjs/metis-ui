import * as React from 'react';
import type { InternalFieldNames } from '../Cascader';
import { CascaderProps, DefaultOptionType } from '../interface';

export const SEARCH_MARK = '__cascader_search_mark__';

function highlightKeyword(str: string, lowerKeyword: string) {
  const cells = str
    .toLowerCase()
    .split(lowerKeyword)
    .reduce<string[]>(
      (list, cur, index) => (index === 0 ? [cur] : [...list, lowerKeyword, cur]),
      [],
    );
  const fillCells: React.ReactNode[] = [];
  let start = 0;

  cells.forEach((cell, index) => {
    const end = start + cell.length;
    let originWorld: React.ReactNode = str.slice(start, end);
    start = end;

    if (index % 2 === 1) {
      originWorld = (
        <span className="text-error" key={`separator-${index}`}>
          {originWorld}
        </span>
      );
    }

    fillCells.push(originWorld);
  });

  return fillCells;
}

function defaultRender(
  searchValue: string,
  path: DefaultOptionType[],
  fieldNames: InternalFieldNames,
) {
  const optionList: React.ReactNode[] = [];
  const lower = searchValue.toLowerCase();

  path.forEach((node, index) => {
    if (index !== 0) {
      optionList.push(' / ');
    }

    let label = node[fieldNames.label];
    const type = typeof label;
    if (type === 'string' || type === 'number') {
      label = highlightKeyword(String(label), lower);
    }

    optionList.push(label);
  });
  return optionList;
}

export function doFilter<T extends DefaultOptionType>(
  options: T[],
  fieldNames: InternalFieldNames,
  searchValue: string,
  filterOption?: CascaderProps['filterOption'],
  filterRender?: CascaderProps['filterRender'],
  filterSort?: CascaderProps['filterSort'],
  optionFilterProp?: string,
  changeOnSelect?: boolean,
) {
  const filteredOptions: T[] = [];
  if (!searchValue) {
    return [];
  }

  const customizeFilter = typeof filterOption === 'function';
  const customizeRender = typeof filterRender === 'function';
  const customizeSort = typeof filterSort === 'function';

  function dig(list: T[], pathOptions: T[], parentDisabled = false) {
    list.forEach((option) => {
      const connectedPathOptions = [...pathOptions, option];
      const children = option[fieldNames.children];

      const mergedDisabled = parentDisabled || option.disabled;

      if (!children || children.length === 0 || changeOnSelect) {
        const matched = customizeFilter
          ? filterOption(searchValue, connectedPathOptions)
          : connectedPathOptions.some((opt) =>
              String(opt[optionFilterProp ?? fieldNames.label])
                .toLowerCase()
                .includes(searchValue.trim().toLowerCase()),
            );
        if (matched) {
          filteredOptions.push({
            ...option,
            disabled: mergedDisabled,
            [fieldNames.label as 'label']: customizeRender
              ? filterRender(searchValue, connectedPathOptions)
              : defaultRender(searchValue, connectedPathOptions, fieldNames),
            [SEARCH_MARK]: connectedPathOptions,
            [fieldNames.children]: undefined,
          });
        }
      }

      if (children) {
        dig(option[fieldNames.children], connectedPathOptions, mergedDisabled);
      }
    });
  }

  dig(options, []);

  // Do sort
  if (customizeSort) {
    filteredOptions.sort((a, b) => {
      return filterSort(a[SEARCH_MARK], b[SEARCH_MARK]);
    });
  }

  return filteredOptions;
}

export default (
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  searchValue: string,
  filterOption?: CascaderProps['filterOption'],
  filterRender?: CascaderProps['filterRender'],
  filterSort?: CascaderProps['filterSort'],
  optionFilterProp?: string,
  changeOnSelect?: boolean,
  ignore?: boolean,
) => {
  return React.useMemo(() => {
    if (ignore) {
      return options;
    }

    return doFilter<DefaultOptionType>(
      options,
      fieldNames,
      searchValue,
      filterOption,
      filterRender,
      filterSort,
      optionFilterProp,
      changeOnSelect,
    );
  }, [
    options,
    fieldNames,
    searchValue,
    filterOption,
    filterRender,
    filterSort,
    optionFilterProp,
    changeOnSelect,
    ignore,
  ]);
};
