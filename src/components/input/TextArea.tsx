import { XCircleSolid } from '@metisjs/icons';
import type { BaseInputProps } from 'rc-input/lib/interface';
import type { TextAreaRef as RcTextAreaRef } from 'rc-textarea';
import RcTextArea from 'rc-textarea';
import type { TextAreaProps as RcTextAreaProps } from 'rc-textarea/lib/interface';
import * as React from 'react';
import { forwardRef } from 'react';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import cva from '../_util/cva';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import type { InputFocusOptions } from './Input';
import { triggerFocus } from './Input';

export interface TextAreaProps
  extends Omit<RcTextAreaProps, 'suffix' | 'className' | 'classNames'> {
  className?: ComplexClassName<'textarea' | 'count'>;
  bordered?: boolean;
  size?: SizeType;
  status?: InputStatus;
}

export interface TextAreaRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}

const textareaVariantStyles = cva(
  'relative block h-full w-full rounded-md border-0 bg-neutral-bg-container text-sm text-neutral-text shadow-sm ring-1 ring-inset ring-neutral-border placeholder:text-neutral-text-quaternary focus:ring-2 focus:ring-inset focus:ring-primary',
  {
    variants: {
      size: {
        small: 'py- px-2',
        middle: 'px-3 py-1.5 leading-6',
        large: 'px-3 py-2 text-base',
      },
      borderless: { true: 'ring-0 focus:ring-0' },
      disabled: { true: 'bg-neutral-fill-tertiary text-neutral-text-quaternary' },
      allowClear: { true: 'pr-8' },
    },
    defaultVariants: {
      size: 'middle',
    },
  },
);

const affixWrapperVariantStyles = cva(
  'relative inline-flex w-full min-w-0 border-0 text-sm text-neutral-text',
  {
    variants: {
      size: {
        small: '',
        middle: 'leading-6',
        large: 'text-base',
      },
      borderless: { true: 'ring-0 focus:ring-0' },
      disabled: { true: 'bg-neutral-fill-tertiary text-neutral-text-quaternary' },
    },
    defaultVariants: {
      size: 'middle',
    },
  },
);

const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  (
    {
      prefixCls: customizePrefixCls,
      bordered = true,
      size: customizeSize,
      disabled: customDisabled,
      status: customStatus,
      allowClear,
      showCount,
      className,
      ...rest
    },
    ref,
  ) => {
    const complexCls = getComplexCls(className);
    const { getPrefixCls } = React.useContext(ConfigContext);

    // ===================== Size =====================
    const mergedSize = useSize(customizeSize);

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;

    // ===================== Status =====================
    const {
      status: contextStatus,
      hasFeedback,
      feedbackIcon,
    } = React.useContext(FormItemInputContext);
    const mergedStatus = getMergedStatus(contextStatus, customStatus);

    // ===================== Ref =====================
    const innerRef = React.useRef<RcTextAreaRef>(null);

    React.useImperativeHandle(ref, () => ({
      resizableTextArea: innerRef.current?.resizableTextArea,
      focus: (option?: InputFocusOptions) => {
        triggerFocus(innerRef.current?.resizableTextArea?.textArea, option);
      },
      blur: () => innerRef.current?.blur(),
    }));

    const prefixCls = getPrefixCls('input', customizePrefixCls);

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
      <RcTextArea
        {...rest}
        className={complexCls.root}
        disabled={mergedDisabled}
        allowClear={mergedAllowClear}
        classes={{
          affixWrapper: affixWrapperVariantStyles(
            {
              size: mergedSize,
              borderless: !bordered,
              disabled: mergedDisabled,
            },
            [getStatusClassNames(mergedStatus)],
          ),
        }}
        classNames={{
          textarea: textareaVariantStyles(
            {
              size: mergedSize,
              borderless: !bordered,
              disabled: mergedDisabled,
              allowClear: !!mergedAllowClear,
            },
            [mergedSize, getStatusClassNames(mergedStatus), complexCls.textarea],
          ),
          count: clsx(
            'absolute bottom-1.5 right-3 bg-neutral-bg-container pl-1 text-neutral-text-tertiary',
            mergedDisabled && 'text-neutral-text-quaternary',
            mergedSize === 'small' && 'right-2',
            mergedSize === 'large' && 'bottom-2',
            complexCls.count,
          ),
          clear: clsx(
            'absolute right-2 top-1 text-neutral-text-tertiary hover:text-neutral-text-secondary',
          ),
        }}
        suffix={
          hasFeedback && <span className={`${prefixCls}-textarea-suffix`}>{feedbackIcon}</span>
        }
        showCount={showCount}
        ref={innerRef}
      />
    );
  },
);

export default TextArea;
