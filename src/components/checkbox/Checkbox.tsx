import { useMergedState } from 'rc-util';
import * as React from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import { FormItemInputContext } from '../form/context';
import CheckedIcon from './CheckedIcon';
import { GroupContext } from './Group';

export interface AbstractCheckboxProps<T> {
  className?: SemanticClassName<'checkbox'>;
  defaultChecked?: boolean;
  checked?: boolean;
  style?: React.CSSProperties;
  prefixCls?: string;
  disabled?: boolean;
  onChange?: (e: T) => void;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  value?: any;
  tabIndex?: number;
  name?: string;
  children?: React.ReactNode;
  id?: string;
  autoFocus?: boolean;
  skipGroup?: boolean;
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: React.ChangeEvent<HTMLInputElement>['nativeEvent'];
}

export interface CheckboxProps extends AbstractCheckboxProps<CheckboxChangeEvent> {
  indeterminate?: boolean;
}

export interface CheckboxRef {
  focus: () => void;
  blur: () => void;
  input: HTMLInputElement | null;
}

const InternalCheckbox: React.ForwardRefRenderFunction<CheckboxRef, CheckboxProps> = (
  props,
  ref,
) => {
  const {
    prefixCls: customizePrefixCls,
    name,
    className,
    children,
    indeterminate = false,
    style,
    onMouseEnter,
    onMouseLeave,
    skipGroup = false,
    disabled,
    checked,
    defaultChecked,
    onChange,
    ...restProps
  } = props;
  const semanticCls = getSemanticCls(className);

  const { getPrefixCls } = React.useContext(ConfigContext);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rawChecked, setRawChecked] = useMergedState(defaultChecked, {
    value: checked,
  });

  const checkboxGroup = React.useContext(GroupContext);
  const { isFormItemInput } = React.useContext(FormItemInputContext);
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = (checkboxGroup?.disabled || disabled) ?? contextDisabled;
  const mergedChecked =
    checkboxGroup && !skipGroup ? checkboxGroup.value.includes(restProps.value) : !!rawChecked;

  const prevValue = React.useRef(restProps.value);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    input: inputRef.current,
  }));

  React.useEffect(() => {
    checkboxGroup?.registerValue(restProps.value);
    warning(
      'checked' in restProps || !!checkboxGroup || !('value' in restProps),
      'Checkbox',
      '`value` is not a valid prop, do you mean `checked`?',
    );
  }, []);

  React.useEffect(() => {
    if (skipGroup) {
      return;
    }
    if (restProps.value !== prevValue.current) {
      checkboxGroup?.cancelValue(prevValue.current);
      checkboxGroup?.registerValue(restProps.value);
      prevValue.current = restProps.value;
    }
    return () => checkboxGroup?.cancelValue(restProps.value);
  }, [restProps.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (!('checked' in props)) {
      setRawChecked(e.target.checked);
    }

    onChange?.({
      target: {
        ...props,
        checked: e.target.checked,
      },
      stopPropagation() {
        e.stopPropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
      nativeEvent: e.nativeEvent,
    });

    if (checkboxGroup && !skipGroup) {
      checkboxGroup.toggleOption?.({ label: children, value: restProps.value });
    }
  };

  const prefixCls = getPrefixCls('checkbox', customizePrefixCls);

  const classString = clsx(
    'inline-flex cursor-pointer items-center text-sm leading-6',
    {
      'text-text-tertiary': mergedDisabled,
      '': isFormItemInput,
    },
    `${prefixCls}-wrapper`,
    semanticCls.root,
  );

  const innerClass = clsx(
    'block h-4 w-4 cursor-pointer rounded border border-border text-white',
    'peer-focus/checkbox:outline peer-focus/checkbox:outline-2 peer-focus/checkbox:outline-offset-2 peer-focus/checkbox:outline-primary',
    {
      'after:absolute after:start-1/2 after:top-1/2 after:block after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-sm after:bg-primary after:content-[""]':
        indeterminate,
      'border-primary bg-primary': mergedChecked,
      'border-border bg-fill-quaternary text-text-tertiary': mergedDisabled,
      'after:bg-text-tertiary': mergedDisabled,
    },
    `${prefixCls}-inner`,
    semanticCls.checkbox,
  );

  const ariaChecked = indeterminate ? 'mixed' : undefined;

  return (
    <label
      className={classString}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={`${prefixCls} relative`}>
        <input
          aria-checked={ariaChecked}
          name={checkboxGroup && !skipGroup ? checkboxGroup.name : name}
          className={'peer/checkbox absolute inset-0 z-[1] cursor-pointer opacity-0'}
          ref={inputRef}
          onChange={handleChange}
          disabled={mergedDisabled}
          checked={mergedChecked}
          type="checkbox"
          {...restProps}
        />
        <span className={innerClass}>
          {mergedChecked && <CheckedIcon className="absolute inset-0" />}
        </span>
      </span>
      {children !== undefined && <span className="pe-2 ps-2">{children}</span>}
    </label>
  );
};

const Checkbox = React.forwardRef<unknown, CheckboxProps>(InternalCheckbox);
if (process.env.NODE_ENV !== 'production') {
  Checkbox.displayName = 'Checkbox';
}

export default Checkbox;
