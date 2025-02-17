import React, { useContext } from 'react';
import FieldCascader from './Cascader';
import FieldCheckbox from './Checkbox';
import FieldDatePicker from './DatePicker';
import FieldDigit from './Digit';
import FieldDigitRange from './DigitRange';
import FieldFromNow from './FromNow';
import FieldImage from './Image';
import FieldIndexColumn from './IndexColumn';
import type { FieldMoneyProps } from './Money';
import FieldMoney from './Money';
import FieldPassword from './Password';
import FieldPercent from './Percent';
import FieldProgress from './Progress';
import FieldRadio from './Radio';
import FieldRangePicker from './RangePicker';
import FieldRate from './Rate';
import FieldSegmented from './Segmented';
import FieldSelect, { proFieldParsingValueEnumToArray } from './Select';
import FieldSlider from './Slider';
import FieldSwitch from './Switch';
import FieldText from './Text';
import FieldTextArea from './TextArea';
import FieldTimePicker, { FieldTimeRangePicker } from './TimePicker';
import type { AnyObject } from '@util/type';
import type { ColumnValueEnumMap, ColumnValueEnumObj } from '../interface';

export type BaseFieldFC = {
  /** 值的类型 */
  text: React.ReactNode;
  /**
   * 组件的渲染模式类型
   * @option read 渲染只读模式
   * @option edit 渲染编辑模式
   * */
  mode: FieldFCMode;
  /** 映射值的类型 */
  valueEnum?: ColumnValueEnumMap | ColumnValueEnumObj;
};

export type FieldFCMode = 'read' | 'edit';


export type FieldEmptyText = string | false;

export type RenderFieldPropsType = {
  /**
   * 自定义只读模式的渲染器
   * @params props 关于dom的配置
   * @params dom 默认的 dom
   * @return 返回一个用于读的 dom
   */
  render?:
    | ((
        text: any,
        props: any,
        dom: JSX.Element,
      ) => JSX.Element)
    | undefined;
  /**
   * 一个自定义的编辑渲染器。
   * @params text 默认的值类型
   * @params props 关于dom的配置
   * @params dom 默认的 dom
   * @return 返回一个用于编辑的dom
   */
  renderEditor?:
    | ((
        text: any,
        props: any,
        dom: JSX.Element,
      ) => JSX.Element)
    | undefined;
}

export type FieldFC<T = AnyObject> = React.ForwardRefRenderFunction<
  any,
  BaseFieldFC & RenderFieldPropsType & T
>;


/** Value type by function */
export type FieldValueTypeFunction<T> = (item: T) => FieldValueType | FieldValueObjectType;

type RenderProps = Omit<ProFieldFCRenderProps, 'text' | 'placeholder'> &
  ProRenderFieldPropsType & {
    /** 从服务器读取选项 */
    request?: ProFieldRequestData;
    emptyText?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: any;
  };

/**
 * Render valueType object
 *
 * @param text String | number
 * @param valueType ProColumnsValueObjectType
 */
const defaultRenderTextByObject = (
  text: ProFieldTextType,
  valueType: ProFieldValueObjectType,
  props: RenderProps,
) => {
  const pickFormItemProps = pickProProps(props.fieldProps);
  if (valueType.type === 'progress') {
    return (
      <FieldProgress
        {...props}
        text={text as number}
        fieldProps={{
          status: valueType.status ? valueType.status : undefined,
          ...pickFormItemProps,
        }}
      />
    );
  }
  if (valueType.type === 'money') {
    return (
      <FieldMoney
        locale={valueType.locale}
        {...props}
        fieldProps={pickFormItemProps}
        text={text as number}
        moneySymbol={valueType.moneySymbol}
      />
    );
  }
  if (valueType.type === 'percent') {
    return (
      <FieldPercent
        {...props}
        text={text as number}
        showSymbol={valueType.showSymbol}
        precision={valueType.precision}
        fieldProps={pickFormItemProps}
        showColor={valueType.showColor}
      />
    );
  }

  if (valueType.type === 'image') {
    return <FieldImage {...props} text={text as string} width={valueType.width} />;
  }

  return text as React.ReactNode;
};

/**
 * 根据不同的类型来转化数值
 *
 * @param dataValue
 * @param valueType
 */
