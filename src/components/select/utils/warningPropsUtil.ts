import warning, { noteOnce } from '../../_util/warning';
import { isMultiple } from '../BaseSelect';
import type {
  BaseOptionType,
  FieldNames,
  LabelInValueType,
  RawValueType,
  SelectProps,
} from '../interface';
import { toArray } from './commonUtil';
import { fillFieldNames, getFieldValue } from './valueUtil';

function warningProps(props: SelectProps) {
  const {
    mode,
    combobox,
    options,
    showSearch,
    onSearch,
    defaultOpen,
    autoFocus,
    optionInValue,
    value,
    optionLabelProp,
  } = props;

  const multiple = isMultiple(mode);

  // `tags` should not set option as disabled
  warning(
    mode !== 'tags' || options.every((opt) => !opt.disabled),
    'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
  );

  // `combobox` & `tags` should option be `string` type
  if (mode === 'tags' || combobox) {
    const hasNumberValue = options.some((item) => {
      if (item.options) {
        return item.options.some(
          (opt: BaseOptionType) => typeof ('value' in opt ? opt.value : opt.key) === 'number',
        );
      }
      return typeof ('value' in item ? item.value : item.key) === 'number';
    });

    warning(!hasNumberValue, '`value` of Option should not use number type when `mode` is `tags`');
  }

  // `combobox` should not use `optionLabelProp`
  warning(
    !combobox || !optionLabelProp,
    '`combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.',
  );

  // `onSearch` should use in `combobox` or `showSearch`
  if (onSearch && !showSearch && !combobox && mode !== 'tags') {
    warning(false, '`onSearch` should work with `showSearch` instead of use alone.');
  }

  noteOnce(
    !defaultOpen || !!autoFocus,
    '`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autoFocus` if needed.',
  );

  if (value !== undefined && value !== null) {
    const values = toArray<RawValueType | LabelInValueType>(value);
    warning(
      !optionInValue || values.every((val) => typeof val === 'object'),
      '`value` should in shape of `OptionType` when you set `optionInValue` to `true`',
    );

    warning(
      !multiple || Array.isArray(value),
      '`value` should be array when `mode` is `multiple` or `tags`',
    );
  }
}

export function warningNullOptions(
  options?: BaseOptionType[],
  fieldNames?: FieldNames<BaseOptionType>,
) {
  if (options) {
    const { value: fieldValue, options: fieldOptions } = fillFieldNames(fieldNames);

    const recursiveOptions = (optionsList: BaseOptionType[], inGroup: boolean = false) => {
      for (let i = 0; i < optionsList.length; i++) {
        const option = optionsList[i];

        if (getFieldValue(option, fieldValue) === null) {
          warning(false, '`value` in Select options should not be `null`.');
          return true;
        }

        if (
          !inGroup &&
          Array.isArray(getFieldValue(option, fieldOptions)) &&
          recursiveOptions(getFieldValue(option, fieldOptions), true)
        ) {
          break;
        }
      }
    };

    recursiveOptions(options);
  }
}

export default warningProps;
