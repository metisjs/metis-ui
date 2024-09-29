import { useContext, useMemo } from 'react';
import { ConfigContext } from 'metis-ui/es/config-provider';
import { useMergedState } from 'rc-util';
import type { DataNode, Key, KeyEntities } from '../interface';
import { TRANSITION_KEY, TransitionEntity } from '../NodeList';
import type { InternalTreeProps } from '../Tree';
import { conductCheck, isCheckDisabled } from '../utils/conductUtil';
import { conductExpandParent, parseCheckedKeys } from '../utils/miscUtil';
import { convertDataToEntities, fillFieldNames } from '../utils/treeUtil';

export default function useFilledProps({
  prefixCls: customizePrefixCls,
  treeData,
  fieldNames,
  showIcon = true,
  selectable = true,
  itemHeight = 32,
  defaultExpandedKeys = [],
  expandedKeys: customizeExpandedKeys,
  autoExpandParent,
  defaultExpandAll,
  checkable,
  defaultCheckedKeys = [],
  checkedKeys: customizeCheckedKeys,
  checkStrictly,
  defaultSelectedKeys = [],
  selectedKeys: customizeSelectedKeys,
  virtual: customizeVirtual,
  allowDrop = () => true,
  ...restProps
}: InternalTreeProps) {
  const { getPrefixCls, virtual } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('tree', customizePrefixCls);

  const mergedTreeData = useMemo(() => treeData || [], [treeData]);

  const filledFieldNames = useMemo(() => fillFieldNames(fieldNames), [JSON.stringify(fieldNames)]);

  // ===================================== KeyEntities =====================================
  const keyEntities = useMemo(() => {
    const entitiesMap = convertDataToEntities(mergedTreeData, {
      fieldNames: filledFieldNames,
    });
    return {
      [TRANSITION_KEY]: TransitionEntity,
      ...entitiesMap.keyEntities,
    } as KeyEntities<DataNode>;
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
      Object.entries(keyEntities).forEach(([key, entity]) => {
        if (key !== TRANSITION_KEY && entity.children && entity.children.length) {
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
  const [selectedKeys, setSelectedKeys] = useMergedState(defaultSelectedKeys, {
    value: customizeSelectedKeys,
  });

  return {
    prefixCls,
    keyEntities,
    treeData: mergedTreeData,
    fieldNames: filledFieldNames,
    showIcon,
    selectable,
    expandedKeys,
    checkable,
    checkedKeys,
    halfCheckedKeys,
    checkStrictly,
    selectedKeys,
    virtual: customizeVirtual ?? virtual,
    itemHeight,
    setExpandedKeys,
    setCheckedKeys,
    setHalfCheckedKeys,
    setSelectedKeys,
    allowDrop,
    ...restProps,
  };
}
