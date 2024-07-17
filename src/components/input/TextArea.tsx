import { useMergedState } from 'rc-util';
import * as React from 'react';
import { forwardRef } from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariants';
import BaseInput, { HolderRef } from './BaseInput';
import useCount from './hooks/useCount';
import { ResizableTextAreaRef, TextAreaProps, TextAreaRef } from './interface';
import ResizableTextArea from './ResizableTextArea';
import { resolveOnChange } from './utils';

const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  (
    {
      prefixCls: customizePrefixCls,
      size: customizeSize,
      disabled: customizeDisabled,
      status: customizeStatus,
      allowClear,
      showCount,
      className,
      variant: customizeVariant,
      defaultValue,
      value: customizeValue,
      count,
      maxLength,
      style,
      hidden,
      readOnly,
      onChange,
      onCompositionStart,
      onCompositionEnd,
      onFocus,
      onBlur,
      onResize,
      ...rest
    },
    ref,
  ) => {
    const semanticCls = getSemanticCls(className);
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('input', customizePrefixCls);

    const [value, setValue] = useMergedState(defaultValue, {
      value: customizeValue,
      defaultValue,
    });
    const formatValue = value === undefined || value === null ? '' : String(value);

    const [focused, setFocused] = React.useState<boolean>(false);

    const compositionRef = React.useRef(false);

    const [textareaResized, setTextareaResized] = React.useState<boolean>(false);

    // =========================== Select Range ===========================
    const [selection, setSelection] = React.useState<[start: number, end: number] | null>(null);

    // ===================== Size =====================
    const mergedSize = useSize(customizeSize);

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = customizeDisabled ?? disabled;

    // ===================== Status =====================
    const {
      status: contextStatus,
      hasFeedback,
      feedbackIcon,
    } = React.useContext(FormItemInputContext);
    const mergedStatus = getMergedStatus(contextStatus, customizeStatus);

    // ============================== Count ===============================
    const countConfig = useCount(count, showCount);
    const mergedMax = countConfig.max ?? maxLength;

    // Max length value
    const hasMaxLength = Number(mergedMax) > 0;
    const valueLength = countConfig.strategy(formatValue);

    // =============================== Ref ================================
    const holderRef = React.useRef<HolderRef>(null);
    const resizableTextAreaRef = React.useRef<ResizableTextAreaRef>(null);

    const getTextArea = () => resizableTextAreaRef.current?.textArea;

    React.useImperativeHandle(ref, () => ({
      resizableTextArea: resizableTextAreaRef.current!,
      focus,
      blur: () => {
        getTextArea()?.blur();
      },
      nativeElement: holderRef.current?.nativeElement || getTextArea()!,
    }));

    // =============================== Effect ================================
    React.useEffect(() => {
      setFocused((prev) => !mergedDisabled && prev);
    }, [mergedDisabled]);

    React.useEffect(() => {
      if (selection) {
        getTextArea()?.setSelectionRange(...selection);
      }
    }, [selection]);

    // ============================== Change ==============================
    const triggerChange = (
      e: React.ChangeEvent<HTMLTextAreaElement> | React.CompositionEvent<HTMLTextAreaElement>,
      currentValue: string,
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
          setSelection([getTextArea()?.selectionStart || 0, getTextArea()?.selectionEnd || 0]);
        }
      }
      setValue(cutValue);

      resolveOnChange(e.currentTarget, e, onChange, cutValue);
    };

    // =========================== Value Update ===========================
    const onInternalCompositionStart: React.CompositionEventHandler<HTMLTextAreaElement> = (e) => {
      compositionRef.current = true;
      onCompositionStart?.(e);
    };

    const onInternalCompositionEnd: React.CompositionEventHandler<HTMLTextAreaElement> = (e) => {
      compositionRef.current = false;
      triggerChange(e, e.currentTarget.value);
      onCompositionEnd?.(e);
    };

    const onInternalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      triggerChange(e, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const { onPressEnter, onKeyDown } = rest;
      if (e.key === 'Enter' && onPressEnter) {
        onPressEnter(e);
      }
      onKeyDown?.(e);
    };

    const handleFocus: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
      setFocused(false);
      onBlur?.(e);
    };

    const handleResize: TextAreaProps['onResize'] = (size) => {
      onResize?.(size);
      if (getTextArea()?.style.height) {
        setTextareaResized(true);
      }
    };

    // ============================== Reset ===============================
    const handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setValue('');
      focus();
      resolveOnChange(getTextArea()!, e, onChange);
    };

    // =============================== Style ================================
    const [variant, enableVariantCls] = useVariant(customizeVariant);

    const textareaCls = clsx(
      { [`${prefixCls}-${variant}`]: enableVariantCls },
      'relative block h-full w-full rounded-md border-0 bg-neutral-bg-container text-sm text-neutral-text shadow-sm ring-inset ring-neutral-border placeholder:text-neutral-text-quaternary focus:ring-inset focus:ring-primary',
      {
        'px-2 py-1': mergedSize === 'small',
        'px-3 py-1.5 leading-6': mergedSize === 'middle',
        'px-3 py-2 text-base': mergedSize === 'large',
      },
      {
        'ring-1 focus:ring-2': variant === 'outlined',
        'shadow-none ring-0 focus:ring-0': variant === 'borderless',
        'bg-neutral-fill-quinary ring-0 focus:bg-neutral-bg-container  focus:ring-2':
          variant === 'filled',
      },
      {
        'text-neutral-text-tertiary': mergedDisabled,
        'bg-neutral-fill-quaternary ': mergedDisabled && variant !== 'borderless',
        'pr-8': allowClear,
      },
      semanticCls.textarea,
      getStatusClassNames(mergedStatus),
    );
    const affixWrapperCls = clsx(
      {
        [`${prefixCls}-wrapper-${variant}`]: enableVariantCls,
        [`${prefixCls}-show-count`]: showCount,
        [`${prefixCls}-textarea-allow-clear`]: allowClear,
      },
      'group',
      'relative inline-flex w-full min-w-0 border-0 text-sm text-neutral-text',
      {
        'leading-6': mergedSize === 'middle',
        'text-base': mergedSize === 'large',
      },
    );
    const countCls = clsx(
      `${prefixCls}-data-count`,
      'absolute bottom-1.5 right-3 bg-neutral-bg-container pl-1 text-neutral-text-tertiary',
      {
        'bg-neutral-fill-quinary group-focus-within:bg-neutral-bg-container': variant === 'filled',
        'text-neutral-text-quaternary': mergedDisabled,
        'bg-transparent': mergedDisabled && variant !== 'borderless',
      },
      mergedSize === 'small' && 'right-2',
      mergedSize === 'large' && 'bottom-2',
      semanticCls.count,
    );
    const clearCls = clsx(
      'absolute right-2 top-1 text-neutral-text-quaternary hover:text-neutral-text-tertiary',
      semanticCls.clear,
    );

    // =============================== Render ================================
    const isPureTextArea = !rest.autoSize && !showCount && !allowClear;

    let suffixNode = hasFeedback && (
      <span className={`${prefixCls}-textarea-suffix`}>{feedbackIcon}</span>
    );
    let dataCount: React.ReactNode;
    if (countConfig.show) {
      if (countConfig.showFormatter) {
        dataCount = countConfig.showFormatter({
          value: formatValue,
          count: valueLength,
          maxLength: mergedMax,
        });
      } else {
        dataCount = `${valueLength}${hasMaxLength ? ` / ${mergedMax}` : ''}`;
      }

      suffixNode = (
        <>
          {suffixNode}
          <span className={countCls}>{dataCount}</span>
        </>
      );
    }

    return (
      <BaseInput
        ref={holderRef}
        value={formatValue}
        allowClear={allowClear}
        handleReset={handleReset}
        suffix={suffixNode}
        prefixCls={prefixCls}
        disabled={disabled}
        focused={focused}
        className={{
          root: semanticCls.root,
          affixWrapper: affixWrapperCls,
          clear: clearCls,
        }}
        style={{
          ...style,
          ...(textareaResized && !isPureTextArea ? { height: 'auto' } : {}),
        }}
        dataAttrs={{
          affixWrapper: {
            'data-count': typeof dataCount === 'string' ? dataCount : '',
          },
        }}
        hidden={hidden}
        readOnly={readOnly}
      >
        <ResizableTextArea
          {...rest}
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
          onChange={onInternalChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCompositionStart={onInternalCompositionStart}
          onCompositionEnd={onInternalCompositionEnd}
          className={textareaCls}
          style={{ resize: style?.resize }}
          disabled={disabled}
          prefixCls={prefixCls}
          onResize={handleResize}
          ref={resizableTextAreaRef}
          readOnly={readOnly}
        />
      </BaseInput>
    );
  },
);

export default TextArea;
