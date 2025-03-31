import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { GetRowKey, Key, RenderExpandIconProps } from '../interface';

export function renderExpandIcon<RecordType>({
  prefixCls,
  record,
  onExpand,
  expanded,
  expandable,
  nestExpandable,
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
        'ring-border focus-visible:ring-primary relative inline-flex h-4 w-4 rounded-sm align-sub ring-1 outline-hidden transition-all duration-300 select-none ring-inset focus-visible:ring-2 focus-visible:ring-offset-2',
        'before:bg-text-secondary before:absolute before:top-1/2 before:left-1/2 before:h-px before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-transform before:duration-300',
        'after:bg-text-secondary after:absolute after:top-1/2 after:left-1/2 after:h-2.5 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:transition-transform after:duration-300',
        {
          ['invisible']: !expandable,
          'before:rotate-180 after:rotate-90': expandable && expanded,
          'mr-2': nestExpandable,
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
