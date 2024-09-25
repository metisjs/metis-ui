import React from 'react';
import type { BasicDataNode, DataNode, EventDataNode, TreeNodeProps } from '../interface';
import { convertNodePropsToEventData } from '../utils/treeUtil';

export default function useEventData<TreeDataType extends BasicDataNode = DataNode>(
  props: TreeNodeProps<TreeDataType>,
): EventDataNode<TreeDataType> {
  const {
    data,
    expanded,
    selected,
    checked,
    loaded,
    loading,
    halfChecked,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    pos,
    active,
    eventKey,
  } = props;
  return React.useMemo(
    () => convertNodePropsToEventData(props),
    [
      data,
      expanded,
      selected,
      checked,
      loaded,
      loading,
      halfChecked,
      dragOver,
      dragOverGapTop,
      dragOverGapBottom,
      pos,
      active,
      eventKey,
    ],
  );
}
