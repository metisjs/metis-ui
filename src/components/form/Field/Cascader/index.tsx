import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { FieldFC, FieldProps } from '..';
import type { CascaderProps, DefaultOptionType } from '../../../cascader';
import Cascader from '../../../cascader';
import Spin from '../../../spin';
import { fieldParsingOptions, fieldParsingText } from '../util';

export type FieldCascaderProps = {
  text: string | string[];
  options?: CascaderProps['options'];
  fieldNames?: CascaderProps['fieldNames'];
  editorProps?: Partial<CascaderProps>;
};

/**
 * 级联选择组件
 */
const FieldCascader: FieldFC<FieldCascaderProps> = (
  { text, renderEditor, mode, render, editorProps, valueEnum, options, fieldNames, loading },
  ref,
) => {
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
  }, [mode, editorProps?.fieldNames]);

  if (mode === 'read') {
    if (loading) {
      return <Spin size="small" />;
    }

    const dom: ReactNode = fieldParsingText(text, valueEnum || optionsValueEnum);

    if (render) {
      return render(text, dom) ?? null;
    }
    return dom;
  }

  if (mode === 'edit') {
    let dom: ReactNode = (
      <Cascader
        loading={loading}
        ref={ref}
        allowClear={editorProps?.allowClear !== false}
        options={(fieldParsingOptions(valueEnum) as any[]) ?? options}
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

export default React.forwardRef(FieldCascader) as unknown as <
  OptionType extends DefaultOptionType = DefaultOptionType,
  MultipleType extends boolean = false,
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
>(
  props: FieldProps<{
    text: string | string[];
    options?: CascaderProps<OptionType>['options'];
    fieldNames?: CascaderProps<OptionType>['fieldNames'];
    editorProps?: Partial<CascaderProps<OptionType, MultipleType, ShowSearchType, LazyLoadType>>;
  }> & {
    ref?: React.Ref<any>;
  },
) => React.ReactElement;
