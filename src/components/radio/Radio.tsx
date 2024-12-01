import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import warning from '@util/warning';
import { useMergedState } from 'rc-util';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
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

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rawChecked, setRawChecked] = useMergedState(defaultChecked, {
    value: checked,
  });

  const radioGroup = React.useContext(RadioGroupContext);
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
      target: props,
      stopPropagation() {
        e.stopPropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
      nativeEvent: e.nativeEvent,
    };

    onChange?.(e.target.checked, innerEvent);
    radioGroup?.onChange?.(innerEvent);
  };

  const semanticCls = useSemanticCls(className, 'radio', {
    disabled: mergedDisabled,
    checked: mergedChecked,
  });

  const classString = clsx(
    'inline-flex cursor-pointer items-center text-sm leading-6',
    {
      'text-text-tertiary': mergedDisabled,
    },
    `${prefixCls}-wrapper`,
    semanticCls.root,
  );

  const indicatorCls = clsx(
    'block h-4 w-4 cursor-pointer rounded-full border border-border text-white',
    'peer-focus/radio:outline peer-focus/radio:outline-2 peer-focus/radio:outline-offset-2 peer-focus/radio:outline-primary',
    {
      'border-primary bg-primary': mergedChecked,
      'border-border bg-fill-quaternary text-text-tertiary': mergedDisabled,
      'after:bg-text-tertiary': mergedDisabled,
    },
    `${prefixCls}-indicator`,
    semanticCls.indicator,
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
        <span className={indicatorCls}>
          {mergedChecked && <CheckedIcon className="absolute inset-0" />}
        </span>
      </span>
      {children !== undefined && (
        <span className={clsx('pe-2 ps-2', semanticCls.label)}>{children}</span>
      )}
    </label>
  );
};

const Radio = React.forwardRef<RadioRef, RadioProps>(InternalRadio);

if (process.env.NODE_ENV !== 'production') {
  Radio.displayName = 'Radio';
}

export default Radio;
