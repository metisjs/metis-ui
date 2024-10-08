import type { RawValueType } from '../../select/interface';
import type { InternalFieldNames } from '../Cascader';
import { SEARCH_MARK } from '../hooks/useFilterOptions';
import type {
  DefaultOptionType,
  DraftValueType,
  FieldNames,
  LabeledValueType,
  MultiValueType,
  SingleValueType,
} from '../interface';

export const VALUE_SPLIT = '__CASCADER_SPLIT__';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';

/**
 * Will convert value to string, and join with `VALUE_SPLIT`
 */
export function toPathKey(value: SingleValueType) {
  return value.join(VALUE_SPLIT);
}

/**
 * Batch convert value to string, and join with `VALUE_SPLIT`
 */
export function toPathKeys(value: MultiValueType) {
  return value.map(toPathKey);
}

export function toPathValueStr(pathKey: string) {
  return pathKey.split(VALUE_SPLIT);
}

export function fillFieldNames(fieldNames?: FieldNames): InternalFieldNames {
  const { label, value, children, disabled, leaf } = fieldNames || {};
  const val = value || 'value';
  return {
    label: label || 'label',
    value: val,
    key: val as string,
    children: children || 'children',
    disabled: disabled || 'disabled',
    leaf: leaf || 'leaf',
  };
}

export function isLeaf(option: DefaultOptionType, fieldNames: InternalFieldNames) {
  return option[fieldNames.leaf] ?? !option[fieldNames.children]?.length;
}

export function scrollIntoParentView(element: HTMLElement) {
  const parent = element.parentElement;
  if (!parent) {
    return;
  }

  const elementToParent = element.offsetTop - parent.offsetTop; // offsetParent may not be parent.
  if (elementToParent - parent.scrollTop < 0) {
    parent.scrollTo({ top: elementToParent });
  } else if (elementToParent + element.offsetHeight - parent.scrollTop > parent.offsetHeight) {
    parent.scrollTo({ top: elementToParent + element.offsetHeight - parent.offsetHeight });
  }
}

export function getFullPathKeys(options: DefaultOptionType[], fieldNames: FieldNames) {
  return options.map((item) =>
    item[SEARCH_MARK]?.map((opt: Record<string, any>) => opt[fieldNames.value as string]),
  );
}

function isMultipleValue(
  value: DraftValueType,
): value is (SingleValueType | DefaultOptionType[] | LabeledValueType)[] {
  return Array.isArray(value) && Array.isArray(value[0]);
}

export function toMultipleValue(
  value?: DraftValueType,
): (SingleValueType | DefaultOptionType[] | LabeledValueType)[] {
  if (!value) {
    return [];
  }

  if (isMultipleValue(value)) {
    return value;
  }

  return (value.length === 0 ? [] : [value]).map((val) => (Array.isArray(val) ? val : [val]));
}

export function isRawValues(
  value?: RawValueType[] | DefaultOptionType[] | LabeledValueType,
): value is RawValueType[] {
  return !value || typeof value[0] !== 'object';
}

export function toRawValueCell(value: LabeledValueType | RawValueType[]): RawValueType[] {
  return isRawValues(value) ? value : value.map(({ value }) => value);
}

export function toRawValueCells(values: (LabeledValueType | RawValueType[])[]): RawValueType[][] {
  return values.map(toRawValueCell);
}
