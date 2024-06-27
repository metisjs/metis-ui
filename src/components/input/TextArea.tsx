import { XCircleSolid } from '@metisjs/icons';
import type { BaseInputProps } from 'rc-input/lib/interface';
import type { TextAreaRef as RcTextAreaRef } from 'rc-textarea';
import RcTextArea from 'rc-textarea';
import type { TextAreaProps as RcTextAreaProps } from 'rc-textarea/lib/interface';
import * as React from 'react';
import { forwardRef } from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { SizeType } from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import useVariant, { Variant } from '../form/hooks/useVariants';
import type { InputFocusOptions } from './Input';
import { triggerFocus } from './Input';

export interface TextAreaProps
  extends Omit<RcTextAreaProps, 'suffix' | 'className' | 'classNames'> {
  className?: SemanticClassName<'textarea' | 'count' | 'clear'>;
  size?: SizeType;
  status?: InputStatus;
  variant?: Variant;
}

export interface TextAreaRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}

const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  (
    {
      prefixCls: customizePrefixCls,
      size: customizeSize,
      disabled: customDisabled,
      status: customStatus,
      allowClear,
      showCount,
      className,
      variant: customVariant,
      ...rest
    },
    ref,
  ) => {
    const semanticCls = getSemanticCls(className);
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

    const [variant, enableVariantCls] = useVariant(customVariant);

    const textareaCls = clsx(
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
        'pr-8': mergedAllowClear,
      },
      semanticCls.textarea,
      getStatusClassNames(mergedStatus),
    );
    const affixWrapperCls = clsx(
      'group',
      'relative inline-flex w-full min-w-0 border-0 text-sm text-neutral-text',
      {
        'leading-6': mergedSize === 'middle',
        'text-base': mergedSize === 'large',
      },
    );
    const countCls = clsx(
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
    const variantCls = clsx({
      [`${prefixCls}-${variant}`]: enableVariantCls,
    });

    return (
      <RcTextArea
        {...rest}
        prefixCls={prefixCls}
        className={semanticCls.root}
        disabled={mergedDisabled}
        allowClear={mergedAllowClear}
        classNames={{
          affixWrapper: affixWrapperCls,
          textarea: textareaCls,
          count: countCls,
          clear: clearCls,
          variant: variantCls,
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
