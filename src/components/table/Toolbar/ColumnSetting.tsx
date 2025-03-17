import React, { useEffect, useMemo, useRef } from 'react';
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
  ColumnsType,
  ColumnType,
  Key,
  SettingOptionType,
  TableLocale,
} from '../interface';
import { getColumnKey } from '../utils/valueUtil';

type ColumnSettingProps<T extends AnyObject = AnyObject> = SettingOptionType & {
  columns: ColumnsType<T>;
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
  list: (ColumnType<any> & { index?: number })[];
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
  const { columnStateMap, setColumnStateMap } = useContext(TableContext, [
    'columnStateMap',
    'setColumnStateMap',
  ]);
  const show = list && list.length > 0;
  const treeDataConfig = useMemo(() => {
    if (!show) return {};
    const checkedKeys: Key[] = [];
    const treeMap = new Map<Key, DataNode>();

    const loopData = (
      data: any[],
      parentConfig?: ColumnState & {
        columnKey: Key;
      },
    ): DataNode[] =>
      data.map(({ children, ...rest }) => {
        const columnKey = getColumnKey(
          rest,
          [parentConfig?.columnKey, rest.index].filter(Boolean).join('-'),
        );
        const config = columnStateMap[columnKey || 'null'] || { show: true };
        if (config.show !== false && !children) {
          checkedKeys.push(columnKey);
        }

        const item: DataNode = {
          key: columnKey,
          ...omit(rest, ['className']),
          selectable: false,
          disabled: config.disable === true,
          disableCheckbox:
            typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
          isLeaf: parentConfig ? true : undefined,
        };

        if (children) {
          item.children = loopData(children, {
            ...config,
            columnKey,
          });
          // 如果children 已经全部是show了，把自己也设置为show
          if (
            item.children?.every((childrenItem) =>
              checkedKeys?.includes(childrenItem.key as string),
            )
          ) {
            checkedKeys.push(columnKey);
          }
        }
        treeMap.set(columnKey, item);
        return item;
      });
    return { list: loopData(list), keys: checkedKeys, map: treeMap };
  }, [columnStateMap, list, show]);

  /** 移动到指定的位置 */
  const move = useEvent((id: React.Key, targetId: React.Key, dropPosition: number) => {
    const newMap = { ...columnStateMap };
    const newColumns = [...sortKeyColumns];
    const findIndex = newColumns.findIndex((columnKey) => columnKey === id);
    const targetIndex = newColumns.findIndex((columnKey) => columnKey === targetId);
    const isDownWard = dropPosition >= findIndex;
    if (findIndex < 0) return;
    const targetItem = newColumns[findIndex];
    newColumns.splice(findIndex, 1);

    if (dropPosition === 0) {
      newColumns.unshift(targetItem);
    } else {
      newColumns.splice(isDownWard ? targetIndex : targetIndex + 1, 0, targetItem);
    }
    // 重新生成排序数组
    newColumns.forEach((key, order) => {
      newMap[key] = { ...(newMap[key] || {}), order };
    });
    // 更新数组
    setColumnStateMap(newMap);
    setSortKeyColumns(newColumns);
  });

  /** 选中反选功能 */
  const onCheckTree = useEvent((info: CheckInfo<any>) => {
    const newColumnMap = { ...columnStateMap };

    const loopSetShow = (key: Key) => {
      const newSetting = { ...newColumnMap[key] };
      newSetting.show = info.checked;
      // 如果含有子节点，也要选中
      if (treeDataConfig.map?.get(key)?.children) {
        treeDataConfig.map.get(key)?.children?.forEach((item) => loopSetShow(item.key as string));
      }
      newColumnMap[key] = newSetting;
    };
    loopSetShow(info.node.key);
    setColumnStateMap({ ...newColumnMap });
  });

  if (!show) {
    return null;
  }

  const listDom = (
    <Tree
      draggable={draggable && !!treeDataConfig.list?.length && treeDataConfig.list?.length > 1}
      checkable={checkable}
      onDrop={(info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const { dropPosition, dropToGap } = info;
        const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition;
        move(dragKey, dropKey, position);
      }}
      onCheck={(_, info) => onCheckTree(info)}
      checkedKeys={treeDataConfig.keys}
      showLine={false}
      titleRender={(_node) => {
        const node = { ..._node, children: undefined };
        if (!node.title) return null;
        const normalizedTitle = runFunction(node.title, node);
        const wrappedTitle = (
          <Typography.Text style={{ width: 80 }} ellipsis={{ tooltip: normalizedTitle }}>
            {normalizedTitle}
          </Typography.Text>
        );

        return (
          <CheckboxListItem
            prefixCls={prefixCls}
            {...omit(node, ['key'])}
            showListItemOption={showListItemOption}
            title={wrappedTitle}
            columnKey={node.key as string}
          />
        );
      }}
      treeData={treeDataConfig.list?.map(
        ({ disabled /* 不透传 disabled，使子节点禁用时也可以拖动调整顺序 */, ...config }) => config,
      )}
      style={{ height: listHeight }}
    />
  );
  return (
    <>
      {showTitle && <span className={`${className}-list-title ${hashId}`}>{listTitle}</span>}
      {listDom}
    </>
  );
};

const GroupCheckboxList: React.FC<{
  localColumns: (ProColumns<any> & { index?: number })[];
  className?: string;
  draggable: boolean;
  checkable: boolean;
  showListItemOption: boolean;
  listsHeight?: number;
}> = ({ localColumns, className, draggable, checkable, showListItemOption, listsHeight }) => {
  const { hashId } = useContext(ProProvider);
  const rightList: (ProColumns<any> & { index?: number })[] = [];
  const leftList: (ProColumns<any> & { index?: number })[] = [];
  const list: (ProColumns<any> & { index?: number })[] = [];
  const intl = useIntl();

  localColumns.forEach((item) => {
    /** 不在 setting 中展示的 */
    if (item.hideInSetting) {
      return;
    }
    const { fixed } = item;
    if (fixed === 'left') {
      leftList.push(item);
      return;
    }
    if (fixed === 'right') {
      rightList.push(item);
      return;
    }
    list.push(item);
  });

  const showRight = rightList && rightList.length > 0;
  const showLeft = leftList && leftList.length > 0;
  return (
    <div
      className={clsx(`${className}-list`, hashId, {
        [`${className}-list-group`]: showRight || showLeft,
      })}
    >
      <CheckboxList
        title={intl.getMessage('tableToolBar.leftFixedTitle', '固定在左侧')}
        list={leftList}
        draggable={draggable}
        checkable={checkable}
        showListItemOption={showListItemOption}
        className={className}
        listHeight={listsHeight}
      />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        draggable={draggable}
        checkable={checkable}
        showListItemOption={showListItemOption}
        title={intl.getMessage('tableToolBar.noFixedTitle', '不固定')}
        showTitle={showLeft || showRight}
        className={className}
        listHeight={listsHeight}
      />
      <CheckboxList
        title={intl.getMessage('tableToolBar.rightFixedTitle', '固定在右侧')}
        list={rightList}
        draggable={draggable}
        checkable={checkable}
        showListItemOption={showListItemOption}
        className={className}
        listHeight={listsHeight}
      />
    </div>
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
