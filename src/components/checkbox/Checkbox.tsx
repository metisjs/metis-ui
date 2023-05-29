import { useMergedState } from 'rc-util';
import * as React from 'react';
import { ComplexClassName, clsx, getClassNames } from '../_util/classNameUtils';
import warning from '../_util/warning';
import DisabledContext from '../config-provider/DisabledContext';
import { FormItemInputContext } from '../form/context';
import CheckedIcon from './CheckedIcon';
import { GroupContext } from './Group';

export interface AbstractCheckboxProps<T> {
  className?: ComplexClassName<'checkbox'>;
  defaultChecked?: boolean;
  checked?: boolean;
  style?: React.CSSProperties;
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
  type?: string;
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
    type = 'checkbox',
    ...restProps
  } = props;
  const classNames = getClassNames(className);

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
        type,
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

  const classString = clsx(
    'inline-flex cursor-pointer items-center gap-x-2 text-sm leading-6',
    {
      'text-neutral-text-quaternary': mergedDisabled,
      '': isFormItemInput,
    },
    classNames.root,
  );

  const innerClass = clsx(
    'block h-4 w-4 cursor-pointer rounded border border-neutral-border text-white',
    'peer-focus-visible/checkbox:outline peer-focus-visible/checkbox:outline-2 peer-focus-visible/checkbox:outline-offset-2 peer-focus-visible/checkbox:outline-primary',
    {
      'after:absolute after:start-1/2 after:top-1/2 after:block after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-sm after:bg-primary after:content-[""]':
        indeterminate,
      'border-primary bg-primary': mergedChecked,
      'border-neutral-border bg-neutral-fill-tertiary text-neutral-text-quaternary': mergedDisabled,
      'after:bg-neutral-text-quaternary': mergedDisabled,
    },
    classNames.checkbox,
  );

  const ariaChecked = indeterminate ? 'mixed' : undefined;

  return (
    <label
      className={classString}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="relative">
        <input
          aria-checked={ariaChecked}
          name={checkboxGroup && !skipGroup ? checkboxGroup.name : name}
          className={'peer/checkbox absolute inset-0 z-[1] cursor-pointer opacity-0'}
          ref={inputRef}
          onChange={handleChange}
          disabled={mergedDisabled}
          checked={mergedChecked}
          type={type}
          {...restProps}
        />
        <span className={innerClass}>
          {mergedChecked && <CheckedIcon className="absolute inset-0" />}
        </span>
      </span>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
};

const Checkbox = React.forwardRef<unknown, CheckboxProps>(InternalCheckbox);
if (process.env.NODE_ENV !== 'production') {
  Checkbox.displayName = 'Checkbox';
}

export default Checkbox;