const defaultRenderText = (
  dataValue: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>,
): React.ReactNode => {
  const { mode = 'read', emptyText = '-' } = props;

  if (emptyText !== false && mode === 'read' && valueType !== 'option' && valueType !== 'switch') {
    if (typeof dataValue !== 'boolean' && typeof dataValue !== 'number' && !dataValue) {
      const { fieldProps, render } = props;
      if (render) {
        return render(dataValue, { mode, ...fieldProps }, <>{emptyText}</>);
      }
      return <>{emptyText}</>;
    }
  }

  // eslint-disable-next-line no-param-reassign
  delete props.emptyText;

  if (typeof valueType === 'object') {
    return defaultRenderTextByObject(dataValue, valueType, props);
  }

  const customValueTypeConfig = valueTypeMap && valueTypeMap[valueType as string];
  if (customValueTypeConfig) {
    // eslint-disable-next-line no-param-reassign
    delete props.ref;
    if (mode === 'read') {
      return customValueTypeConfig.render?.(
        dataValue,
        {
          text: dataValue as React.ReactNode,
          ...props,
          mode: mode || 'read',
        },
        <>{dataValue as any}</>,
      );
    }
    if (mode === 'update' || mode === 'edit') {
      return customValueTypeConfig.renderFormItem?.(
        dataValue,
        {
          text: dataValue as React.ReactNode,
          ...props,
        },
        <>{dataValue as any}</>,
      );
    }
  }

  /** 如果是金额的值 */
  if (valueType === 'money') {
    return <FieldMoney {...props} text={dataValue as number} />;
  }

  /** 如果是日期的值 */
  if (valueType === 'date') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker text={dataValue as string} format="YYYY-MM-DD" {...props} />
      </FieldHOC>
    );
  }

  /** 如果是周的值 */
  if (valueType === 'dateWeek') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker text={dataValue as string} format="YYYY-wo" picker="week" {...props} />
      </FieldHOC>
    );
  }

  /** 如果是周范围的值 */
  if (valueType === 'dateWeekRange') {
    const { fieldProps, ...otherProps } = props;
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-W"
          showTime
          fieldProps={{
            picker: 'week',
            ...fieldProps,
          }}
          {...otherProps}
        />
      </FieldHOC>
    );
  }

  /** 如果是月范围的值 */
  if (valueType === 'dateMonthRange') {
    const { fieldProps, ...otherProps } = props;
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-MM"
          showTime
          fieldProps={{
            picker: 'month',
            ...fieldProps,
          }}
          {...otherProps}
        />
      </FieldHOC>
    );
  }

  /** 如果是季范围的值 */
  if (valueType === 'dateQuarterRange') {
    const { fieldProps, ...otherProps } = props;
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-Q"
          showTime
          fieldProps={{
            picker: 'quarter',
            ...fieldProps,
          }}
          {...otherProps}
        />
      </FieldHOC>
    );
  }

  /** 如果是年范围的值 */
  if (valueType === 'dateYearRange') {
    const { fieldProps, ...otherProps } = props;
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY"
          showTime
          fieldProps={{
            picker: 'year',
            ...fieldProps,
          }}
          {...otherProps}
        />
      </FieldHOC>
    );
  }

  /** 如果是月的值 */
  if (valueType === 'dateMonth') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker text={dataValue as string} format="YYYY-MM" picker="month" {...props} />
      </FieldHOC>
    );
  }

  /** 如果是季度的值 */
  if (valueType === 'dateQuarter') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-[Q]Q"
          picker="quarter"
          {...props}
        />
      </FieldHOC>
    );
  }

  /** 如果是年的值 */
  if (valueType === 'dateYear') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker text={dataValue as string} format="YYYY" picker="year" {...props} />
      </FieldHOC>
    );
  }

  /** 如果是日期范围的值 */
  if (valueType === 'dateRange') {
    return <FieldRangePicker text={dataValue as string[]} format="YYYY-MM-DD" {...props} />;
  }

  /** 如果是日期加时间类型的值 */
  if (valueType === 'dateTime') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          {...props}
        />
      </FieldHOC>
    );
  }

  /** 如果是日期加时间类型的值的值 */
  if (valueType === 'dateTimeRange') {
    // 值不存在的时候显示 "-"
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          {...props}
        />
      </FieldHOC>
    );
  }

  /** 如果是时间类型的值 */
  if (valueType === 'time') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldTimePicker text={dataValue as string} format="HH:mm:ss" {...props} />
      </FieldHOC>
    );
  }

  /** 如果是时间类型的值 */
  if (valueType === 'timeRange') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldTimeRangePicker text={dataValue as string[]} format="HH:mm:ss" {...props} />
      </FieldHOC>
    );
  }

  if (valueType === 'fromNow') {
    return <FieldFromNow text={dataValue as string} {...props} />;
  }

  if (valueType === 'index') {
    return <FieldIndexColumn>{(dataValue as number) + 1}</FieldIndexColumn>;
  }

  if (valueType === 'indexBorder') {
    return <FieldIndexColumn border>{(dataValue as number) + 1}</FieldIndexColumn>;
  }

  if (valueType === 'progress') {
    return <FieldProgress {...props} text={dataValue as number} />;
  }
  /** 百分比, 默认展示符号, 不展示小数位 */
  if (valueType === 'percent') {
    return <FieldPercent text={dataValue as number} {...props} />;
  }

  if (valueType === 'avatar' && typeof dataValue === 'string' && props.mode === 'read') {
    return <Avatar src={dataValue as string} size={22} shape="circle" />;
  }

  if (valueType === 'textarea') {
    return <FieldTextArea text={dataValue as string} {...props} />;
  }

  if (valueType === 'digit') {
    return <FieldDigit text={dataValue as number} {...props} />;
  }

  if (valueType === 'digitRange') {
    return <FieldDigitRange text={dataValue as number[]} {...props} />;
  }

  if (valueType === 'select' || (valueType === 'text' && (props.valueEnum || props.request))) {
    return (
      <FieldHOC isLight={props.light}>
        <FieldSelect text={dataValue as string} {...props} />
      </FieldHOC>
    );
  }

  if (valueType === 'checkbox') {
    return <FieldCheckbox text={dataValue as string} {...props} />;
  }

  if (valueType === 'radio') {
    return <FieldRadio text={dataValue as string} {...props} />;
  }

  if (valueType === 'rate') {
    return <FieldRate text={dataValue as string} {...props} />;
  }
  if (valueType === 'slider') {
    return <FieldSlider text={dataValue as string} {...props} />;
  }
  if (valueType === 'switch') {
    return <FieldSwitch text={dataValue as boolean} {...props} />;
  }

  if (valueType === 'password') {
    return <FieldPassword text={dataValue as string} {...props} />;
  }

  if (valueType === 'image') {
    return <FieldImage text={dataValue as string} {...props} />;
  }
  if (valueType === 'cascader') {
    return <FieldCascader text={dataValue as string} {...props} />;
  }

  if (valueType === 'segmented') {
    return <FieldSegmented text={dataValue as string} {...props} />;
  }

  return <FieldText text={dataValue as string} {...props} />;
};

