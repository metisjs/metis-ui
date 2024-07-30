import { useMergedState } from 'rc-util';
import * as React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import { FormItemInputContext } from '../form/context';
import CheckedIcon from './CheckedIcon';
import RadioGroupContext from './Context';
import type { RadioProps, RadioRef } from './interface';

const InternalRadio: React.ForwardRefRenderFunction<RadioRef, RadioProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    name,
    className,
    children,
    style,
    onMouseEnter,
    onMouseLeave,
    disabled,
    checked,
    defaultChecked,
    onChange,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('radio', customizePrefixCls);

  const semanticCls = getSemanticCls(className);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rawChecked, setRawChecked] = useMergedState(defaultChecked, {
    value: checked,
  });

  const radioGroup = React.useContext(RadioGroupContext);
  const { isFormItemInput } = React.useContext(FormItemInputContext);
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = (radioGroup?.disabled || disabled) ?? contextDisabled;
  const mergedChecked = radioGroup ? radioGroup.value === restProps.value : !!rawChecked;

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
    warning(
      'checked' in restProps || !!radioGroup || !('value' in restProps),
      'Radio',
      '`value` is not a valid prop, do you mean `checked`?',
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (!('checked' in props)) {
      setRawChecked(e.target.checked);
    }
    const innerEvent = {
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
    };

    onChange?.(innerEvent);
    radioGroup?.onChange?.(innerEvent);
  };

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
    'block h-4 w-4 cursor-pointer rounded-full border border-border text-white',
    'peer-focus/radio:outline peer-focus/radio:outline-2 peer-focus/radio:outline-offset-2 peer-focus/radio:outline-primary',
    {
      'border-primary bg-primary': mergedChecked,
      'border-border bg-fill-quaternary text-text-tertiary': mergedDisabled,
      'after:bg-text-tertiary': mergedDisabled,
    },
    `${prefixCls}-inner`,
    semanticCls.radio,
  );

  return (
    <label
      className={classString}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={`${prefixCls} relative`}>
        <input
          name={radioGroup ? radioGroup.name : name}
          className={'peer/radio absolute inset-0 z-[1] cursor-pointer opacity-0'}
          ref={inputRef}
          onChange={handleChange}
          disabled={mergedDisabled}
          checked={mergedChecked}
          type="radio"
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

const Radio = React.forwardRef<RadioRef, RadioProps>(InternalRadio);

if (process.env.NODE_ENV !== 'production') {
  Radio.displayName = 'Radio';
}

export default Radio;
