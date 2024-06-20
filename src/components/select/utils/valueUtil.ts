import type { BaseOptionType, FieldNames, FlattenOptionData, RawValueType } from '../interface';

function getKey(data: BaseOptionType, index: number) {
  const { key } = data;
  let value: RawValueType | undefined = undefined;

  if ('value' in data) {
    ({ value } = data);
  }

  if (key !== null && key !== undefined) {
    return key;
  }
  if (value !== undefined) {
    return value;
  }
  return `metis-index-key-${index}`;
}

export function fillFieldNames(fieldNames: FieldNames<BaseOptionType> | undefined) {
  const { label, value, options, groupLabel, disabled } = fieldNames || {};

  return {
    label: label ?? 'label',
    value: value ?? 'value',
    options: options ?? 'options',
    groupLabel: groupLabel ?? label ?? 'label',
    disabled: disabled ?? 'disabled',
  };
}

export function getFieldValue(
  option: BaseOptionType,
  fieldName: FieldNames<BaseOptionType>['label' | 'value' | 'groupLabel' | 'disabled'],
) {
  if (typeof fieldName === 'string') {
    return option[fieldName];
  }

  if (typeof fieldName === 'function') {
    return fieldName(option);
  }

  return null;
}

/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */
export function flattenOptions<OptionType extends BaseOptionType = BaseOptionType>(
  options: OptionType[],
  fieldNames?: FieldNames<OptionType>,
): FlattenOptionData<OptionType>[] {
  const flattenList: FlattenOptionData<OptionType>[] = [];

  const {
    label: fieldLabel,
    value: fieldValue,
    options: fieldOptions,
    disabled: fieldDisabled,
    groupLabel,
  } = fillFieldNames(fieldNames);

  function dig(list: OptionType[], isGroupOption: boolean) {
    list.forEach((data) => {
      if (isGroupOption || !(fieldOptions in data)) {
        const value = getFieldValue(data, fieldValue);

        // Option
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data,
          label: getFieldValue(data, fieldLabel),
          value,
          disabled: getFieldValue(data, fieldDisabled),
        });
      } else {
        const grpLabel = getFieldValue(data, groupLabel);

        // Option Group
        flattenList.push({
          key: getKey(data, flattenList.length),
          group: true,
          data,
          label: grpLabel,
        });

        dig(data[fieldOptions], true);
      }
    });
  }

  dig(options, false);

  return flattenList;
}

export function getSeparatedContent(text: string, tokens?: string[]) {
  if (!tokens || !tokens.length) {
    return null;
  }

  let match = false;

  function separate(str: string, [token, ...restTokens]: string[]): string[] {
    if (!token) {
      return [str];
    }

    const list = str.split(token);
    match = match || list.length > 1;

    return list
      .reduce((prevList, unitStr) => [...prevList, ...separate(unitStr, restTokens)], [])
      .filter((unit) => unit);
  }

  const list = separate(text, tokens);
  return match ? list : null;
}