export {
  defaultRenderText,
  FieldDatePicker,
  FieldIndexColumn,
  FieldMoney,
  FieldPercent,
  FieldProgress,
  FieldRangePicker,
  FieldSelect,
  FieldStatus,
  FieldText,
  FieldTimePicker,
  proFieldParsingValueEnumToArray,
};
export type { FieldMoneyProps, ProFieldValueType };

export type ProFieldPropsType = {
  text?: ProFieldTextType;
  valueType?: ProFieldValueType | ProFieldValueObjectType;
} & RenderProps;

const ProFieldComponent: React.ForwardRefRenderFunction<any, ProFieldPropsType> = (
  {
    text,
    valueType = 'text',
    mode = 'read',
    onChange,
    renderFormItem,
    value,
    readonly,
    fieldProps: restFieldProps,
    ...rest
  },
  ref: any,
) => {
  const context = useContext(ProConfigContext);

  const onChangeCallBack = useRefFunction((...restParams: any[]) => {
    restFieldProps?.onChange?.(...restParams);
    onChange?.(...restParams);
  });

  const fieldProps: any = useDeepCompareMemo(() => {
    return (
      (value !== undefined || restFieldProps) && {
        value,
        // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
        ...omitUndefined(restFieldProps),
        onChange: onChangeCallBack,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, restFieldProps, onChangeCallBack]);

  const renderedDom = defaultRenderText(
    mode === 'edit' ? (fieldProps?.value ?? text ?? '') : (text ?? fieldProps?.value ?? ''),
    valueType || 'text',
    omitUndefined({
      ref,
      ...rest,
      mode: readonly ? 'read' : mode,
      renderFormItem: renderFormItem
        ? (curText: any, props: ProFieldFCRenderProps, dom: JSX.Element) => {
            const { placeholder: _placeholder, ...restProps } = props;
            const newDom = renderFormItem(curText, restProps, dom);
            // renderFormItem 之后的dom可能没有props，这里会帮忙注入一下
            if (React.isValidElement(newDom))
              return React.cloneElement(newDom, {
                ...fieldProps,
                ...((newDom.props as any) || {}),
              });
            return newDom;
          }
        : undefined,
      placeholder: renderFormItem ? undefined : (rest?.placeholder ?? fieldProps?.placeholder),
      fieldProps: pickProProps(
        omitUndefined({
          ...fieldProps,
          placeholder: renderFormItem ? undefined : (rest?.placeholder ?? fieldProps?.placeholder),
        }),
      ),
    }),
    context.valueTypeMap || {},
  );

  return <React.Fragment>{renderedDom}</React.Fragment>;
};

export const ProField = React.forwardRef(ProFieldComponent as any) as typeof ProFieldComponent;

export default ProField;
