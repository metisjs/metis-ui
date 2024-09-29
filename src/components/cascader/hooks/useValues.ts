import * as React from 'react';
import { useMergedState } from 'rc-util';
import type { DataEntity } from '../../tree/interface';
import { conductCheck } from '../../tree/utils/conductUtil';
import type { InternalFieldNames, InternalValueType } from '../Cascader';
import type {
  DefaultOptionType,
  DraftValueType,
  LabeledValueType,
  MultiValueType,
  SingleValueType,
} from '../interface';
import { isRawValues, toMultipleValue, toPathKeys, toRawValueCells } from '../utils/commonUtil';
import type { toPathOptions } from '../utils/treeUtil';

export default function useValues(
  multiple: boolean,
  defaultValue: InternalValueType | undefined,
  value: InternalValueType | undefined,
  fieldNames: InternalFieldNames,
  getPathOptions: (valueCells: SingleValueType) => ReturnType<typeof toPathOptions>,
  getPathKeyEntities: () => Record<string, DataEntity>,
  getValueByKeyPath: (pathKeys: React.Key[]) => MultiValueType,
): [
  checkedValues: LabeledValueType[],
  halfCheckedValues: LabeledValueType[],
  missingCheckedValues: LabeledValueType[],
  setLabeledValues: (values?: DraftValueType) => void,
  toLabeledValues: (draftValues: DraftValueType) => LabeledValueType[],
] {
  const toLabeledValues = React.useCallback(
    (draftValues: DraftValueType): LabeledValueType[] => {
      const valueList = toMultipleValue(draftValues);

      return valueList.map((values) => {
        const rawValueCells = isRawValues(values)
          ? values
          : values.map((val) => (val as DefaultOptionType)[fieldNames.value] ?? val.value);
        const pathOptions = getPathOptions(rawValueCells);

        return pathOptions.map(({ value: rawValue, option }, i) => {
          const missing = !option;
          // 当 value 为 DefaultOptionType, 且 option 中不存在 value 时，使用 value 作为 option用于显示
          const mergedOption = option ?? (values[i] as DefaultOptionType);

          const rawKey = mergedOption.key ?? rawValue;
          const rawLabel = mergedOption[fieldNames.label];
          const rawDisabled = mergedOption[fieldNames.disabled];

          return {
            label: rawLabel,
            value: rawValue,
            key: rawKey,
            disabled: rawDisabled,
            option: mergedOption,
            missing,
          };
        });
      });
    },
    [fieldNames, getPathOptions],
  );

  const [labeledValues, setLabeledValues] = useMergedState<
    DraftValueType | undefined,
    LabeledValueType[]
  >(defaultValue, { value, postState: toLabeledValues });

  const getMissingValues = React.useCallback(() => {
    const missingValues: LabeledValueType[] = [];
    const existsValues: LabeledValueType[] = [];

    labeledValues.forEach((labeledValue) => {
      if (labeledValue.every((opt) => !opt.missing)) {
        existsValues.push(labeledValue);
      } else {
        missingValues.push(labeledValue);
      }
    });

    return [existsValues, missingValues];
  }, [labeledValues]);

  const isCheckDisabled = React.useCallback(
    (node: DefaultOptionType) => !!node[fieldNames.disabled],
    [fieldNames],
  );

  const [checkedValues, halfCheckedValues, missingCheckedValues] = React.useMemo(() => {
    const [existValues, missingValues] = getMissingValues();

    if (!multiple || !labeledValues.length) {
      return [existValues, [], missingValues];
    }

    const keyPathValues = toPathKeys(toRawValueCells(existValues));
    const keyPathEntities = getPathKeyEntities();

    const { checkedKeys, halfCheckedKeys } = conductCheck(
      keyPathValues,
      true,
      keyPathEntities,
      isCheckDisabled,
    );

    return [
      toLabeledValues(getValueByKeyPath(checkedKeys)),
      toLabeledValues(getValueByKeyPath(halfCheckedKeys)),
      missingValues,
    ];
  }, [
    multiple,
    labeledValues,
    getPathKeyEntities,
    getValueByKeyPath,
    getMissingValues,
    isCheckDisabled,
  ]);

  return [
    checkedValues,
    halfCheckedValues,
    missingCheckedValues,
    setLabeledValues,
    toLabeledValues,
  ];
}
