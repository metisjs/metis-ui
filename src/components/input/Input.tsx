import { XCircleSolid } from '@metaoa/icons';
import type { InputRef, InputProps as RcInputProps } from 'rc-input';
import RcInput from 'rc-input';
import type { BaseInputProps } from 'rc-input/lib/interface';
import { composeRef } from 'rc-util/lib/ref';
import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import { ComplexClassName, clsx, getClassNames } from '../_util/classNameUtils';
import cva from '../_util/cva';
import { InputStatus, getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
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
  'relative inline-block w-full rounded-md border-0 bg-neutral-bg-container text-sm text-neutral-text ring-1 ring-inset ring-neutral-border placeholder:text-neutral-text-quaternary focus:ring-2 focus:ring-inset focus:ring-primary',
  {
    variants: {
      size: {
        small: 'px-2 py-1.5',
        middle: 'px-3 py-1.5 leading-6',
        large: 'px-3 py-2 text-base',
      },
      borderless: { true: 'ring-0 focus:ring-0' },
      hasPrefixSuffix: { true: 'rounded-none p-0 ring-0 focus:ring-0' },
      addonBefore: { true: 'rounded-s-none' },
      addonAfter: { true: 'rounded-e-none' },
      disabled: { true: 'bg-transparent' },
    },
    compoundVariants: [
      {
        hasPrefixSuffix: false,
        disabled: true,
        className: 'bg-neutral-fill-tertiary text-neutral-text-quaternary',
      },
    ],
    defaultVariants: {
      size: 'middle',
    },
  },
);

const affixWrapperVariantStyles = cva(
  'relative inline-flex w-full items-center gap-x-2 rounded-md border-0 bg-neutral-bg-container text-sm text-neutral-text ring-1 ring-inset ring-neutral-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary',
  {
    variants: {
      size: {
        small: 'gap-x-1 px-2 py-1.5',
        middle: 'px-3 py-1.5 leading-6',
        large: 'px-3 py-2 text-base',
      },
      borderless: { true: 'ring-0 focus:ring-0' },
      addonBefore: { true: 'rounded-s-none' },
      addonAfter: { true: 'rounded-e-none' },
      disabled: { true: 'bg-neutral-fill-tertiary text-neutral-text-quaternary' },
    },
    defaultVariants: {
      size: 'middle',
    },
  },
);

const addonBeforeWrapperVariantStyles = cva(
  '-mr-[1px] inline-flex items-center rounded-s-md bg-neutral-bg-container text-sm text-neutral-text-secondary ring-1 ring-inset ring-neutral-border',
  {
    variants: {
      size: {
        small: 'h-8 px-2',
        middle: 'h-9  px-3',
        large: 'h-10 px-3 text-base',
      },
      borderless: { true: 'ring-0' },
      disabled: { true: 'bg-neutral-fill-tertiary text-neutral-text-quaternary' },
    },
    defaultVariants: {
      size: 'middle',
    },
  },
);

const addonAfterWrapperVariantStyles = cva(
  '-ml-[1px] inline-flex items-center rounded-e-md bg-neutral-bg-container text-sm text-neutral-text-secondary ring-1 ring-inset ring-neutral-border',
  {
    variants: {
      size: {
        small: 'h-8 px-2',
        middle: 'h-9  px-3',
        large: 'h-10 px-3 text-base',
      },
      borderless: { true: 'ring-0' },
      disabled: { true: 'bg-neutral-fill-quaternary text-neutral-text-quaternary' },
    },
    defaultVariants: {
      size: 'middle',
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
    prefix,
    suffix,
    allowClear,
    addonAfter,
    addonBefore,
    className,
    onChange,
    showCount,
    ...rest
  } = props;
  const classNames = getClassNames(className);
  const { getPrefixCls, input } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('input');
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
      className={clsx(classNames.root, compactItemClassnames)}
      onChange={handleChange}
      addonAfter={
        addonAfter && (
          <NoCompactStyle>
            <NoFormStyle override status>
              <span
                className={addonAfterWrapperVariantStyles({
                  size: mergedSize,
                  borderless: !bordered,
                  disabled: !!mergedDisabled,
                })}
              >
                {addonAfter}
              </span>
            </NoFormStyle>
          </NoCompactStyle>
        )
      }
      addonBefore={
        addonBefore && (
          <NoCompactStyle>
            <NoFormStyle override status>
              <span
                className={addonBeforeWrapperVariantStyles({
                  size: mergedSize,
                  borderless: !bordered,
                  disabled: !!mergedDisabled,
                })}
              >
                {addonBefore}
              </span>
            </NoFormStyle>
          </NoCompactStyle>
        )
      }
      classNames={{
        input: inputVariantStyles(
          {
            size: mergedSize,
            borderless: !bordered,
            disabled: !!mergedDisabled,
            hasPrefixSuffix: inputHasPrefixSuffix,
            addonAfter: !!addonAfter,
            addonBefore: !!addonBefore,
          },
          [
            mergedSize,
            !inputHasPrefixSuffix && getStatusClassNames(mergedStatus),
            classNames.input,
          ],
        ),
        prefix: clsx(
          'flex flex-none items-center text-neutral-text-secondary',
          mergedDisabled && 'text-neutral-text-quaternary',
          mergedSize === 'small' && `${prefixCls}-prefix-small`,
          classNames.prefix,
        ),
        suffix: clsx(
          'flex flex-none items-center gap-x-1 text-neutral-text-secondary',
          mergedDisabled && 'text-neutral-text-quaternary',
          mergedSize === 'small' && `${prefixCls}-suffix-small`,
          classNames.suffix,
        ),
        count: clsx(
          'text-neutral-text-tertiary',
          mergedDisabled && 'text-neutral-text-quaternary',
          classNames.count,
        ),
        clear: 'flex items-center text-neutral-text-quaternary hover:text-neutral-text-tertiary',
      }}
      classes={{
        affixWrapper: affixWrapperVariantStyles(
          {
            size: mergedSize,
            borderless: !bordered,
            disabled: !!mergedDisabled,
            addonAfter: !!addonAfter,
            addonBefore: !!addonBefore,
          },
          [getStatusClassNames(mergedStatus, hasFeedback)],
        ),
        group: 'inline-block w-full text-start align-top',
        wrapper: clsx('flex items-center', mergedSize),
      }}
    />
  );
});

export default Input;
