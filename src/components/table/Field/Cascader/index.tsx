import React, { useMemo } from 'react';
import type { FieldFC } from '..';
import type { CascaderProps } from '../../../cascader';
import Cascader from '../../../cascader';
import { fieldParsingText } from '../../utils/fieldUtil';

/**
 * 级联选择组件
 */
const FieldCascader: FieldFC<{
  text: string | string[];
  options?: CascaderProps['options'];
  fieldNames?: CascaderProps['fieldNames'];
  editorProps?: Partial<CascaderProps>;
}> = ({ text, renderEditor, mode, render, editorProps, valueEnum, options, fieldNames }, ref) => {
  const optionsValueEnum = useMemo(() => {
    if (mode !== 'read') return;

    const {
      value: valuePropsName = 'value',
      label: labelPropsName = 'label',
      children: childrenPropsName = 'children',
    } = fieldNames || {};

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

    return traverseOptions(options);
  }, [mode, editorProps?.options, editorProps?.fieldNames]);

  if (mode === 'read') {
    const dom = <>{fieldParsingText(text, valueEnum || optionsValueEnum)}</>;

    if (render) {
      return render(text, dom) ?? null;
    }
    return dom;
  }

  if (mode === 'edit') {
    let dom = (
      <Cascader
        ref={ref}
        allowClear={editorProps?.allowClear !== false}
        options={options}
        fieldNames={fieldNames}
        {...editorProps}
      />
    );

    if (renderEditor) {
      dom = renderEditor(text, dom) ?? null;
    }

    return dom;
  }

  return null;
};

export default React.forwardRef(FieldCascader);
