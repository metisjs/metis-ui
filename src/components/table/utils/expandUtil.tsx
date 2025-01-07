import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { ExpandableConfig, GetRowKey, Key, RenderExpandIconProps } from '../interface';

export function renderExpandIcon<RecordType>({
  prefixCls,
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) {
  const iconPrefix = `${prefixCls}-row-expand-icon`;

  return (
    <button
      type="button"
      onClick={(e) => {
        onExpand(record, e!);
        e.stopPropagation();
      }}
      className={clsx(
        iconPrefix,
        {
          [`${iconPrefix}-spaced`]: !expandable,
          [`${iconPrefix}-expanded`]: expandable && expanded,
          [`${iconPrefix}-collapsed`]: expandable && !expanded,
        },
        'relative inline-flex h-4 w-4 select-none rounded align-sub outline-none ring-1 ring-inset ring-border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'before:absolute before:left-1/2 before:top-1/2 before:h-px before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-text-tertiary before:transition-transform before:duration-300',
        'after:absolute after:left-1/2 after:top-1/2 after:h-2.5 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-text-tertiary after:transition-transform after:duration-300',
        'hover:before:bg-text-secondary hover:after:bg-text-secondary',
        {
          ['invisible']: !expandable,
          'before:rotate-180 after:rotate-90': expandable && expanded,
        },
      )}
      aria-expanded={expanded}
    />
  );
}

export function findAllChildrenKeys<RecordType>(
  data: readonly RecordType[],
  getRowKey: GetRowKey<RecordType>,
  childrenColumnName: keyof RecordType,
): Key[] {
  const keys: Key[] = [];

  function dig(list: readonly RecordType[]) {
    (list || []).forEach((item, index) => {
      keys.push(getRowKey(item, index));

      dig((item as any)[childrenColumnName]);
    });
  }

  dig(data);

  return keys;
}

export function computedExpandedClassName<RecordType>(
  cls: ExpandableConfig<RecordType>['expandedRowClassName'],
  record: RecordType,
  index: number,
  indent: number,
) {
  if (typeof cls === 'string') {
    return cls;
  }
  if (typeof cls === 'function') {
    return cls(record, index, indent);
  }
  return '';
}
