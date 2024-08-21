import * as React from 'react';
import classNames from 'classnames';
import { pickProps } from 'metis-ui/es/date-picker/utils/miscUtil';
import type { InternalMode, PickerRef, SelectorProps } from '../../../interface';
import { isSame } from '../../../utils/dateUtil';
import PickerContext from '../../context';
import type { PickerProps } from '../../SinglePicker';
import useInputProps from '../hooks/useInputProps';
import useRootProps from '../hooks/useRootProps';
import Icon, { ClearIcon } from '../Icon';
import Input, { type InputRef } from '../Input';
import MultipleDates from './MultipleDates';

export interface SingleSelectorProps<DateType extends object = any>
  extends SelectorProps<DateType>,
    Pick<PickerProps, 'multiple' | 'maxTagCount'> {
  id?: string;

  value?: DateType[];
  onChange: (date: DateType[]) => void;

  internalPicker: InternalMode;

  disabled: boolean;

  /** All the field show as `placeholder` */
  allHelp: boolean;

  placeholder?: string;

  // Invalid
  invalid: boolean;
  onInvalid: (valid: boolean) => void;

  removeIcon?: React.ReactNode;
}

function SingleSelector<DateType extends object = any>(
  props: SingleSelectorProps<DateType>,
  ref: React.Ref<PickerRef>,
) {
  const {
    open,

    clearIcon,
    suffixIcon,

    focused,
    locale,
    generateConfig,

    // Placeholder
    placeholder,

    // Style
    className,
    style,

    // Click
    onClick,
    onClear,

    // Change
    internalPicker,
    value,
    onChange,
    onSubmit,
    multiple,
    maxTagCount,

    // Disabled
    disabled,
    invalid,

    // Native
    onMouseDown,

    // Input
    autoFocus,

    removeIcon,
  } = props;

  // ======================== Prefix ========================
  const { prefixCls } = React.useContext(PickerContext);

  // ========================= Refs =========================
  const rootRef = React.useRef<HTMLDivElement>();
  const inputRef = React.useRef<InputRef>();

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
    focus: (options) => {
      inputRef.current?.focus(options);
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  // ======================== Change ========================
  const onSingleChange = (date: DateType) => {
    onChange([date]);
  };

  const onMultipleRemove = (date: DateType) => {
    const nextValues = value.filter(
      (oriDate) => oriDate && !isSame(generateConfig, locale, oriDate, date, internalPicker),
    );
    onChange(nextValues);

    // When `open`, it means user is operating the
    if (!open) {
      onSubmit();
    }
  };

  // ======================== Inputs ========================
  const [getInputProps, getText] = useInputProps<DateType>(
    {
      ...props,
      onChange: onSingleChange,
    },
    ({ valueTexts }) => ({
      value: valueTexts[0] || '',
      active: focused,
    }),
  );

  // ======================== Clear =========================
  const showClear = !!(clearIcon && value.length && !disabled);

  // ======================= Multiple =======================
  const selectorNode = multiple ? (
    <>
      <MultipleDates
        prefixCls={prefixCls}
        value={value}
        onRemove={onMultipleRemove}
        formatDate={getText}
        maxTagCount={maxTagCount}
        disabled={disabled}
        removeIcon={removeIcon}
        placeholder={placeholder}
      />
      <input
        className={`${prefixCls}-multiple-input`}
        value={value.map(getText).join(',')}
        ref={inputRef as any}
        readOnly
        autoFocus={autoFocus}
      />
      <Icon type="suffix" icon={suffixIcon} />
      {showClear && <ClearIcon icon={clearIcon} onClear={onClear} />}
    </>
  ) : (
    <Input
      ref={inputRef}
      {...getInputProps()}
      autoFocus={autoFocus}
      suffixIcon={suffixIcon}
      clearIcon={showClear && <ClearIcon icon={clearIcon} onClear={onClear} />}
      showActiveCls={false}
    />
  );

  // ======================== Render ========================
  return (
    <div
      {...pickProps(props, ['onMouseEnter', 'onMouseLeave'])}
      className={classNames(
        prefixCls,
        {
          [`${prefixCls}-multiple`]: multiple,
          [`${prefixCls}-focused`]: focused,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-invalid`]: invalid,
          [`${prefixCls}-rtl`]: rtl,
        },
        className,
      )}
      style={style}
      ref={rootRef}
      onClick={onClick}
      // Not lose current input focus
      onMouseDown={(e) => {
        const { target } = e;
        if (target !== inputRef.current?.inputElement) {
          e.preventDefault();
        }

        onMouseDown?.(e);
      }}
    >
      {selectorNode}
    </div>
  );
}

const RefSingleSelector = React.forwardRef(SingleSelector);

export default RefSingleSelector;
