import React from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Outline, BarsArrowUpOutline, Cog6ToothOutline } from '@metisjs/icons';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import Checkbox from '../../checkbox';
import Popover from '../../popover';
import Scrollbar from '../../scrollbar';
import Tooltip from '../../tooltip';
import TableContext, { responseImmutable } from '../context/TableContext';
import type { ColumnState, InternalColumnsType, Key, TableLocale } from '../interface';
import { getColumnsKey } from '../utils/valueUtil';

type ColumnSettingProps<T extends AnyObject = AnyObject> = {
  prefixCls: string;
  tableLocale: TableLocale;
  columns: InternalColumnsType<T>;
  settingIcon?: React.ReactNode;
};

const DragHandlerIcon = () => (
  <svg viewBox="0 0 20 20" width="1em" height="1em" fill="currentColor">
    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
  </svg>
);

const ToolTipIcon: React.FC<{
  title: string;
  columnKey: Key;
  current: 'left' | 'right' | undefined;
  fixed: 'left' | 'right' | undefined;
  children?: React.ReactNode;
}> = ({ title, current, children, columnKey, fixed }) => {
  const { columnStateMap, setColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
  ]);

  return (
    <Tooltip title={title}>
      <span
        className={clsx(
          'hidden cursor-pointer items-center text-base text-text-secondary hover:text-primary group-hover/item:block',
          {
            'block group-hover/item:hidden': fixed === current,
            hidden: fixed === undefined && fixed === current,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const config = columnStateMap[columnKey] || {};
          const columnKeyMap = {
            ...columnStateMap,
            [columnKey]: { ...config, fixed } as ColumnState,
          };
          setColumnStateMap(columnKeyMap);
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
};

const CheckboxListItem: React.FC<{
  prefixCls: string;
  tableLocale: TableLocale;
  columnKey: string | number;
  title?: React.ReactNode;
}> = ({ prefixCls, tableLocale, columnKey, title }) => {
  const { columnStateMap, setColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
  ]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: columnKey,
  });

  const handelShowChange = (show: boolean) => {
    const config = columnStateMap[columnKey] || {};
    const columnKeyMap = {
      ...columnStateMap,
      [columnKey]: { ...config, show } as ColumnState,
    };
    setColumnStateMap(columnKeyMap);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fixed = columnStateMap[columnKey].fixed;
  const checked = columnStateMap[columnKey].show;

  return (
    <div
      key={columnKey}
      className={clsx(`${prefixCls}-list-item`, 'group/item flex items-center py-1')}
      ref={setNodeRef}
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        className={clsx(
          `${prefixCls}-list-item-drag-handle`,
          'mr-2 inline-flex cursor-grab items-center text-xs text-text-tertiary',
          {
            'cursor-grabbing': isDragging,
          },
        )}
      >
        <DragHandlerIcon />
      </div>
      <Checkbox
        checked={checked}
        onChange={handelShowChange}
        className={clsx(`${prefixCls}-list-item-title flex-1`, 'mr-2')}
      >
        {title}
      </Checkbox>
      <div
        className={clsx(
          `${prefixCls}-list-item-option`,
          'inline-flex w-8 items-center justify-end gap-1',
        )}
      >
        <ToolTipIcon
          columnKey={columnKey}
          fixed="left"
          title={tableLocale.toolbar!.leftPin!}
          current={fixed}
        >
          <BarsArrowUpOutline className="-rotate-90" />
        </ToolTipIcon>
        <ToolTipIcon
          columnKey={columnKey}
          fixed={undefined}
          title={tableLocale.toolbar!.noPin!}
          current={fixed}
        >
          <Bars3Outline className="-rotate-90" />
        </ToolTipIcon>
        <ToolTipIcon
          columnKey={columnKey}
          fixed="right"
          title={tableLocale.toolbar!.rightPin!}
          current={fixed}
        >
          <BarsArrowUpOutline className="rotate-90 scale-x-[-1]" />
        </ToolTipIcon>
      </div>
    </div>
  );
};

const CheckboxList: React.FC<{
  prefixCls: string;
  tableLocale: TableLocale;
  list: InternalColumnsType<any>;
}> = ({ prefixCls, tableLocale, list }) => {
  const { columnStateMap, setColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
  ]);

  const handleDragEnd = (info: DragEndEvent) => {
    const { active, over } = info;
    if (active.id !== over?.id) {
      const newColumnStateMap = { ...columnStateMap };
      const overOrder = columnStateMap[over?.id as string]?.order ?? 0;
      Object.entries(newColumnStateMap).forEach(([key, item]) => {
        if (active.id === key) {
          item.order = overOrder;
        } else if (item.order >= overOrder) {
          item.order += 1;
        }
      });

      setColumnStateMap(newColumnStateMap);
    }
  };

  return (
    <Scrollbar
      autoHeight={[0, 288]}
      className={{ root: clsx(`${prefixCls}-column-setting-list`), view: 'px-3' }}
    >
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={getColumnsKey(list)} strategy={verticalListSortingStrategy}>
          {list.map((item) => (
            <CheckboxListItem
              key={item.key}
              prefixCls={prefixCls}
              tableLocale={tableLocale}
              columnKey={item.key}
              title={item.rawTitle}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Scrollbar>
  );
};

function ColumnSetting<T extends AnyObject>({
  prefixCls,
  tableLocale,
  columns,
  settingIcon,
}: ColumnSettingProps<T>) {
  const { resetColumnStateMap } = useContext(TableContext, ['resetColumnStateMap']);

  return (
    <Popover
      arrow={false}
      title={
        <div className={clsx(`${prefixCls}-title`, 'mb-1 flex justify-between px-3')}>
          {tableLocale.toolbar?.setting}
          <a onClick={resetColumnStateMap} className={`${prefixCls}-action-rest `}>
            {tableLocale.toolbar?.reset}
          </a>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      content={<CheckboxList prefixCls={prefixCls} tableLocale={tableLocale} list={columns} />}
      className={{ inner: 'px-0' }}
    >
      <Tooltip title={tableLocale.toolbar?.setting}>{settingIcon ?? <Cog6ToothOutline />}</Tooltip>
    </Popover>
  );
}

export default responseImmutable(ColumnSetting);
