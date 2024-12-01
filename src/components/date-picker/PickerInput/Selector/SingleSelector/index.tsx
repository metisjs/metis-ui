import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { InternalMode, PickerRef, SelectorProps } from '../../../interface';
import { isSame } from '../../../utils/dateUtil';
import { pickProps } from '../../../utils/miscUtil';
import PickerContext from '../../context';
import type { InternalPickerProps } from '../../SinglePicker';
import useInputProps from '../hooks/useInputProps';
import Icon, { ClearIcon } from '../Icon';
import Input, { type InputRef } from '../Input';
import MultipleDates from './MultipleDates';

export interface SingleSelectorProps<DateType extends object = any>
  extends SelectorProps<DateType>,
    Pick<InternalPickerProps, 'multiple' | 'maxTagCount'> {
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

  multipleClassName?: SemanticClassName<{ item?: string; placeholder?: string }>;
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

  const semanticCls = useSemanticCls(className);

  // ========================= Refs =========================
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<InputRef>(null);

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
    const nextValues =
      value?.filter(
        (oriDate) => oriDate && !isSame(generateConfig, locale, oriDate, date, internalPicker),
      ) ?? [];
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
  const showClear = !!(clearIcon && value?.length && !disabled);

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
        className={className}
      />
      <input
        className={clsx(`${prefixCls}-multiple-input`, 'invisible absolute -z-[1] h-0 w-0')}
        value={value?.map(getText).join(',')}
        ref={inputRef as any}
        readOnly
        autoFocus={autoFocus}
      />
      <Icon
        type="suffix"
        icon={suffixIcon}
        className="transition-opacity group-hover/selector:opacity-0 group-hover/selector:last:opacity-100"
      />
      {showClear && (
        <ClearIcon
          icon={clearIcon}
          onClear={onClear}
          className={clsx('end-3', semanticCls.clear)}
        />
      )}
    </>
  ) : (
    <Input
      ref={inputRef}
      {...getInputProps()}
      autoFocus={autoFocus}
      suffixIcon={suffixIcon}
      clearIcon={
        showClear && <ClearIcon icon={clearIcon} onClear={onClear} className={semanticCls.clear} />
      }
      showActiveCls={false}
      className={semanticCls.input}
      suffixClassName={semanticCls.suffix}
    />
  );

  // ======================== Render ========================
  return (
    <div
      {...pickProps(props, ['onMouseEnter', 'onMouseLeave'])}
      className={clsx(
        prefixCls,
        {
          [`${prefixCls}-multiple`]: multiple,
          [`${prefixCls}-focused`]: focused,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-invalid`]: invalid,
        },
        semanticCls.root,
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
