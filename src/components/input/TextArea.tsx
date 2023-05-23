import { XCircleSolid } from '@metaoa/icons';
import type { BaseInputProps } from 'rc-input/lib/interface';
import type { TextAreaRef as RcTextAreaRef } from 'rc-textarea';
import RcTextArea from 'rc-textarea';
import type { TextAreaProps as RcTextAreaProps } from 'rc-textarea/lib/interface';
import * as React from 'react';
import { forwardRef } from 'react';
import { ComplexClassName, clsx, getClassNames } from '../_util/classNameUtils';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
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

const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  (
    {
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
    const classNames = getClassNames(className);

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

    // Allow clear
    let mergedAllowClear: BaseInputProps['allowClear'];
    if (typeof allowClear === 'object' && allowClear?.clearIcon) {
      mergedAllowClear = allowClear;
    } else if (allowClear) {
      mergedAllowClear = { clearIcon: <XCircleSolid /> };
    }

    return (
      <RcTextArea
        {...rest}
        className={classNames.root}
        disabled={mergedDisabled}
        allowClear={mergedAllowClear}
        classes={{
          affixWrapper: clsx(
            `-textarea-affix-wrapper`,
            {
              [`-affix-wrapper-borderless`]: !bordered,
              [`-affix-wrapper-sm`]: mergedSize === 'small',
              [`-affix-wrapper-lg`]: mergedSize === 'large',
              [`-textarea-show-count`]: showCount,
            },
            getStatusClassNames(mergedStatus),
          ),
        }}
        classNames={{
          ...classNames,
          textarea: clsx(
            {
              [`-borderless`]: !bordered,
              [`-sm`]: mergedSize === 'small',
              [`-lg`]: mergedSize === 'large',
            },
            getStatusClassNames(mergedStatus),
            classNames?.textarea,
          ),
        }}
        suffix={hasFeedback && <span className={`-textarea-suffix`}>{feedbackIcon}</span>}
        showCount={showCount}
        ref={innerRef}
      />
    );
  },
);

export default TextArea;
