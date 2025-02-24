import React from 'react';
import type { AnyObject } from '@util/type';
import omit from 'rc-util/lib/omit';
import Avatar from '../../avatar';
import type {
  FieldValueEnumMap,
  FieldValueEnumObj,
  FieldValueObject,
  FieldValueType,
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
import FieldText from './Text';
import FieldTextArea from './TextArea';
import FieldTimePicker from './TimePicker';
import FieldTimeRangePicker from './TimeRangePicker';

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
  emptyText?: React.ReactNode;
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

/**
 * Render valueType object
 */
const defaultRenderTextByObject = (
  dataValue: FieldTextType,
  valueType: FieldValueObject,
  props: Omit<BaseFieldProps, 'text'> & RenderFieldProps & AnyObject,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
) => defaultRenderText(dataValue, valueType.type, { ...omit(valueType, ['type']), ...props });

/**
 * 根据不同的类型来转化数值
 */
const defaultRenderText = (
  dataValue: FieldTextType,
  valueType: FieldValueType | FieldValueObject,
  props: Omit<BaseFieldProps, 'text'> & RenderFieldProps & AnyObject,
): React.ReactNode => {
  const { mode = 'read', emptyText = '-' } = props;

  if (emptyText !== false && mode === 'read' && valueType !== 'option' && valueType !== 'switch') {
    if (typeof dataValue !== 'boolean' && typeof dataValue !== 'number' && !dataValue) {
      const { render } = props;
      if (render) {
        return render(dataValue, <>{emptyText}</>);
      }
      return <>{emptyText}</>;
    }
  }

  if (typeof valueType === 'object') {
    return defaultRenderTextByObject(dataValue, valueType, props);
  }

  if (valueType === 'money') {
    return <FieldMoney text={dataValue as number} {...props} />;
  }

  if (valueType === 'date') {
    return <FieldDatePicker text={dataValue as string} {...props} />;
  }

  if (valueType === 'dateWeek') {
    return <FieldDatePicker text={dataValue as string} picker="week" {...props} />;
  }

  if (valueType === 'dateWeekRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="week" {...props} />;
  }

  if (valueType === 'dateMonthRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="month" {...props} />;
  }

  if (valueType === 'dateQuarterRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="quarter" {...props} />;
  }

  if (valueType === 'dateYearRange') {
    return <FieldDateRangePicker text={dataValue as string[]} picker="year" {...props} />;
  }

  if (valueType === 'dateMonth') {
    return <FieldDatePicker text={dataValue as string} picker="month" {...props} />;
  }

  /** 如果是季度的值 */
  if (valueType === 'dateQuarter') {
    return <FieldDatePicker text={dataValue as string} picker="quarter" {...props} />;
  }

  /** 如果是年的值 */
  if (valueType === 'dateYear') {
    return <FieldDatePicker text={dataValue as string} picker="year" {...props} />;
  }

  if (valueType === 'dateRange') {
    return <FieldDateRangePicker text={dataValue as string[]} {...props} />;
  }

  if (valueType === 'dateTime') {
    return <FieldDatePicker text={dataValue as string} showTime {...props} />;
  }

  if (valueType === 'dateTimeRange') {
    return <FieldDateRangePicker text={dataValue as string[]} showTime {...props} />;
  }

  if (valueType === 'time') {
    return <FieldTimePicker text={dataValue as string} {...props} />;
  }

  if (valueType === 'timeRange') {
    return <FieldTimeRangePicker text={dataValue as string[]} {...props} />;
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
    return <FieldProgress text={dataValue as number} {...props} />;
  }

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

  if (valueType === 'select' || (valueType === 'text' && props.valueEnum)) {
    return <FieldSelect text={dataValue as string} {...props} />;
  }

  if (valueType === 'checkbox') {
    return <FieldCheckbox text={dataValue as string} {...props} />;
  }

  if (valueType === 'radio') {
    return <FieldRadio text={dataValue as string} {...props} />;
  }

  if (valueType === 'rate') {
    return <FieldRate {...props} text={dataValue as number} />;
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

export type FieldPropsType = {
  text?: FieldTextType;
  valueType?: FieldValueType | FieldValueObject;
} & Omit<BaseFieldProps, 'text'> &
  RenderFieldProps &
  AnyObject;

const FieldComponent: React.ForwardRefRenderFunction<any, FieldPropsType> = (
  { text, valueType = 'text', mode = 'read', renderEditor, editorProps, ...rest },
  ref: any,
) => {
  const renderedDom = defaultRenderText(
    mode === 'edit' ? (editorProps?.value ?? text ?? '') : (text ?? editorProps?.value ?? ''),
    valueType,
    {
      ref,
      mode,
      ...rest,
    },
  );

  return <React.Fragment>{renderedDom}</React.Fragment>;
};

export default React.forwardRef(FieldComponent as any) as typeof FieldComponent;
