import { InternalFieldNames } from '../Cascader';
import type { GetEntities } from '../hooks/useEntities';
import type {
  DefaultOptionType,
  LabeledValueType,
  ShowCheckedStrategy,
  SingleValueType,
} from '../interface';
import { SHOW_CHILD, toPathKeys, toRawValueCells } from './commonUtil';

export function formatStrategyValues(
  values: LabeledValueType[],
  getKeyPathEntities: GetEntities,
  showCheckedStrategy?: ShowCheckedStrategy,
): LabeledValueType[] {
  if (!values || !values.length) {
    return [];
  }

  const pathKeys: React.Key[] = toPathKeys(toRawValueCells(values));
  const valueSet = new Set(pathKeys);
  const keyPathEntities = getKeyPathEntities();

  return values.filter((_, i) => {
    const key = pathKeys[i];
    const entity = keyPathEntities[key];
    const parent = entity ? entity.parent : null;
    const children = entity ? entity.children : null;

    if (entity && entity.node.disabled) {
      return true;
    }

    return showCheckedStrategy === SHOW_CHILD
      ? !(children && children.some((child) => child.key && valueSet.has(child.key)))
      : !(parent && !parent.node.disabled && valueSet.has(parent.key));
  });
}

export function toPathOptions(
  valueCells: SingleValueType,
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  // Used for loadingKeys which saved loaded keys as string
  stringMode = false,
) {
  let currentList = options;
  const valueOptions: {
    value: SingleValueType[number];
    index: number;
    option: DefaultOptionType | null;
  }[] = [];

  for (let i = 0; i < valueCells.length; i += 1) {
    const valueCell = valueCells[i];
    const foundIndex = currentList?.findIndex((option) => {
      const val = option[fieldNames.value];
      return stringMode ? String(val) === String(valueCell) : val === valueCell;
    });
    const foundOption = foundIndex !== -1 ? currentList?.[foundIndex] : null;

    valueOptions.push({
      value: foundOption?.[fieldNames.value] ?? valueCell,
      index: foundIndex,
      option: foundOption,
    });

    currentList = foundOption?.[fieldNames.children];
  }

  return valueOptions;
}
