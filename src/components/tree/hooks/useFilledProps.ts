import { useContext, useMemo, useState } from 'react';
import { useMergedState } from 'rc-util';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { mergeSemanticCls } from '../../_util/classNameUtils';
import { ConfigContext } from '../../config-provider';
import type { SpinProps } from '../../spin';
import type { DataNode, FlattenNode, Key, KeyEntities } from '../interface';
import type { InternalTreeProps } from '../Tree';
import { conductCheck, isCheckDisabled } from '../utils/conductUtil';
import { calcSelectedKeys, conductExpandParent, parseCheckedKeys } from '../utils/miscUtil';
import { convertDataToEntities, fillFieldNames, flattenTreeData } from '../utils/treeUtil';
import useRequest from './useRequest';

export default function useFilledProps({
  prefixCls: customizePrefixCls,
  treeData,
  fieldNames,
  loading = false,
  showIcon = true,
  showLine = 'hover',
  selectable = true,
  multiple = false,
  indent = 8,
  defaultExpandedKeys = [],
  expandedKeys: customizeExpandedKeys,
  autoExpandParent = true,
  defaultExpandAll,
  checkable,
  defaultCheckedKeys = [],
  checkedKeys: customizeCheckedKeys,
  checkStrictly,
  defaultSelectedKeys = [],
  selectedKeys: customizeSelectedKeys,
  virtual: customizeVirtual,
  loadedKeys: customizeLoadedKeys,
  request,
  lazyLoad,
  allowDrop = () => true,
  ...restProps
}: InternalTreeProps) {
  const { getPrefixCls, virtual, renderEmpty } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('tree', customizePrefixCls);

  const filledFieldNames = useMemo(() => fillFieldNames(fieldNames), [JSON.stringify(fieldNames)]);

  const {
    loading: requestLoading,
    treeData: requestTreeData,
    loadingKeys,
    loadedKeys,
    loadData,
  } = useRequest(filledFieldNames, customizeLoadedKeys, request, lazyLoad);

  const mergedTreeData = useMemo(
    () => (request ? requestTreeData : treeData || []),
    [request, requestTreeData, treeData],
  );

  // ===================================== KeyEntities =====================================
  const keyEntities = useMemo(() => {
    const entitiesMap = convertDataToEntities(mergedTreeData, {
      fieldNames: filledFieldNames,
    });
    return entitiesMap.keyEntities as KeyEntities<DataNode>;
  }, [mergedTreeData, filledFieldNames]);

  // ===================================== ExpandedKeys =====================================
  const [mergedDefaultExpandedKeys, mergedExpandedKeys] = useMemo(() => {
    let _defaultExpandedKeys: React.Key[] = defaultExpandedKeys;

    if (customizeExpandedKeys) {
      return [
        _defaultExpandedKeys,
        autoExpandParent
          ? conductExpandParent(customizeExpandedKeys, keyEntities)
          : customizeExpandedKeys,
      ];
    }

    if (defaultExpandAll) {
      _defaultExpandedKeys = [];
      Object.entries(keyEntities).forEach(([, entity]) => {
        if (entity.children && entity.children.length) {
          _defaultExpandedKeys.push(entity.key);
        }
      });
    } else if (autoExpandParent) {
      _defaultExpandedKeys = conductExpandParent(_defaultExpandedKeys, keyEntities);
    }

    return [_defaultExpandedKeys, undefined];
  }, [autoExpandParent, keyEntities, customizeExpandedKeys]);

  const [expandedKeys, setExpandedKeys] = useMergedState(mergedDefaultExpandedKeys, {
    value: mergedExpandedKeys,
  });

  // ===================================== CheckedKeys =====================================
  const defaultCheckedKeyEntity = useMemo(() => {
    if (!checkable) {
      return null;
    }
    const keys = parseCheckedKeys(defaultCheckedKeys);

    if (!checkStrictly)
      return conductCheck(keys?.checkedKeys ?? [], true, keyEntities, (node) =>
        isCheckDisabled(node, filledFieldNames.disabled),
      );

    return keys;
  }, [filledFieldNames.disabled]);
  const checkedKeyEntity = useMemo(() => {
    if (!checkable) {
      return null;
    }

    const keys = parseCheckedKeys(customizeCheckedKeys);
    if (!checkStrictly)
      return keys?.checkedKeys
        ? conductCheck(keys.checkedKeys, true, keyEntities, (node) =>
            isCheckDisabled(node, filledFieldNames.disabled),
          )
        : null;

    return keys;
  }, [checkable, customizeCheckedKeys, keyEntities, filledFieldNames.disabled]);

  const [checkedKeys, setCheckedKeys] = useMergedState<Key[]>(
    defaultCheckedKeyEntity?.checkedKeys ?? [],
    {
      value: checkedKeyEntity?.checkedKeys,
    },
  );
  const [halfCheckedKeys, setHalfCheckedKeys] = useMergedState<Key[]>(
    defaultCheckedKeyEntity?.halfCheckedKeys ?? [],
    {
      value: checkedKeyEntity?.halfCheckedKeys,
    },
  );

  // ===================================== SelectedKeys =====================================
  const [mergedDefaultSelectedKeys, mergedSelectedKeys] = useMemo(
    () =>
      selectable
        ? [
            calcSelectedKeys(defaultSelectedKeys, multiple)!,
            calcSelectedKeys(customizeSelectedKeys, multiple),
          ]
        : [[], []],
    [customizeSelectedKeys, multiple, selectable],
  );
  const [selectedKeys, setSelectedKeys] = useMergedState(mergedDefaultSelectedKeys, {
    value: mergedSelectedKeys,
  });

  // ===================================== FlattenNodes =====================================
  const [flattenNodes, setFlattenNodes] = useState<FlattenNode<DataNode>[]>([]);

  useLayoutEffect(() => {
    const flattenNodes: FlattenNode<DataNode>[] = flattenTreeData<DataNode>(
      mergedTreeData,
      expandedKeys,
      filledFieldNames,
    );
    setFlattenNodes(flattenNodes);
  }, [mergedTreeData, expandedKeys, filledFieldNames]);

  // ===================================== Loading =====================================
  const loadingProps: SpinProps = useMemo(() => {
    if (typeof loading === 'boolean') {
      return {
        spinning: loading || requestLoading,
        className: { wrapper: 'h-full', indicator: 'h-full' },
      };
    }

    return {
      ...loading,
      spinning: loading.spinning || requestLoading,
      className: mergeSemanticCls(
        { wrapper: 'h-full', indicator: 'h-full' },
        loadingProps.className,
      ),
    };
  }, [JSON.stringify(loading), requestLoading]);

  return {
    prefixCls,
    keyEntities,
    treeData: mergedTreeData,
    flattenNodes,
    fieldNames: filledFieldNames,
    showIcon,
    showLine,
    selectable,
    loadingProps,
    multiple,
    expandedKeys,
    checkable,
    checkedKeys,
    halfCheckedKeys,
    checkStrictly,
    selectedKeys,
    virtual: customizeVirtual ?? virtual,
    loadedKeys,
    loadingKeys,
    indent,
    setExpandedKeys,
    setCheckedKeys,
    setHalfCheckedKeys,
    setSelectedKeys,
    allowDrop,
    loadData,
    renderEmpty,
    ...restProps,
  };
}
