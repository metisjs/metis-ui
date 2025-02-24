import React, { useMemo } from 'react';
import type { FieldFC, FieldProps } from '..';
import type { SelectProps } from '../../../select';
import Select from '../../../select';
import type { BaseOptionType, RawValueType } from '../../../select/interface';
import { fieldParsingOptions, fieldParsingText } from '../util';

/**
 * Select 组件
 */
const FieldSelect: FieldFC<{
  text: string | number;
  editorProps?: Partial<SelectProps>;
}> = ({ text, mode, valueEnum, render, renderEditor, editorProps }, ref) => {
  const optionsValueEnum = useMemo(() => {
    if (mode !== 'read') return;

    const {
      value: valuePropsName = 'value',
      label: labelPropsName = 'label',
      options: optionsPropsName = 'options',
    } = editorProps?.fieldNames || {};

    const valuesMap = new Map();

    const traverseOptions = (_options: SelectProps['options']) => {
      if (!_options?.length) {
        return valuesMap;
      }
      const length = _options.length;
      let i = 0;
      while (i < length) {
        const cur = _options[i++];
        valuesMap.set(cur[valuePropsName], cur[labelPropsName]);
        traverseOptions(cur[optionsPropsName]);
      }
      return valuesMap;
    };

    return traverseOptions(editorProps?.options);
  }, [mode, editorProps?.options, editorProps?.fieldNames]);

  if (mode === 'read') {
    const dom = <>{fieldParsingText(text, valueEnum || optionsValueEnum)}</>;

    if (render) {
      return render(text, dom) ?? null;
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = (
      <Select
        ref={ref}
        allowClear
        options={fieldParsingOptions(valueEnum)}
        {...editorProps}
        style={{
          minWidth: 120,
          ...editorProps?.style,
        }}
      />
    );
    if (renderEditor) {
      return renderEditor(text, dom) ?? null;
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldSelect) as unknown as <
  ValueType extends RawValueType = RawValueType,
  OptionType extends BaseOptionType = BaseOptionType,
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
>(
  props: FieldProps<{
    text: string | string[];
    editorProps?: Partial<
      SelectProps<ValueType, OptionType, ModeType, ShowSearchType, LazyLoadType>
    >;
  }> & {
    ref?: React.Ref<any>;
  },
) => React.ReactElement;
