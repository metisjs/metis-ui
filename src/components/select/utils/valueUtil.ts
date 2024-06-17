import type {
  BaseOptionType,
  DefaultOptionType,
  FieldNames,
  FlattenOptionData,
  RawValueType,
} from '../interface';

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
  const { label, value, options, groupLabel } = fieldNames || {};

  return {
    label: label ?? 'label',
    value: value ?? 'value',
    options: options ?? 'options',
    groupLabel: groupLabel ?? label ?? 'label',
  };
}

/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */
export function flattenOptions<OptionType extends BaseOptionType = DefaultOptionType>(
  options: OptionType[],
  fieldNames?: FieldNames<OptionType>,
): FlattenOptionData<OptionType>[] {
  const flattenList: FlattenOptionData<OptionType>[] = [];

  const {
    label: fieldLabel,
    value: fieldValue,
    options: fieldOptions,
    groupLabel,
  } = fillFieldNames(fieldNames);

  function dig(list: OptionType[], isGroupOption: boolean) {
    list.forEach((data) => {
      if (isGroupOption || !(fieldOptions in data)) {
        const value = data[fieldValue];

        // Option
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data,
          label: data[fieldLabel],
          value,
        });
      } else {
        let grpLabel = data[groupLabel];
        if (grpLabel === undefined && childrenAsData) {
          grpLabel = data.label;
        }

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
