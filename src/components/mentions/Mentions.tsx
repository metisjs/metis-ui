import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import useMergedState from '@rc-component/util/es/hooks/useMergedState';
import { clsx, mergeSemanticCls, type SemanticClassName } from '@util/classNameUtils';
import useEffectState from '@util/hooks/useEffectState';
import useSemanticCls from '@util/hooks/useSemanticCls';
import toArray from '@util/toArray';
import { devUseWarning } from '@util/warning';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { TextAreaProps } from '../input';
import type { HolderRef } from '../input/BaseInput';
import BaseInput from '../input/BaseInput';
import type { TextAreaRef } from '../input/interface';
import TextArea from '../input/TextArea';
import { MentionsContext } from './context';
import KeywordTrigger from './KeywordTrigger';
import {
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch,
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from './util';

type BaseTextareaAttrs = Omit<
  TextAreaProps,
  'prefix' | 'onChange' | 'onSelect' | 'showCount' | 'className'
>;

export type MentionPlacement = 'top' | 'bottom';

export type MentionOptionClassName = SemanticClassName<
  { inner?: string; label?: string },
  { disabled?: boolean }
>;
export interface MentionsOptionProps {
  label?: React.ReactNode;
  value: string;
  key?: string;
  disabled?: boolean;
  className?: MentionOptionClassName;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface MentionsProps extends BaseTextareaAttrs {
  loading?: boolean;
  autoFocus?: boolean;
  className?: SemanticClassName<
    {
      textarea?: string;
      clear?: string;
      popup?: string;
      option?: MentionsOptionProps['className'];
    },
    { disabled?: boolean }
  >;
  defaultValue?: string;
  notFoundContent?: React.ReactNode;
  split?: string;
  style?: React.CSSProperties;
  placement?: MentionPlacement;
  prefix?: string | string[];
  prefixCls?: string;
  value?: string;
  silent?: boolean;
  filterOption?: false | typeof defaultFilterOption;
  validateSearch?: typeof defaultValidateSearch;
  onChange?: (text: string) => void;
  onSelect?: (option: MentionsOptionProps, prefix: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  /** @private Testing usage. Do not use in prod. It will not work as your expect. */
  open?: boolean;
  options?: MentionsOptionProps[];
}

export interface MentionsRef {
  focus: VoidFunction;
  blur: VoidFunction;

  nativeElement: HTMLElement;
}

interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

interface MentionsEntity {
  prefix: string;
  value: string;
}

const InternalMentions = forwardRef<MentionsRef, MentionsProps>((props, ref) => {
  const {
    // Style
    prefixCls,
    className,
    style,

    // Misc
    prefix = '@',
    split = ' ',
    notFoundContent,
    value,
    defaultValue,
    options,
    open,
    silent,
    size,
    loading,

    // Events
    validateSearch = defaultValidateSearch,
    filterOption = defaultFilterOption,
    onChange,
    onKeyDown,
    onKeyUp,
    onPressEnter,
    onSearch,
    onSelect,

    onFocus,
    onBlur,

    placement,
    getPopupContainer,

    rows = 1,

    // Rest
    ...restProps
  } = props;

  const warning = devUseWarning('Mentions');

  const semanticCls = useSemanticCls(className);

  const mergedPrefix = useMemo(() => (Array.isArray(prefix) ? prefix : [prefix]), [prefix]);

  // =============================== Refs ===============================
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<TextAreaRef>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const getTextArea = () => textareaRef.current?.resizableTextArea?.textArea;

  React.useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    nativeElement: containerRef.current!,
  }));

  // ============================== State ===============================
  const [measuring, setMeasuring] = useState(false);
  const [measureText, setMeasureText] = useState('');
  const [measurePrefix, setMeasurePrefix] = useState('');
  const [measureLocation, setMeasureLocation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  // ============================== Value ===============================
  const [mergedValue, setMergedValue] = useMergedState('', {
    defaultValue,
    value: value,
  });

  // =============================== Open ===============================
  useEffect(() => {
    const textarea = getTextArea();
    if (measuring && measureRef.current && textarea) {
      measureRef.current.scrollTop = textarea.scrollTop;
    }
  }, [measuring]);

  const [mergedMeasuring, mergedMeasureText, mergedMeasurePrefix, mergedMeasureLocation] =
    React.useMemo<
      [typeof measuring, typeof measureText, typeof measurePrefix, typeof measureLocation]
    >(() => {
      if (open) {
        warning(
          false,
          'usage',
          '`open` of Mentions is only used for debug usage. Do not use in you production.',
        );

        for (let i = 0; i < mergedPrefix.length; i += 1) {
          const curPrefix = mergedPrefix[i];
          const index = mergedValue.lastIndexOf(curPrefix);
          if (index >= 0) {
            return [true, '', curPrefix, index];
          }
        }
      }

      return [measuring, measureText, measurePrefix, measureLocation];
    }, [open, measuring, mergedPrefix, mergedValue, measureText, measurePrefix, measureLocation]);

  // ============================== Option ==============================
  const getOptions = React.useCallback(
    (targetMeasureText: string) => {
      const list =
        options?.map((item) => ({
          ...item,
          key: item?.key ?? item.value,
        })) ?? [];

      return list.filter((option: MentionsOptionProps) => {
        /** Return all result if `filterOption` is false. */
        if (filterOption === false) {
          return true;
        }
        return filterOption(targetMeasureText, option);
      });
    },
    [options, filterOption],
  );

  const mergedOptions = React.useMemo(
    () => getOptions(mergedMeasureText),
    [getOptions, mergedMeasureText],
  );

  // ============================= Measure ==============================
  // Mark that we will reset input selection to target position when user select option
  const onSelectionEffect = useEffectState();

  const startMeasure = (
    nextMeasureText: string,
    nextMeasurePrefix: string,
    nextMeasureLocation: number,
  ) => {
    setMeasuring(true);
    setMeasureText(nextMeasureText);
    setMeasurePrefix(nextMeasurePrefix);
    setMeasureLocation(nextMeasureLocation);
    setActiveIndex(0);
  };

  const stopMeasure = (callback?: VoidFunction) => {
    setMeasuring(false);
    setMeasureLocation(0);
    setMeasureText('');
    onSelectionEffect(callback);
  };

  // ============================== Change ==============================
  const triggerChange = (nextValue: string) => {
    setMergedValue(nextValue);
    onChange?.(nextValue);
  };

  const onInternalChange = (nextValue: string) => {
    triggerChange(nextValue);
  };

  const selectOption = (option: MentionsOptionProps) => {
    const { value: mentionValue = '' } = option;
    const { text, selectionLocation } = replaceWithMeasure(mergedValue, {
      measureLocation: mergedMeasureLocation,
      targetText: mentionValue,
      prefix: mergedMeasurePrefix,
      selectionStart: getTextArea()!.selectionStart,
      split,
    });
    triggerChange(text);
    stopMeasure(() => {
      // We need restore the selection position
      setInputSelection(getTextArea()!, selectionLocation);
    });

    onSelect?.(option, mergedMeasurePrefix);
  };

  // ============================= KeyEvent =============================
  // Check if hit the measure keyword
  const onInternalKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { key } = event;

    onKeyDown?.(event);

    // Skip if not measuring
    if (!mergedMeasuring) {
      return;
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      // Control arrow function
      const optionLen = mergedOptions.length;
      const offset = key === 'ArrowUp' ? -1 : 1;
      const newActiveIndex = (activeIndex + offset + optionLen) % optionLen;
      setActiveIndex(newActiveIndex);
      event.preventDefault();
    } else if (key === 'Escape') {
      stopMeasure();
    } else if (key === 'Enter') {
      // Measure hit
      event.preventDefault();
      // loading skip
      if (silent) {
        return;
      }

      if (!mergedOptions.length) {
        stopMeasure();
        return;
      }
      const option = mergedOptions[activeIndex];
      selectOption(option);
    }
  };

  /**
   * When to start measure:
   * 1. When user press `prefix`
   * 2. When measureText !== prevMeasureText
   *  - If measure hit
   *  - If measuring
   *
   * When to stop measure:
   * 1. Selection is out of range
   * 2. Contains `space`
   * 3. ESC or select one
   */
  const onInternalKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { key } = event;
    const target = event.target as HTMLTextAreaElement;
    const selectionStartText = getBeforeSelectionText(target);
    const { location: measureIndex, prefix: nextMeasurePrefix } = getLastMeasureIndex(
      selectionStartText,
      mergedPrefix,
    );

    // If the client implements an onKeyUp handler, call it
    onKeyUp?.(event);

    // Skip if match the white key list
    if (['Escape', 'ArrowUp', 'ArrowDown', 'Enter'].indexOf(key) !== -1) {
      return;
    }

    if (measureIndex !== -1) {
      const nextMeasureText = selectionStartText.slice(measureIndex + nextMeasurePrefix.length);
      const validateMeasure: boolean = validateSearch(nextMeasureText, split);
      const matchOption = !!getOptions(nextMeasureText).length;

      if (validateMeasure) {
        if (
          key === nextMeasurePrefix ||
          key === 'Shift' ||
          mergedMeasuring ||
          (nextMeasureText !== mergedMeasureText && matchOption)
        ) {
          startMeasure(nextMeasureText, nextMeasurePrefix, measureIndex);
        }
      } else if (mergedMeasuring) {
        // Stop if measureText is invalidate
        stopMeasure();
      }

      /**
       * We will trigger `onSearch` to developer since they may use for async update.
       * If met `space` means user finished searching.
       */
      if (onSearch && validateMeasure) {
        onSearch(nextMeasureText, nextMeasurePrefix);
      }
    } else if (mergedMeasuring) {
      stopMeasure();
    }
  };

  const onInternalPressEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (!mergedMeasuring && onPressEnter) {
      onPressEnter(event);
    }
  };

  // ============================ Focus Blur ============================
  const focusRef = useRef<number>(undefined);

  const onInternalFocus = (event?: React.FocusEvent<HTMLTextAreaElement>) => {
    window.clearTimeout(focusRef.current);
    if (!focused && event && onFocus) {
      onFocus(event);
    }
    setFocused(true);
  };

  const onInternalBlur = (event?: React.FocusEvent<HTMLTextAreaElement>) => {
    focusRef.current = window.setTimeout(() => {
      setFocused(false);
      stopMeasure();
      onBlur?.(event!);
    }, 0);
  };

  const onDropdownFocus = () => {
    onInternalFocus();
  };

  const onDropdownBlur = () => {
    onInternalBlur();
  };

  // ============================== Style ==============================
  const rootCls = clsx(prefixCls, 'relative inline-block w-full text-sm', semanticCls.root);
  const textareaCls = clsx('resize-none', semanticCls.textarea);
  const measureCls = clsx(
    `${prefixCls}-measure`,
    'pointer-events-none absolute inset-0 -z-1 whitespace-pre-line',
    {
      'px-2 py-1': size === 'small',
      'px-3 py-1.5 leading-6': size === 'middle',
      'px-3 py-2 text-base': size === 'large',
    },
  );

  // ============================== Render ==============================
  return (
    <div className={rootCls} style={style} ref={containerRef}>
      <TextArea
        prefixCls={prefixCls}
        ref={textareaRef}
        value={mergedValue}
        size={size}
        {...restProps}
        rows={rows}
        onChange={onInternalChange}
        onKeyDown={onInternalKeyDown}
        onKeyUp={onInternalKeyUp}
        onPressEnter={onInternalPressEnter}
        onFocus={onInternalFocus}
        onBlur={onInternalBlur}
        className={{ textarea: textareaCls }}
      />
      {mergedMeasuring && (
        <div ref={measureRef} className={measureCls}>
          {mergedValue.slice(0, mergedMeasureLocation)}
          <MentionsContext.Provider
            value={{
              loading,
              notFoundContent,
              activeIndex,
              optionClassName: semanticCls.option,
              setActiveIndex,
              selectOption,
              onFocus: onDropdownFocus,
              onBlur: onDropdownBlur,
            }}
          >
            <KeywordTrigger
              prefixCls={prefixCls}
              placement={placement}
              options={mergedOptions}
              open
              getPopupContainer={getPopupContainer}
              popupClassName={semanticCls.popup}
            >
              <span className="inline-block">{mergedMeasurePrefix}</span>
            </KeywordTrigger>
          </MentionsContext.Provider>
          {mergedValue.slice(mergedMeasureLocation + mergedMeasurePrefix.length)}
        </div>
      )}
    </div>
  );
});

