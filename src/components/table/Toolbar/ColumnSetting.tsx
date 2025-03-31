import React, { useMemo } from 'react';
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
import { EXPAND_COLUMN, SELECTION_COLUMN } from '../constant';
import TableContext, { responseImmutable } from '../context/TableContext';
import type {
  ColumnState,
  ColumnTitleProps,
  InternalColumnsType,
  Key,
  TableLocale,
} from '../interface';
import { getColumnsKey, renderColumnTitle } from '../utils/valueUtil';

type ColumnSettingProps<T extends AnyObject = AnyObject> = {
  prefixCls: string;
  tableLocale: TableLocale;
  columns: InternalColumnsType<T>;
  settingIcon?: React.ReactNode;
  columnTitleProps: ColumnTitleProps<T>;
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
          'text-text-secondary hover:text-primary hidden cursor-pointer items-center text-base group-hover/item:inline-flex',
          {
            'inline-flex group-hover/item:hidden': fixed === current,
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
      className={clsx(
        `${prefixCls}-list-item`,
        'group/item bg-container relative z-1 flex items-center py-0.5',
        {
          'z-2': isDragging,
        },
      )}
      ref={setNodeRef}
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        className={clsx(
          `${prefixCls}-list-item-drag-handle`,
          'text-text-tertiary mr-2 inline-flex cursor-grab items-center text-xs',
          {
            'cursor-grabbing': isDragging,
          },
        )}
      >
        <DragHandlerIcon />
      </div>
      <Checkbox checked={checked} onChange={handelShowChange}></Checkbox>
      <div
        {...attributes}
        {...listeners}
        className={clsx(
          `${prefixCls}-list-item-title flex-1`,
          'cursor-grab px-2 leading-6 select-none',
          {
            'cursor-grabbing': isDragging,
          },
        )}
      >
        {title}
      </div>
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
          <BarsArrowUpOutline className="scale-x-[-1] rotate-90" />
        </ToolTipIcon>
      </div>
    </div>
  );
};

const CheckboxList: React.FC<{
  prefixCls: string;
  tableLocale: TableLocale;
  list: InternalColumnsType<any>;
  columnTitleProps: ColumnTitleProps<any>;
}> = ({ prefixCls, tableLocale, list, columnTitleProps }) => {
  const { columnStateMap, setColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
  ]);

  const handleDragEnd = (info: DragEndEvent) => {
    const { active, over } = info;
    if (active.id !== over?.id) {
      const activeOrder = columnStateMap[active.id as string]?.order ?? 0;
      const overOrder = columnStateMap[over?.id as string]?.order ?? 0;

      const newColumnStateMap = Object.fromEntries(
        Object.entries(columnStateMap).map(([key, item]) => {
          let newOrder = item.order;
          if (key === active.id) {
            newOrder = overOrder; // 更新拖动项的 order
          } else if (activeOrder < overOrder) {
            // active 项被拖动到 over 项之前
            if (item.order > activeOrder && item.order <= overOrder) {
              newOrder = item.order - 1; // 向前移动的项顺序减 1
            }
          } else if (activeOrder > overOrder) {
            // active 项被拖动到 over 项之后
            if (item.order >= overOrder && item.order < activeOrder) {
              newOrder = item.order + 1; // 向后移动的项顺序加 1
            }
          }
          return [key, { ...item, order: newOrder }];
        }),
      );

      setColumnStateMap(newColumnStateMap);
    }
  };

  const mergedList = useMemo(
    () => [...list].sort((a, b) => columnStateMap[a.key].order - columnStateMap[b.key].order),
    [list, columnStateMap],
  );

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
        <SortableContext items={getColumnsKey(mergedList)} strategy={verticalListSortingStrategy}>
          {mergedList.map((item) => (
            <CheckboxListItem
              key={item.key}
              prefixCls={prefixCls}
              tableLocale={tableLocale}
              columnKey={item.key}
              title={renderColumnTitle(item.title, columnTitleProps)}
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
  columnTitleProps,
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
      content={
        <CheckboxList
          prefixCls={prefixCls}
          tableLocale={tableLocale}
          list={columns.filter(
            (col) => col.key !== SELECTION_COLUMN.key && col.key !== EXPAND_COLUMN.key,
          )}
          columnTitleProps={columnTitleProps}
        />
      }
      className={{ inner: 'px-0' }}
    >
      <Tooltip title={tableLocale.toolbar?.setting}>{settingIcon ?? <Cog6ToothOutline />}</Tooltip>
    </Popover>
  );
}

export default responseImmutable(ColumnSetting);
