import { XCircleSolid } from '@metisjs/icons';
import type { InputRef, InputProps as RcInputProps } from 'rc-input';
import RcInput from 'rc-input';
import type { BaseInputProps } from 'rc-input/lib/interface';
import { composeRef } from 'rc-util/lib/ref';
import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import { InputStatus, getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext, NoFormStyle } from '../form/context';
import useVariant, { Variant } from '../form/hooks/useVariants';
import { NoCompactStyle, useCompactItemContext } from '../space/Compact';
import useRemovePasswordTimeout from './hooks/useRemovePasswordTimeout';
import { hasPrefixSuffix } from './utils';

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}

export type { InputRef };

export function triggerFocus(
  element?: HTMLInputElement | HTMLTextAreaElement,
  option?: InputFocusOptions,
) {
  if (!element) {
    return;
  }

  element.focus(option);

  // Selection content
  const { cursor } = option || {};
  if (cursor) {
    const len = element.value.length;

    switch (cursor) {
      case 'start':
        element.setSelectionRange(0, 0);
        break;
      case 'end':
        element.setSelectionRange(len, len);
        break;
      default:
        element.setSelectionRange(0, len);
        break;
    }
  }
}

export interface InputProps extends Omit<RcInputProps, 'classes' | 'className' | 'classNames'> {
  className?: SemanticClassName<'input' | 'prefix' | 'suffix' | 'count'>;
  size?: SizeType;
  disabled?: boolean;
  status?: InputStatus;
  variant?: Variant;
  [key: `data-${string}`]: string | undefined;
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    status: customStatus,
    size: customSize = 'middle',
    disabled: customDisabled,
    onBlur,
    onFocus,
    prefix,
    suffix,
    allowClear,
    addonAfter,
    addonBefore,
    className,
    onChange,
    showCount,
    variant: customVariant,
    ...rest
  } = props;
  const semanticCls = getSemanticCls(className);
  const { getPrefixCls, input } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('input', customizePrefixCls);
  const inputRef = useRef<InputRef>(null);

  // ===================== Compact Item =====================
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  // ===================== Size =====================
  const mergedSize = useSize((ctx) => compactSize ?? customSize ?? ctx);

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
        document.activeElement === inputRef.current?.input,
        'Input',
        `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change.`,
      );
    }
    prevHasPrefixSuffix.current = inputHasPrefixSuffix;
  }, [inputHasPrefixSuffix]);

  // ===================== Remove Password value =====================
  const removePasswordTimeout = useRemovePasswordTimeout(inputRef, true);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    onFocus?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    onChange?.(e);
  };

  const suffixNode = (hasFeedback || suffix) && (
    <>
      {suffix}
      {hasFeedback && feedbackIcon}
    </>
  );

  // Allow clear
  let mergedAllowClear: BaseInputProps['allowClear'];
  if (typeof allowClear === 'object' && allowClear?.clearIcon) {
    mergedAllowClear = allowClear;
  } else if (allowClear) {
    mergedAllowClear = {
      clearIcon: <XCircleSolid className="h-4 w-4" />,
    };
  }

  const [variant, enableVariantCls] = useVariant(customVariant);

  const rootCls = clsx(
    'rounded-md shadow-sm',
    variant === 'borderless' && 'shadow-none',
    semanticCls.root,
  );
  const wrapperCls = clsx('flex items-center');
  const groupWrapperCls = clsx(
    'inline-block w-full bg-neutral-bg-container text-start align-top',
    {
      'bg-neutral-fill-quinary': variant === 'filled',
    },
    {
      'text-neutral-text-quaternary': mergedDisabled,
      'bg-neutral-fill-quaternary ': mergedDisabled && variant !== 'borderless',
    },
    rootCls,
  );
  const inputCls = clsx(
    'relative inline-block w-full rounded-md border-0 bg-neutral-bg-container text-sm text-neutral-text ring-inset ring-neutral-border placeholder:text-neutral-text-quaternary focus:ring-inset focus:ring-primary',
    {
      'px-2 py-1.5': mergedSize === 'small',
      'px-3 py-1.5 leading-6': mergedSize === 'middle',
      'px-3 py-2 text-base': mergedSize === 'large',
    },
    {
      'ring-1 focus:ring-2': variant === 'outlined',
      'ring-0 focus:ring-0': variant === 'borderless',
      'bg-neutral-fill-quinary ring-0 focus:bg-neutral-bg-container focus:ring-2':
        variant === 'filled',
    },
    {
      'rounded-none p-0 ring-0 focus:ring-0': inputHasPrefixSuffix,
      'rounded-s-none': addonBefore,
      'rounded-e-none': addonAfter,
      'bg-transparent text-neutral-text-quaternary': mergedDisabled,
    },
    !inputHasPrefixSuffix &&
      !addonBefore &&
      !addonAfter &&
      mergedDisabled &&
      variant !== 'borderless' &&
      'bg-neutral-fill-quaternary',
    !addonBefore && !addonAfter && !inputHasPrefixSuffix && rootCls,
    semanticCls.input,
    !inputHasPrefixSuffix && getStatusClassNames(mergedStatus),
    compactItemClassnames,
  );
  const affixWrapperCls = clsx(
    'relative inline-flex w-full items-center gap-x-2 border-0 bg-neutral-bg-container text-sm text-neutral-text ring-inset ring-neutral-border focus-within:ring-inset focus-within:ring-primary',
    {
      'gap-x-1 px-2 py-1.5': mergedSize === 'small',
      'px-3 py-1.5 leading-6': mergedSize === 'middle',
      'px-3 py-2 text-base': mergedSize === 'large',
    },
    {
      'ring-1 focus-within:ring-2': variant === 'outlined',
      'ring-0 focus-within:ring-0': variant === 'borderless',
      'bg-neutral-fill-quinary ring-0 focus-within:bg-neutral-bg-container focus-within:ring-2':
        variant === 'filled',
    },
    {
      'rounded-s-none': addonBefore,
      'rounded-e-none': addonAfter,
      'text-neutral-text-quaternary': mergedDisabled,
      'bg-neutral-fill-quaternary ': mergedDisabled && variant !== 'borderless',
    },
    !addonBefore && !addonAfter && rootCls,
    getStatusClassNames(mergedStatus, hasFeedback),
  );
  const addonBeforeWrapperCls = clsx(
    'input-addon -mr-[1px] inline-flex items-center rounded-s-md text-sm text-neutral-text-secondary ring-inset ring-neutral-border',
    {
      'h-8 px-2': mergedSize === 'small',
      'h-9 px-3': mergedSize === 'middle',
      'h-10 px-3 text-base': mergedSize === 'large',
    },
    {
      'ring-1': variant === 'outlined',
      'ring-0': variant === 'borderless' || variant === 'filled',
    },
    {
      'text-neutral-text-quaternary': mergedDisabled,
    },
  );
  const addonAfterWrapperCls = clsx(
    'input-addon -ml-[1px] inline-flex items-center rounded-e-md text-sm text-neutral-text-secondary ring-inset ring-neutral-border',
    {
      'h-8 px-2': mergedSize === 'small',
      'h-9 px-3': mergedSize === 'middle',
      'h-10 px-3 text-base': mergedSize === 'large',
    },
    {
      'ring-1': variant === 'outlined',
      'ring-0': variant === 'borderless' || variant === 'filled',
    },
    {
      'text-neutral-text-quaternary': mergedDisabled,
    },
  );
  const _prefixCls = clsx(
    mergedSize !== 'middle' && `${prefixCls}-prefix-${mergedSize}`,
    'flex flex-none items-center text-neutral-text-secondary',
    mergedDisabled && 'text-neutral-text-quaternary',
    semanticCls.prefix,
  );
  const suffixCls = clsx(
    mergedSize !== 'middle' && `${prefixCls}-suffix-${mergedSize}`,
    'flex flex-none items-center gap-x-1 text-neutral-text-secondary',
    mergedDisabled && 'text-neutral-text-quaternary',
    semanticCls.suffix,
  );
  const countCls = clsx(
    'text-neutral-text-tertiary',
    mergedDisabled && 'text-neutral-text-quaternary',
    semanticCls.count,
  );
  const clearCls = clsx(
    'flex items-center text-neutral-text-quaternary hover:text-neutral-text-tertiary',
  );
  const variantCls = clsx({
    [`${prefixCls}-${variant}`]: enableVariantCls,
  });

  return (
    <RcInput
      prefixCls={prefixCls}
      ref={composeRef(ref, inputRef)}
      autoComplete={input?.autoComplete}
      showCount={showCount}
      {...rest}
      disabled={mergedDisabled}
      onBlur={handleBlur}
      onFocus={handleFocus}
      prefix={prefix}
      suffix={suffixNode}
      allowClear={mergedAllowClear}
      className={clsx(
        'rounded-md shadow-sm',
        variant === 'borderless' && 'shadow-none',
        semanticCls.root,
      )}
      onChange={handleChange}
      addonAfter={
        addonAfter && (
          <NoCompactStyle>
            <NoFormStyle override status>
              <span className={addonAfterWrapperCls}>{addonAfter}</span>
            </NoFormStyle>
          </NoCompactStyle>
        )
      }
      addonBefore={
        addonBefore && (
          <NoCompactStyle>
            <NoFormStyle override status>
              <span className={addonBeforeWrapperCls}>{addonBefore}</span>
            </NoFormStyle>
          </NoCompactStyle>
        )
      }
      classNames={{
        wrapper: wrapperCls,
        affixWrapper: affixWrapperCls,
        groupWrapper: groupWrapperCls,
        input: inputCls,
        variant: variantCls,
        prefix: _prefixCls,
        suffix: suffixCls,
        count: countCls,
        clear: clearCls,
      }}
    />
  );
});

export default Input;
