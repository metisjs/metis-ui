import React, { useEffect, useMemo, useRef } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Bars3Outline, BarsArrowUpOutline } from '@metisjs/icons';
import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import { useEvent } from 'rc-util';
import omit from 'rc-util/lib/omit';
import Popover from '../../popover';
import Tooltip from '../../tooltip';
import Tree from '../../tree';
import type { CheckInfo, DataNode } from '../../tree/interface';
import TableContext from '../context/TableContext';
import type {
  ColumnState,
  InternalColumnsType,
  InternalColumnType,
  Key,
  SettingOptionType,
  TableLocale,
} from '../interface';
import { getColumnKey, getColumnsKey } from '../utils/valueUtil';

type ColumnSettingProps<T extends AnyObject = AnyObject> = SettingOptionType & {
  columns: InternalColumnsType<T>;
};

const ToolTipIcon: React.FC<{
  title: string;
  columnKey: Key;
  show: boolean;
  fixed: 'left' | 'right' | undefined;
  children?: React.ReactNode;
}> = ({ title, show, children, columnKey, fixed }) => {
  const { columnStateMap, setColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
  ]);

  if (!show) {
    return null;
  }

  return (
    <Tooltip title={title}>
      <span
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
  tableLocale: TableLocale;
  columnKey: string | number;
  prefixCls: string;
  title?: React.ReactNode;
  fixed?: boolean | 'left' | 'right';
  showListItemOption?: boolean;
  isLeaf?: boolean;
}> = ({ tableLocale, columnKey, isLeaf, title, prefixCls, fixed, showListItemOption }) => {
  const dom = (
    <span className={`${prefixCls}-list-item-option`}>
      <ToolTipIcon
        columnKey={columnKey}
        fixed="left"
        title={tableLocale.toolbar!.leftPin!}
        show={fixed !== 'left'}
      >
        <BarsArrowUpOutline className="-rotate-90" />
      </ToolTipIcon>
      <ToolTipIcon
        columnKey={columnKey}
        fixed={undefined}
        title={tableLocale.toolbar!.noPin!}
        show={!!fixed}
      >
        <Bars3Outline className="-rotate-90" />
      </ToolTipIcon>
      <ToolTipIcon
        columnKey={columnKey}
        fixed="right"
        title={tableLocale.toolbar!.rightPin!}
        show={fixed !== 'right'}
      >
        <BarsArrowUpOutline className="-rotate-90 scale-x-[-1]" />
      </ToolTipIcon>
    </span>
  );
  return (
    <span className={`${prefixCls}-list-item`} key={columnKey}>
      <div className={`${prefixCls}-list-item-title`}>{title}</div>
      {showListItemOption && !isLeaf ? dom : null}
    </span>
  );
};

const CheckboxList: React.FC<{
  list: InternalColumnsType<any>;
  prefixCls: string;
  title: string;
  draggable: boolean;
  checkable: boolean;
  showListItemOption: boolean;
  showTitle?: boolean;
  listHeight?: number;
}> = ({
  list,
  draggable,
  checkable,
  showListItemOption,
  prefixCls,
  showTitle = true,
  title: listTitle,
  listHeight = 280,
}) => {
  const { columnStateMap, setColumnStateMap, resetColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
    'resetColumnStateMap',
  ]);

  const handleDragEnd = () => {};

  const itemKeys = getColumnsKey(list);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemKeys} strategy={verticalListSortingStrategy}></SortableContext>
    </DndContext>
  );
};

function ColumnSetting<T extends AnyObject>(props: ColumnSettingProps<T>) {
  const columnRef = useRef(null);
  // 获得当前上下文的 hashID
  const counter = useContext(TableContext);
  const localColumns: TableColumnType<T> &
    {
      index?: number;
      fixed?: any;
      key?: any;
    }[] = props.columns;
  const { checkedReset = true } = props;
  const { columnStateMap, setColumnsMap, clearPersistenceStorage } = counter;

  useEffect(() => {
    if (counter.propsRef.current?.columnsState?.value) {
      columnRef.current = JSON.parse(
        JSON.stringify(counter.propsRef.current?.columnsState?.value || {}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 设置全部选中，或全部未选中
   *
   * @param show
   */
  const setAllSelectAction = useRefFunction((show: boolean = true) => {
    const columnKeyMap = {} as Record<string, any>;
    const loopColumns = (columns: any) => {
      columns.forEach(({ key, fixed, index, children, disable }: any) => {
        const columnKey = genColumnKey(key, index);
        if (columnKey) {
          columnKeyMap[columnKey] = {
            // 子节点 disable 时，不修改节点显示状态
            show: disable ? columnStateMap[columnKey]?.show : show,
            fixed,
            disable,
            order: columnStateMap[columnKey]?.order,
          };
        }
        if (children) {
          loopColumns(children);
        }
      });
    };
    loopColumns(localColumns);
    setColumnsMap(columnKeyMap);
  });

  /** 全选和反选 */
  const checkedAll = useRefFunction((e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setAllSelectAction();
    } else {
      setAllSelectAction(false);
    }
  });

  /** 重置项目 */
  const clearClick = useRefFunction(() => {
    clearPersistenceStorage?.();
    setColumnsMap(
      counter.propsRef.current?.columnsState?.defaultValue ||
        columnRef.current ||
        counter.defaultColumnKeyMap!,
    );
  });

  // 未选中的 key 列表
  const unCheckedKeys = Object.values(columnStateMap).filter(
    (value) => !value || value.show === false,
  );

  // 是否已经选中
  const indeterminate = unCheckedKeys.length > 0 && unCheckedKeys.length !== localColumns.length;

  const className = getPrefixCls('pro-table-column-setting');
  return (
    <Popover
      arrow={false}
      title={
        <div className={`${className}-title ${hashId}`}>
          {props.checkable === false ? (
            <div />
          ) : (
            <Checkbox
              indeterminate={indeterminate}
              checked={unCheckedKeys.length === 0 && unCheckedKeys.length !== localColumns.length}
              onChange={(e) => {
                checkedAll(e);
              }}
            >
              {intl.getMessage('tableToolBar.columnDisplay', '列展示')}
            </Checkbox>
          )}
          {checkedReset ? (
            <a onClick={clearClick} className={`${className}-action-rest-button ${hashId}`}>
              {intl.getMessage('tableToolBar.reset', '重置')}
            </a>
          ) : null}
          {props?.extra ? (
            <Space size={12} align="center">
              {props.extra}
            </Space>
          ) : null}
        </div>
      }
      overlayClassName={`${className}-overlay ${hashId}`}
      trigger="click"
      placement="bottomRight"
      content={
        <GroupCheckboxList
          checkable={props.checkable ?? true}
          draggable={props.draggable ?? true}
          showListItemOption={props.showListItemOption ?? true}
          className={className}
          localColumns={localColumns}
          listsHeight={props.listsHeight}
        />
      }
    >
      {props.children || (
        <Tooltip title={intl.getMessage('tableToolBar.columnSetting', '列设置')}>
          {props.settingIcon ?? <SettingOutlined />}
        </Tooltip>
      )}
    </Popover>
  );
}

export default ColumnSetting;
