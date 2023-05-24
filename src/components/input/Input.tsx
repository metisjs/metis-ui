import { XCircleSolid } from '@metaoa/icons';
import type { InputRef, InputProps as RcInputProps } from 'rc-input';
import RcInput from 'rc-input';
import type { BaseInputProps } from 'rc-input/lib/interface';
import { composeRef } from 'rc-util/lib/ref';
import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import { ComplexClassName, clsx, getClassNames } from '../_util/classNameUtils';
import cva from '../_util/cva';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext, NoFormStyle } from '../form/context';
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
  className?: ComplexClassName<'input' | 'prefix' | 'suffix' | 'count'>;
  size?: SizeType;
  disabled?: boolean;
  status?: InputStatus;
  bordered?: boolean;
  [key: `data-${string}`]: string | undefined;
}

const inputVariantStyles = cva(
  'relative block w-full rounded-md border-0 px-3 py-1.5 text-sm leading-6 text-neutral-text ring-1 ring-inset ring-neutral-border placeholder:text-neutral-text-quaternary focus:ring-2 focus:ring-inset focus:ring-primary',
  {
    variants: {
      size: {
        small: '',
        middle: '',
        large: '',
      },
      borderless: { true: '' },
    },
  },
);

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    bordered = true,
    status: customStatus,
    size: customSize,
    disabled: customDisabled,
    onBlur,
    onFocus,
    suffix,
    allowClear,
    addonAfter,
    addonBefore,
    className,
    onChange,
    ...rest
  } = props;
  const classNames = getClassNames(className);
  const { input } = React.useContext(ConfigContext);

  const inputRef = useRef<InputRef>(null);

  // ===================== Compact Item =====================
  const { compactSize, compactItemClassnames } = useCompactItemContext();

  // ===================== Size =====================
  const mergedSize = useSize((ctx) => compactSize ?? customSize ?? ctx);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Status =====================
  const { status: contextStatus, hasFeedback, feedbackIcon } = useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ===================== Focus warning =====================
  const inputHasPrefixSuffix = hasPrefixSuffix(props) || !!hasFeedback;
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
    mergedAllowClear = { clearIcon: <XCircleSolid /> };
  }

  return (
    <RcInput
      ref={composeRef(ref, inputRef)}
      autoComplete={input?.autoComplete}
      {...rest}
      disabled={mergedDisabled}
      onBlur={handleBlur}
      onFocus={handleFocus}
      suffix={suffixNode}
      allowClear={mergedAllowClear}
      className={clsx(classNames.root, compactItemClassnames)}
      onChange={handleChange}
      addonAfter={
        addonAfter && (
          <NoCompactStyle>
            <NoFormStyle override status>
              {addonAfter}
            </NoFormStyle>
          </NoCompactStyle>
        )
      }
      addonBefore={
        addonBefore && (
          <NoCompactStyle>
            <NoFormStyle override status>
              {addonBefore}
            </NoFormStyle>
          </NoCompactStyle>
        )
      }
      classNames={{
        ...classNames,
        input: inputVariantStyles(
          {
            size: mergedSize,
            borderless: !bordered,
          },
          [!inputHasPrefixSuffix && getStatusClassNames(mergedStatus), classNames.input],
        ),
      }}
      classes={{
        affixWrapper: clsx(
          {
            '[`${prefixCls}-affix-wrapper-sm`]': mergedSize === 'small',
            '[`${prefixCls}-affix-wrapper-lg`]': mergedSize === 'large',
            '[`${prefixCls}-affix-wrapper-borderless`]': !bordered,
          },
          getStatusClassNames(mergedStatus, hasFeedback),
        ),
        group: clsx(
          {
            '[`${prefixCls}-group-wrapper-sm`]': mergedSize === 'small',
            '[`${prefixCls}-group-wrapper-lg`]': mergedSize === 'large',
            '[`${prefixCls}-group-wrapper-disabled`]': mergedDisabled,
          },
          getStatusClassNames(mergedStatus, hasFeedback),
        ),
      }}
    />
  );
});

export default Input;