const Mentions = forwardRef<MentionsRef, MentionsProps>(
  (
    {
      prefixCls: customizePrefixCls,
      defaultValue,
      value: customizeValue,
      allowClear,
      onChange,
      className,
      disabled: customDisabled,
      size: customizeSize,
      onClear,
      notFoundContent: customizeNotFoundContent,
      getPopupContainer,
      ...rest
    },
    ref,
  ) => {
    const {
      getPrefixCls,
      renderEmpty,
      getPopupContainer: getContextPopupContainer,
    } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('mentions', customizePrefixCls);

    // =============================== Ref ================================
    const holderRef = useRef<HolderRef>(null);
    const mentionRef = useRef<MentionsRef>(null);

    useImperativeHandle(ref, () => ({
      ...mentionRef.current!,
      nativeElement: holderRef.current?.nativeElement || mentionRef.current!.nativeElement,
    }));

    // ============================== Value ===============================
    const [mergedValue, setMergedValue] = useMergedState('', {
      defaultValue,
      value: customizeValue,
    });

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;

    // ============================== Size ===============================
    const mergedSize = useSize(customizeSize);

    // ============================== Change ==============================
    const triggerChange = (currentValue: string) => {
      setMergedValue(currentValue);
      onChange?.(currentValue);
    };

    // ============================== Reset ===============================
    const handleReset = () => {
      triggerChange('');
    };

    // ============================== Style ===============================
    const semanticCls = useSemanticCls(className, 'mentions', { disabled: mergedDisabled });
    const affixWrapperCls = clsx(
      'text-text relative inline-flex w-full min-w-0 border-0 text-sm',
      {
        'leading-6': mergedSize === 'middle',
        'text-base': mergedSize === 'large',
      },
      semanticCls.root,
    );
    const suffixCls = clsx(
      mergedSize !== 'middle' && `${prefixCls}-suffix-${mergedSize}`,
      'text-text-secondary flex flex-none items-center gap-x-1 [&_.metis-icon]:text-base',
      {
        '[&_.metis-icon]:text-lg': mergedSize === 'large',
      },
      mergedDisabled && 'text-text-tertiary',
    );
    const clearCls = clsx(
      'text-text-tertiary hover:text-text-secondary absolute right-2 inline-flex h-5 items-center',
      {
        'top-2.5': mergedSize === 'large',
        'top-2': mergedSize === 'middle',
        'top-1.5': mergedSize === 'small',
        'top-1': mergedSize === 'mini',
      },
      semanticCls.clear,
    );
    const textareaCls = clsx(
      {
        'pe-8': allowClear,
      },
      semanticCls.textarea,
    );

    // ============================== Render ===============================
    const notFoundContent = React.useMemo<React.ReactNode>(() => {
      if (customizeNotFoundContent !== undefined) {
        return customizeNotFoundContent;
      }
      return renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />;
    }, [customizeNotFoundContent, renderEmpty]);

    return (
      <BaseInput
        prefixCls={prefixCls}
        value={mergedValue}
        allowClear={allowClear}
        handleReset={handleReset}
        disabled={mergedDisabled}
        ref={holderRef}
        onClear={onClear}
        className={{
          affixWrapper: affixWrapperCls,
          clear: clearCls,
          suffix: suffixCls,
        }}
      >
        <InternalMentions
          className={mergeSemanticCls(allowClear ? { ...semanticCls, root: '' } : semanticCls, {
            textarea: textareaCls,
          })}
          prefixCls={prefixCls}
          ref={mentionRef}
          onChange={triggerChange}
          disabled={mergedDisabled}
          size={mergedSize}
          notFoundContent={notFoundContent}
          getPopupContainer={getPopupContainer ?? getContextPopupContainer}
          {...rest}
        />
      </BaseInput>
    );
  },
) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MentionsProps> & React.RefAttributes<MentionsRef>
>;

if (process.env.NODE_ENV !== 'production') {
  Mentions.displayName = 'Mentions';
}

type CompoundedComponent = typeof Mentions & {
  getMentions: (value: string, config?: MentionsConfig) => MentionsEntity[];
};

const _Mentions = Mentions as CompoundedComponent;

_Mentions.getMentions = (value = '', config: MentionsConfig = {}): MentionsEntity[] => {
  const { prefix = '@', split = ' ' } = config;
  const prefixList: string[] = toArray(prefix, false);

  return value
    .split(split)
    .map((str = ''): MentionsEntity | null => {
      let hitPrefix: string | null = null;

      prefixList.some((prefixStr) => {
        const startStr = str.slice(0, prefixStr.length);
        if (startStr === prefixStr) {
          hitPrefix = prefixStr;
          return true;
        }
        return false;
      });

      if (hitPrefix !== null) {
        return {
          prefix: hitPrefix,
          value: str.slice((hitPrefix as string).length),
        };
      }
      return null;
    })
    .filter((entity): entity is MentionsEntity => !!entity && !!entity.value);
};

export default _Mentions;
