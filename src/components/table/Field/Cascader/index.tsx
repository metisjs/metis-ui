import React, { useMemo } from 'react';
import type { FieldFC } from '..';
import type { CascaderProps } from '../../../cascader';
import Cascader from '../../../cascader';
import { fieldParsingText, objectToMap } from '../../utils/fieldUtil';

/**
 * 级联选择组件
 */
const FieldCascader: FieldFC<{
  text: string | string[];
  fieldProps?: CascaderProps;
}> = ({ text, renderEditor, mode, render, fieldProps, valueEnum }, ref) => {
  const optionsValueEnum = useMemo(() => {
    if (mode !== 'read') return;

    const {
      value: valuePropsName = 'value',
      label: labelPropsName = 'label',
      children: childrenPropsName = 'children',
    } = fieldProps?.fieldNames || {};

    const valuesMap = new Map();

    const traverseOptions = (_options: CascaderProps['options']) => {
      if (!_options?.length) {
        return valuesMap;
      }

      const length = _options.length;
      let i = 0;
      while (i < length) {
        const cur = _options[i++];
        valuesMap.set(cur[valuePropsName], cur[labelPropsName]);
        traverseOptions(cur[childrenPropsName]);
      }
      return valuesMap;
    };

    return traverseOptions(fieldProps?.options);
  }, [mode, fieldProps?.options, fieldProps?.fieldNames]);

  if (mode === 'read') {
    const dom = <>{fieldParsingText(text, objectToMap(valueEnum || optionsValueEnum))}</>;

    if (render) {
      return render(text, { mode, ...fieldProps }, dom) ?? null;
    }
    return dom;
  }

  if (mode === 'edit') {
    let dom = <Cascader ref={ref} allowClear={fieldProps?.allowClear !== false} {...fieldProps} />;

    if (renderEditor) {
      dom = renderEditor(text, { mode, ...fieldProps }, dom) ?? null;
    }

    return dom;
  }

  return null;
};

export default React.forwardRef(FieldCascader);
