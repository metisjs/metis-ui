import React, { useState } from 'react';
import type { AnyObject } from '@util/type';
import { useRequest } from 'ahooks';
import omit from 'rc-util/lib/omit';
import Avatar from '../../avatar';
import type {
  FieldValueEnumMap,
  FieldValueEnumObj,
  FieldValueEnumRequestType,
  FieldValueObject,
  FieldValueType,
  RequestDataType,
} from '../interface';
import FieldCascader from './Cascader';
import FieldCheckbox from './Checkbox';
import FieldDatePicker from './DatePicker';
import FieldDateRangePicker from './DateRangePicker';
import FieldDigit from './Digit';
import FieldFromNow from './FromNow';
import FieldImage from './Image';
import FieldIndexColumn from './IndexColumn';
import FieldMoney from './Money';
import FieldPassword from './Password';
import FieldPercent from './Percent';
import FieldProgress from './Progress';
import FieldRadio from './Radio';
import FieldRate from './Rate';
import FieldSegmented from './Segmented';
import FieldSelect from './Select';
import FieldSlider from './Slider';
import FieldSwitch from './Switch';
import FieldTag from './Tag';
import FieldText from './Text';
import FieldTextArea from './TextArea';
import FieldTimePicker from './TimePicker';
import FieldTimeRangePicker from './TimeRangePicker';
import { isValueEnumWithRequest } from './util';

export type BaseFieldProps = {
  /** 值的类型 */
  text: React.ReactNode;
  /**
   * 组件的渲染模式类型
   * @option read 渲染只读模式
   * @option edit 渲染编辑模式
   * */
  mode: FieldMode;
  /** 映射值的类型 */
  valueEnum?: FieldValueEnumMap | FieldValueEnumObj;
  editorProps?: AnyObject;
  loading?: boolean;
};

export type FieldMode = 'read' | 'edit';

export type FieldEmptyText = string | false;

export type RenderFieldProps = {
  /**
   * 自定义只读模式的渲染器
   * @params dom 默认的 dom
   * @return 返回一个用于读的 dom
   */
  render?: ((text: any, dom: JSX.Element) => JSX.Element) | undefined;
  /**
   * 一个自定义的编辑渲染器。
   * @params text 默认的值类型
   * @params dom 默认的 dom
   * @return 返回一个用于编辑的dom
   */
  renderEditor?: ((text: any, dom: JSX.Element) => JSX.Element) | undefined;
};

export type FieldProps<T = AnyObject> = BaseFieldProps & RenderFieldProps & T;

export type FieldFC<T = AnyObject> = React.ForwardRefRenderFunction<any, FieldProps<T>>;

export type FieldTextType =
  | React.ReactNode
  | React.ReactNode[]
  | Record<string, any>
  | Record<string, any>[];

export type FieldPropsType = {
  text?: FieldTextType;
  valueType?: FieldValueType | FieldValueObject;
  valueEnum?: FieldValueEnumMap | FieldValueEnumObj | FieldValueEnumRequestType;
  fieldKey?: string;
} & Omit<BaseFieldProps, 'text' | 'valueEnum'> &
  RenderFieldProps &
  AnyObject;

const defaultFieldNames = {
  label: 'label',
  value: 'value',
  status: 'status',
  color: 'color',
  disabled: 'disabled',
};

