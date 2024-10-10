import * as React from 'react';
import omit from 'rc-util/lib/omit';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, mergeSemanticCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { CheckboxChangeEvent } from './Checkbox';
import Checkbox from './Checkbox';

export type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
  className?: SemanticClassName<'checkbox'>;
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface AbstractCheckboxGroupProps {
  prefixCls?: string;
  className?: string;
  options?: Array<CheckboxOptionType | string | number>;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface CheckboxGroupProps extends AbstractCheckboxGroupProps {
  name?: string;
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  children?: React.ReactNode;
}

export interface CheckboxGroupContext {
  name?: string;
  toggleOption?: (option: CheckboxOptionType) => void;
  value?: any;
  disabled?: boolean;
  registerValue: (val: string) => void;
  cancelValue: (val: string) => void;
}

export const GroupContext = React.createContext<CheckboxGroupContext | null>(null);

const InternalCheckboxGroup: React.ForwardRefRenderFunction<HTMLDivElement, CheckboxGroupProps> = (
  {
    defaultValue,
    children,
    options = [],
    prefixCls: customizePrefixCls,
    className,
    style,
    onChange,
    ...restProps
  },
  ref,
) => {
  const { getPrefixCls } = React.useContext(ConfigContext);

  const [value, setValue] = React.useState<CheckboxValueType[]>(
    restProps.value || defaultValue || [],
  );
  const [registeredValues, setRegisteredValues] = React.useState<CheckboxValueType[]>([]);

  React.useEffect(() => {
    if ('value' in restProps) {
      setValue(restProps.value || []);
    }
  }, [restProps.value]);

  const getOptions = () =>
    options.map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return {
          label: option,
          value: option,
        };
      }
      return option;
    });

  const cancelValue = (val: string) => {
    setRegisteredValues((prevValues) => prevValues.filter((v) => v !== val));
  };

  const registerValue = (val: string) => {
    setRegisteredValues((prevValues) => [...prevValues, val]);
  };

  const toggleOption = (option: CheckboxOptionType) => {
    const optionIndex = value.indexOf(option.value);
    const newValue = [...value];
    if (optionIndex === -1) {
      newValue.push(option.value);
    } else {
      newValue.splice(optionIndex, 1);
    }
    if (!('value' in restProps)) {
      setValue(newValue);
    }
    const opts = getOptions();
    onChange?.(
      newValue
        .filter((val) => registeredValues.includes(val))
        .sort((a, b) => {
          const indexA = opts.findIndex((opt) => opt.value === a);
          const indexB = opts.findIndex((opt) => opt.value === b);
          return indexA - indexB;
        }),
    );
  };

  const prefixCls = getPrefixCls('checkbox', customizePrefixCls);
  const groupPrefixCls = `${prefixCls}-group`;

  const domProps = omit(restProps, ['value', 'disabled']);

  let mergedChildren = children;
  if (options && options.length > 0) {
    mergedChildren = getOptions().map((option) => (
      <Checkbox
        key={option.value.toString()}
        disabled={'disabled' in option ? option.disabled : restProps.disabled}
        value={option.value}
        checked={value.includes(option.value)}
        onChange={option.onChange}
        style={option.style}
        className={mergeSemanticCls(groupPrefixCls, option.className)}
      >
        {option.label}
      </Checkbox>
    ));
  }

  const context = {
    toggleOption,
    value,
    disabled: restProps.disabled,
    name: restProps.name,
    registerValue,
    cancelValue,
  };

  const classString = clsx('inline-flex flex-wrap gap-x-2', className);

  return (
    <div className={classString} style={style} {...domProps} ref={ref}>
      <GroupContext.Provider value={context}>{mergedChildren}</GroupContext.Provider>
    </div>
  );
};

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(InternalCheckboxGroup);

export default React.memo(CheckboxGroup);
