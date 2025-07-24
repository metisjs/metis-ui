import type { ReactNode } from 'react';
import React from 'react';
import toArray from '@util/toArray';
import type { BaseOptionType } from 'metis-ui/es/cascader';
import type { RawValueType } from 'metis-ui/es/select/interface';
import type { FieldFC, FieldProps } from '..';
import type { SelectProps } from '../../../select';
import Select from '../../../select';
import Space from '../../../space';
import Spin from '../../../spin';
import type { TagProps } from '../../../tag';
import Tag from '../../../tag';
import type { FieldStatusType } from '../../interface';
import { fieldParsingOptions, objectToMap } from '../util';

export type FieldTagProps = {
  text: string | string[];
  editorProps?: Partial<SelectProps>;
} & Partial<TagProps>;

const FieldTag: FieldFC<FieldTagProps> = (
  { text, renderEditor, mode, render, editorProps, valueEnum, loading, ...restProps },
  ref,
) => {
  if (mode === 'read') {
    if (loading) {
      return <Spin size="small" />;
    }

    const valueEnumMap = objectToMap(valueEnum);
    const tags = toArray(text);

    const dom = (
      <Space>
        {tags.map((tag) => {
          if (!valueEnumMap.has(tag) && !valueEnumMap.has(`${tag}`)) {
            // @ts-ignore
            return <Tag key={tag}>{tag?.label || tag}</Tag>;
          }

          const domText = (valueEnumMap.get(tag) || valueEnumMap.get(`${tag}`)) as unknown as {
            label: ReactNode;
            status: FieldStatusType;
            color?: string;
          };

          return (
            <Tag color={domText.color ?? domText.status} key={tag} {...restProps}>
              {/* @ts-ignore */}
              {domText.label ?? domText}
            </Tag>
          );
        })}
      </Space>
    );

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
        loading={loading}
        options={fieldParsingOptions(valueEnum)}
        {...editorProps}
      />
    );
    if (renderEditor) {
      return renderEditor(text, dom) ?? null;
    }
    return dom;
  }

  return null;
};

export default React.forwardRef(FieldTag) as unknown as <
  ValueType extends RawValueType = RawValueType,
  OptionType extends BaseOptionType = BaseOptionType,
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
>(
  props: FieldProps<
    {
      text: string | string[];
      editorProps?: SelectProps<ValueType, OptionType, ModeType, ShowSearchType, LazyLoadType>;
    } & Partial<TagProps>
  > & {
    ref?: React.Ref<any>;
  },
) => React.ReactElement;
