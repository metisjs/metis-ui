import warning, { noteOnce } from '../../_util/warning';
import { isMultiple } from '../BaseSelect';
import type { BaseSelectProps } from '../Select';
import type {
  BaseOptionType,
  DefaultOptionType,
  FieldNames,
  LabelInValueType,
  RawValueType,
} from '../interface';
import { toArray } from './commonUtil';

function warningProps(props: BaseSelectProps) {
  const {
    mode,
    combobox,
    options,
    showSearch,
    onSearch,
    defaultOpen,
    autoFocus,
    labelInValue,
    value,
    optionLabelProp,
  } = props;

  const multiple = isMultiple(mode);

  // `tags` should not set option as disabled
  warning(
    mode !== 'tags' || options.every((opt: { disabled?: boolean }) => !opt.disabled),
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
      !labelInValue ||
        values.every((val) => typeof val === 'object' && ('key' in val || 'value' in val)),
      '`value` should in shape of `{ value: string | number, label?: ReactNode }` when you set `labelInValue` to `true`',
    );

    warning(
      !multiple || Array.isArray(value),
      '`value` should be array when `mode` is `multiple` or `tags`',
    );
  }
}

// value in Select option should not be null
// note: OptGroup has options too
export function warningNullOptions(options?: DefaultOptionType[], fieldNames?: FieldNames) {
  if (options) {
    const recursiveOptions = (optionsList: DefaultOptionType[], inGroup: boolean = false) => {
      for (let i = 0; i < optionsList.length; i++) {
        const option = optionsList[i];

        if (option[fieldNames?.value ?? ''] === null) {
          warning(false, '`value` in Select options should not be `null`.');
          return true;
        }

        if (
          !inGroup &&
          Array.isArray(option[fieldNames?.options ?? '']) &&
          recursiveOptions(option[fieldNames?.options ?? ''], true)
        ) {
          break;
        }
      }
    };

    recursiveOptions(options);
  }
}

export default warningProps;