const FieldComponent: React.ForwardRefRenderFunction<any, FieldPropsType> = (
  {
    text,
    valueType = 'text',
    mode = 'read',
    renderEditor,
    editorProps,
    valueEnum,
    fieldKey,
    emptyText = '-',
    ...rest
  },
  ref: any,
) => {
  const [remoteValueEnum, setRemoteValueEnum] = useState<FieldValueEnumObj>();

  const isValueEnumRequest = isValueEnumWithRequest(valueEnum);
  const fieldNames = isValueEnumRequest
    ? {
        ...defaultFieldNames,
        ...valueEnum?.fieldNames,
      }
    : defaultFieldNames;

  const { loading } = useRequest(
    (...defaultParams: any[]) => {
      if (isValueEnumRequest) {
        return valueEnum.request(...defaultParams);
      }
      return new Promise(() => {});
    },
    {
      loadingDelay: 100,
      cacheKey: fieldKey,
      staleTime: 1000 * 5,
      ...(isValueEnumRequest
        ? {
            onSuccess: (
              data: {
                data: RequestDataType[];
              },
              params: any[],
            ) => {
              setRemoteValueEnum(() =>
                data.data.reduce(
                  (pre, cur) => ({
                    ...pre,
                    [cur[fieldNames.value]]: {
                      label: cur[fieldNames.label] ?? cur[fieldNames.value],
                      status: cur[fieldNames.status],
                      color: cur[fieldNames.color],
                      disabled: cur[fieldNames.disabled],
                    },
                  }),
                  {} as FieldValueEnumObj,
                ),
              );
              valueEnum.onSuccess?.(data, params);
            },
            ...omit(valueEnum, ['request', 'fieldNames', 'onSuccess']),
          }
        : { ready: false }),
    },
  );

  const mergedValueEnum = isValueEnumRequest ? remoteValueEnum : valueEnum;
  const dataValue =
    mode === 'edit' ? (editorProps?.value ?? text ?? '') : (text ?? editorProps?.value ?? '');
  const mergedValueType = typeof valueType === 'object' ? valueType.type : valueType;
  const shareProps = {
    ref,
    mode,
    valueEnum: mergedValueEnum,
    loading,
    ...(typeof valueType === 'object' ? omit(valueType, ['type']) : {}),
    ...rest,
  };

  if (
    emptyText !== false &&
    mode === 'read' &&
    mergedValueType !== 'option' &&
    mergedValueType !== 'switch'
  ) {
    if (typeof dataValue !== 'boolean' && typeof dataValue !== 'number' && !dataValue) {
      const { render } = shareProps;
      if (render) {
        return render(dataValue, <>{emptyText}</>);
      }
      return <>{emptyText}</>;
    }
  }

  if (mergedValueType === 'money') {
    return <FieldMoney text={dataValue as number} {...shareProps} />;
  }

  if (mergedValueType === 'date') {
    return <FieldDatePicker text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'dateWeek') {
    return <FieldDatePicker text={dataValue as string} picker="week" {...shareProps} />;
  }

  if (mergedValueType === 'dateWeekRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="week" {...shareProps} />;
  }

  if (mergedValueType === 'dateMonthRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="month" {...shareProps} />;
  }

  if (mergedValueType === 'dateQuarterRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="quarter" {...shareProps} />;
  }

  if (mergedValueType === 'dateYearRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="year" {...shareProps} />;
  }

  if (mergedValueType === 'dateMonth') {
    return <FieldDatePicker text={dataValue as string} picker="month" {...shareProps} />;
  }

  if (mergedValueType === 'dateQuarter') {
    return <FieldDatePicker text={dataValue as string} picker="quarter" {...shareProps} />;
  }

  if (mergedValueType === 'dateYear') {
    return <FieldDatePicker text={dataValue as string} picker="year" {...shareProps} />;
  }

  if (mergedValueType === 'dateRange') {
    return <FieldDateRangePicker text={dataValue as string[]} {...shareProps} />;
  }

  if (mergedValueType === 'dateTime') {
    return <FieldDatePicker text={dataValue as string} showTime {...shareProps} />;
  }

  if (mergedValueType === 'dateTimeRange') {
    return <FieldDateRangePicker text={dataValue as string[]} showTime {...shareProps} />;
  }

  if (mergedValueType === 'time') {
    return <FieldTimePicker text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'timeRange') {
    return <FieldTimeRangePicker text={dataValue as string[]} {...shareProps} />;
  }

  if (mergedValueType === 'fromNow') {
    return <FieldFromNow text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'index') {
    return <FieldIndexColumn>{(dataValue as number) + 1}</FieldIndexColumn>;
  }

  if (mergedValueType === 'indexBorder') {
    return <FieldIndexColumn border>{(dataValue as number) + 1}</FieldIndexColumn>;
  }

  if (mergedValueType === 'progress') {
    return <FieldProgress text={dataValue as number} {...shareProps} />;
  }

  if (mergedValueType === 'percent') {
    return <FieldPercent text={dataValue as number} {...shareProps} />;
  }

  if (mergedValueType === 'avatar' && typeof dataValue === 'string' && shareProps.mode === 'read') {
    return (
      <Avatar
        src={dataValue as string}
        size={36}
        shape="circle"
        {...(typeof valueType === 'object' ? omit(valueType, ['type']) : {})}
      />
    );
  }

  if (mergedValueType === 'textarea') {
    return <FieldTextArea text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'digit') {
    return <FieldDigit text={dataValue as number} {...shareProps} />;
  }

  if (mergedValueType === 'select' || (mergedValueType === 'text' && shareProps.valueEnum)) {
    return <FieldSelect text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'checkbox') {
    return <FieldCheckbox text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'radio') {
    return <FieldRadio text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'rate') {
    return <FieldRate {...shareProps} text={dataValue as number} />;
  }
  if (mergedValueType === 'slider') {
    return <FieldSlider text={dataValue as string} {...shareProps} />;
  }
  if (mergedValueType === 'switch') {
    return <FieldSwitch text={dataValue as boolean} {...shareProps} />;
  }

  if (mergedValueType === 'password') {
    return <FieldPassword text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'image') {
    return <FieldImage text={dataValue as string} {...shareProps} />;
  }
  if (mergedValueType === 'cascader') {
    return <FieldCascader text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'segmented') {
    return <FieldSegmented text={dataValue as string} {...shareProps} />;
  }

  if (mergedValueType === 'tag') {
    return <FieldTag text={dataValue as string} {...shareProps} />;
  }

  return <FieldText text={dataValue as string} {...shareProps} />;
};

export default React.forwardRef(FieldComponent as any) as typeof FieldComponent;
