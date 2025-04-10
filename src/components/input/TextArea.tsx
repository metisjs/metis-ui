import * as React from 'react';
import { forwardRef } from 'react';
import { useMergedState } from '@rc-component/util';
import { clsx } from '@util/classNameUtils';
import usePlaceholder from '@util/hooks/usePlaceholder';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { getMergedStatus, getStatusClassNames } from '@util/statusUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariant';
import type { HolderRef } from './BaseInput';
import BaseInput from './BaseInput';
import useCount from './hooks/useCount';
import type { ResizableTextAreaRef, TextAreaProps, TextAreaRef } from './interface';
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
      placeholder: customPlaceholder,
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
    const semanticCls = useSemanticCls(className, 'textArea');
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('input', customizePrefixCls);

    const placeholder = usePlaceholder('input', customPlaceholder);

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
      focus: () => {
        getTextArea()?.focus();
      },
      blur: () => {
        getTextArea()?.blur();
      },
      select: () => {
        getTextArea()?.select();
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

    const onInternalChange = (_: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      'bg-container text-text outline-border placeholder:text-text-quaternary focus:outline-primary relative block h-full w-full appearance-none rounded-md border-0 text-sm shadow-xs -outline-offset-1 focus:-outline-offset-2',
      {
        'rounded-sm px-2 py-1': mergedSize === 'mini',
        'px-3 py-1.5': mergedSize === 'small',
        'px-3 py-2': mergedSize === 'middle',
        'px-3 py-2.5': mergedSize === 'large',
      },
      {
        'outline focus:outline-2': variant === 'outlined',
        'bg-transparent shadow-none outline-0 focus:outline-0': variant === 'borderless',
        'bg-fill-quinary focus:bg-container outline-0 focus:outline-2': variant === 'filled',
      },
      {
        'pr-8': allowClear,
      },
      getStatusClassNames(mergedStatus, variant),
      mergedDisabled && {
        'text-text-tertiary outline-border': true,
        'bg-fill-quaternary': variant !== 'borderless',
      },
      semanticCls.textarea,
    );
    const affixWrapperCls = clsx(
      {
        [`${prefixCls}-wrapper-${variant}`]: enableVariantCls,
        [`${prefixCls}-show-count`]: showCount,
        [`${prefixCls}-textarea-allow-clear`]: allowClear,
      },
      'group',
      'text-text relative inline-flex w-full min-w-0 border-0 text-sm',
    );
    const suffixCls = clsx(
      `${prefixCls}-textarea-suffix`,
      'text-text-secondary pointer-events-none absolute top-0 right-3 bottom-0 z-1 inline-flex flex-none items-center gap-x-2 [&_.metis-icon]:text-base',
      {
        '[&_.metis-icon]:text-lg': mergedSize === 'large',
        'right-2': mergedSize === 'mini',
      },
      mergedDisabled && 'text-text-tertiary',
    );
    const countCls = clsx(
      `${prefixCls}-data-count`,
      'bg-container text-text-tertiary absolute right-3 bottom-1.5 pl-1',
      {
        'bg-fill-quinary group-focus-within:bg-container': variant === 'filled',
        'bg-transparent': variant === 'borderless',
        'text-text-quaternary': mergedDisabled,
      },
      mergedSize === 'mini' && 'right-2 bottom-1',
      mergedSize === 'large' && 'bottom-2',
      semanticCls.count,
    );
    const clearCls = clsx(
      'text-text-tertiary hover:text-text-secondary absolute top-2 right-2 inline-flex text-base',
      {
        'text-lg': mergedSize === 'large',
        'top-1 right-2': mergedSize === 'mini',
        'top-1.5 right-3': mergedSize === 'small',
        'top-2 right-3': mergedSize === 'middle',
        'top-2.5 right-3': mergedSize === 'large',
      },
      semanticCls.clear,
    );

    // =============================== Render ================================
    const isPureTextArea = !rest.autoSize && !showCount && !allowClear;

    let suffixNode = hasFeedback && <span className={suffixCls}>{feedbackIcon}</span>;
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
          placeholder={placeholder}
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
          onChange={onInternalChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCompositionStart={onInternalCompositionStart}
          onCompositionEnd={onInternalCompositionEnd}
          className={textareaCls}
          style={{ resize: style?.resize }}
          disabled={mergedDisabled}
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
