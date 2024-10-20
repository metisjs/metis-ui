import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useMergedState } from 'rc-util';
import omit from 'rc-util/lib/omit';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import ContextIsolator from '../_util/ContextIsolator';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariant';
import { useCompactItemContext } from '../space/Compact';
import type { HolderRef } from './BaseInput';
import BaseInput from './BaseInput';
import useCount from './hooks/useCount';
import useRemovePasswordTimeout from './hooks/useRemovePasswordTimeout';
import type { ChangeEventInfo, InputFocusOptions, InputProps, InputRef } from './interface';
import { hasPrefixSuffix, resolveOnChange, triggerFocus } from './utils';

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    status: customStatus,
    size: customSize,
    disabled: customDisabled,
    onBlur,
    onFocus,
    suffix,
    addonAfter,
    addonBefore,
    className,
    onChange,
    showCount,
    variant: customVariant,
    count,
    maxLength,
    type = 'text',
    htmlSize,
    onKeyDown,
    onPressEnter,
    onCompositionStart,
    onCompositionEnd,
    ...rest
  } = props;
  const semanticCls = getSemanticCls(className);
  const { getPrefixCls, input } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('input', customizePrefixCls);

  const [focused, setFocused] = useState<boolean>(false);

  const compositionRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const holderRef = useRef<HolderRef>(null);

  const focus = (option?: InputFocusOptions) => {
    if (inputRef.current) {
      triggerFocus(inputRef.current, option);
    }
  };

  // ====================== Value =======================
  const [value, setValue] = useMergedState(props.defaultValue, {
    value: props.value,
  });
  const formatValue = value === undefined || value === null ? '' : String(value);

  // =================== Select Range ===================
  const [selection, setSelection] = useState<[start: number, end: number] | null>(null);

  // ====================== Count =======================
  const countConfig = useCount(count, showCount);
  const mergedMax = countConfig.max || maxLength;
  const valueLength = countConfig.strategy(formatValue);

  // ===================== Compact Item =====================
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  // ===================== Size =====================
  const mergedSize = useSize((ctx) => customSize ?? compactSize ?? ctx);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Status =====================
  const { status: contextStatus, hasFeedback, feedbackIcon } = useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ===================== Focus warning =====================
  const inputHasPrefixSuffix = hasPrefixSuffix(props) || !!showCount || !!hasFeedback;
  const prevHasPrefixSuffix = useRef<boolean>(inputHasPrefixSuffix);
  useEffect(() => {
    if (inputHasPrefixSuffix && !prevHasPrefixSuffix.current) {
      warning(
        document.activeElement === inputRef.current,
        'Input',
        `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change.`,
      );
    }
    prevHasPrefixSuffix.current = inputHasPrefixSuffix;
  }, [inputHasPrefixSuffix]);

  // ===================== Remove Password value =====================
  const removePasswordTimeout = useRemovePasswordTimeout(inputRef, true);

  // ======================= Ref ========================
  useImperativeHandle(ref, () => ({
    focus,
    blur: () => {
      inputRef.current?.blur();
    },
    setSelectionRange: (
      start: number,
      end: number,
      direction?: 'forward' | 'backward' | 'none',
    ) => {
      inputRef.current?.setSelectionRange(start, end, direction);
    },
    select: () => {
      inputRef.current?.select();
    },
    input: inputRef.current,
    nativeElement: holderRef.current?.nativeElement || inputRef.current,
  }));

  // ======================= Effect ========================
  useEffect(() => {
    setFocused((prev) => (prev && mergedDisabled ? false : prev));
  }, [mergedDisabled]);

  useEffect(() => {
    if (selection) {
      inputRef.current?.setSelectionRange(...selection);
    }
  }, [selection]);

  const triggerChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>,
    currentValue: string,
    info: ChangeEventInfo,
  ) => {
    let cutValue = currentValue;

    if (
      !compositionRef.current &&
      countConfig.exceedFormatter &&
      countConfig.max &&
      countConfig.strategy(currentValue) > countConfig.max
    ) {
      cutValue = countConfig.exceedFormatter(currentValue, {
        max: countConfig.max,
      });

      if (currentValue !== cutValue) {
        setSelection([inputRef.current?.selectionStart || 0, inputRef.current?.selectionEnd || 0]);
      }
    } else if (info.source === 'compositionEnd') {
      return;
    }
    setValue(cutValue);

    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange, cutValue);
    }
  };

  const onInternalCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    compositionRef.current = false;
    triggerChange(e, e.currentTarget.value, {
      source: 'compositionEnd',
    });
    onCompositionEnd?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && e.key === 'Enter') {
      onPressEnter(e);
    }
    onKeyDown?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    setFocused(false);
    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    setFocused(true);
    onFocus?.(e);
  };

  const handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setValue('');
    focus();
    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    triggerChange(e, e.target.value, {
      source: 'change',
    });
  };

  const [variant, enableVariantCls] = useVariant(customVariant);

  // ====================== Style ======================
  const statusClassName = getStatusClassNames(mergedStatus, variant);
  const rootCls = clsx('shadow-sm', variant === 'borderless' && 'shadow-none', semanticCls.root);
  const wrapperCls = clsx('flex items-center');
  const groupWrapperCls = clsx(
    { [`${prefixCls}-wrapper-${variant}`]: enableVariantCls },
    'inline-block w-full rounded-md text-start align-top',
    compactItemClassnames[0],
  );
  const inputCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-disabled`]: mergedDisabled,
      [`${prefixCls}-${variant}`]: enableVariantCls && !inputHasPrefixSuffix,
    },
    'relative inline-block w-full appearance-none rounded-md bg-container text-sm outline-none ring-inset ring-border placeholder:text-text-quaternary focus:ring-inset focus:ring-primary',
    {
      'rounded px-2 py-1': mergedSize === 'mini',
      'px-3 py-1.5': mergedSize === 'small',
      'px-3 py-2': mergedSize === 'middle',
      'px-3 py-2.5': mergedSize === 'large',
    },
    {
      'ring-1 focus:ring-2': variant === 'outlined',
      'bg-transparent ring-0 focus:ring-0': variant === 'borderless',
      'bg-fill-quinary ring-0 focus:bg-container focus:ring-2': variant === 'filled',
    },
    {
      'text-text': !inputHasPrefixSuffix,
      'rounded-none bg-transparent p-0 ring-0 focus:bg-transparent focus:ring-0':
        inputHasPrefixSuffix,
      'rounded-s-none': addonBefore,
      'rounded-e-none': addonAfter,
    },
    !inputHasPrefixSuffix && statusClassName,
    mergedDisabled && {
      'text-text-tertiary ring-border': true,
      'bg-fill-quaternary': !inputHasPrefixSuffix && variant !== 'borderless',
    },
    compactItemClassnames[1],
    !inputHasPrefixSuffix && !addonBefore && !addonAfter && compactItemClassnames[0],
    semanticCls.input,
  );
  const affixWrapperCls = clsx(
    'relative inline-flex w-full items-center gap-x-2 rounded-md bg-container text-sm text-text ring-inset ring-border focus-within:ring-inset focus-within:ring-primary',
    {
      'gap-x-1 rounded px-2 py-1': mergedSize === 'mini',
      'px-3 py-1.5': mergedSize === 'small',
      'px-3 py-2': mergedSize === 'middle',
      'px-3 py-2.5': mergedSize === 'large',
    },
    {
      'ring-1 focus-within:ring-2': variant === 'outlined',
      'bg-transparent ring-0 focus-within:ring-0': variant === 'borderless',
      'bg-fill-quinary ring-0 focus-within:bg-container focus-within:ring-2': variant === 'filled',
    },
    {
      'rounded-s-none': addonBefore,
      'rounded-e-none': addonAfter,
    },
    statusClassName,
    mergedDisabled && {
      'text-text-tertiary ring-border': true,
      'bg-fill-quaternary': variant !== 'borderless',
    },
    compactItemClassnames[1],
    !addonBefore && !addonAfter && compactItemClassnames[0],
  );
  const addonBeforeCls = clsx(
    'input-addon -mr-[1px] inline-flex items-center rounded-s-md bg-container text-sm text-text-secondary ring-inset ring-border',
    {
      'h-7 rounded-s px-2': mergedSize === 'mini',
      'h-8 px-2': mergedSize === 'small',
      'h-9 px-3': mergedSize === 'middle',
      'h-10 px-3': mergedSize === 'large',
    },
    {
      'ring-1': variant === 'outlined',
      'bg-transparent ring-0': variant === 'borderless',
      'bg-fill-quinary ring-0': variant === 'filled',
    },
    statusClassName,
    mergedDisabled && {
      'text-text-tertiary ring-border': true,
      'bg-fill-quaternary': variant !== 'borderless',
    },
    compactItemClassnames[1],
  );
  const addonAfterCls = clsx(
    'input-addon -ml-[1px] inline-flex items-center rounded-e-md bg-container text-sm text-text-secondary ring-inset ring-border',
    {
      'h-7 rounded-e-md px-2': mergedSize === 'mini',
      'h-8 px-2': mergedSize === 'small',
      'h-9 px-3': mergedSize === 'middle',
      'h-10 px-3': mergedSize === 'large',
    },
    {
      'ring-1': variant === 'outlined',
      'bg-transparent ring-0': variant === 'borderless',
      'bg-fill-quinary ring-0': variant === 'filled',
    },
    statusClassName,
    mergedDisabled && {
      'text-text-tertiary ring-border': true,
      'bg-fill-quaternary': variant !== 'borderless',
    },
    compactItemClassnames[1],
  );
  const _prefixCls = clsx(
    mergedSize !== 'middle' && `${prefixCls}-prefix-${mergedSize}`,
    'flex flex-none items-center gap-x-1 text-text-secondary',
    {
      '[&_.metis-icon]:text-lg': mergedSize === 'large' || mergedSize === 'middle',
      '[&_.metis-icon]:text-base': mergedSize === 'small' || mergedSize === 'mini',
    },
    mergedDisabled && 'text-text-tertiary',
    semanticCls.prefix,
  );
  const suffixCls = clsx(
    mergedSize !== 'middle' && `${prefixCls}-suffix-${mergedSize}`,
    'flex flex-none items-center gap-x-2 text-text-secondary',
    {
      '[&_.metis-icon]:text-lg': mergedSize === 'large' || mergedSize === 'middle',
      '[&_.metis-icon]:text-base': mergedSize === 'small' || mergedSize === 'mini',
    },
    mergedDisabled && 'text-text-tertiary',
    semanticCls.suffix,
  );
  const countCls = clsx(
    `${prefixCls}-show-count-suffix`,
    {
      [`${prefixCls}-show-count-has-suffix`]: hasFeedback || suffix,
    },
    'text-text-tertiary',
    mergedDisabled && 'text-text-quaternary',
    semanticCls.count,
  );
  const clearCls = clsx(
    'flex items-center text-text-tertiary transition-colors hover:text-text-secondary',
  );

  // ====================== Render ======================
  let suffixNode = null;
  const hasMaxLength = Number(mergedMax) > 0;
  const hasSuffix = hasFeedback || suffix;
  if (hasSuffix || countConfig.show) {
    const dataCount = countConfig.showFormatter
      ? countConfig.showFormatter({
          value: formatValue,
          count: valueLength,
          maxLength: mergedMax,
        })
      : `${valueLength}${hasMaxLength ? ` / ${mergedMax}` : ''}`;

    suffixNode = (
      <>
        {countConfig.show && <span className={countCls}>{dataCount}</span>}
        {suffix}
        {hasFeedback && feedbackIcon}
      </>
    );
  }

  const inputRestProps = omit(
    props as Omit<InputProps, 'value'> & {
      value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
    },
    [
      'prefixCls',
      'onPressEnter',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
      'allowClear',
      'defaultValue',
      'showCount',
      'count',
      'htmlSize',
      'style',
    ],
  );

  return (
    <BaseInput
      {...rest}
      prefixCls={prefixCls}
      className={{
        root: rootCls,
        affixWrapper: affixWrapperCls,
        prefix: _prefixCls,
        suffix: suffixCls,
        groupWrapper: groupWrapperCls,
        wrapper: wrapperCls,
        clear: clearCls,
        addonAfter: addonAfterCls,
        addonBefore: addonBeforeCls,
      }}
      handleReset={handleReset}
      value={formatValue}
      focused={focused}
      triggerFocus={focus}
      suffix={suffixNode}
      disabled={mergedDisabled}
      addonAfter={
        addonAfter && (
          <ContextIsolator form space>
            {addonAfter}
          </ContextIsolator>
        )
      }
      addonBefore={
        addonBefore && (
          <ContextIsolator form space>
            {addonBefore}
          </ContextIsolator>
        )
      }
    >
      <input
        autoComplete={input?.autoComplete}
        {...inputRestProps}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={inputCls}
        ref={inputRef}
        size={htmlSize}
        type={type}
        onCompositionStart={(e) => {
          compositionRef.current = true;
          onCompositionStart?.(e);
        }}
        onCompositionEnd={onInternalCompositionEnd}
      />
    </BaseInput>
  );
});

export default Input;
