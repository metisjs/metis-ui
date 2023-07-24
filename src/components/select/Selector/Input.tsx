import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import warning from '../../_util/warning';

type InputRef = HTMLInputElement | HTMLTextAreaElement;

interface InputProps {
  prefixCls: string;
  id: string;
  className?: string;
  inputElement: React.ReactElement | null;
  disabled: boolean;
  autoFocus: boolean;
  autoComplete?: string;
  editable: boolean;
  activeDescendantId?: string;
  value: string;
  maxLength?: number;
  open: boolean;
  tabIndex?: number;
  /** Pass accessibility props to input */
  attrs: Record<string, unknown>;

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onMouseDown: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onPaste: React.ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onCompositionStart: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLElement
  >;
  onCompositionEnd: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLElement
  >;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  {
    prefixCls,
    id,
    className,
    inputElement,
    disabled,
    tabIndex,
    autoFocus,
    autoComplete,
    editable,
    activeDescendantId,
    value,
    maxLength,
    onKeyDown,
    onMouseDown,
    onChange,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
    open,
    attrs,
  },
  ref,
) => {
  let inputNode: any = inputElement || <input />;

  const { ref: originRef, props: originProps } = inputNode;

  const {
    onKeyDown: onOriginKeyDown,
    onChange: onOriginChange,
    onMouseDown: onOriginMouseDown,
    onCompositionStart: onOriginCompositionStart,
    onCompositionEnd: onOriginCompositionEnd,
    style,
  } = originProps;

  warning(
    !('maxLength' in inputNode.props),
    `Passing 'maxLength' to input element directly may not work because input in BaseSelect is controlled.`,
  );

  inputNode = React.cloneElement(inputNode, {
    type: 'search',
    ...originProps,

    // Override over origin props
    id,
    ref: composeRef(ref, originRef as any),
    disabled,
    tabIndex,
    autoComplete: autoComplete || 'off',

    autoFocus,
    className: clsx(
      `${prefixCls}-selection-search-input`,
      'search h-full w-full border-0 bg-transparent p-0 pe-2 text-sm text-neutral-text outline-0 focus:outline-0 focus:ring-0',
      className,
      inputNode?.props?.className,
    ),

    role: 'combobox',
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
    'aria-owns': `${id}_list`,
    'aria-autocomplete': 'list',
    'aria-controls': `${id}_list`,
    'aria-activedescendant': activeDescendantId,
    ...attrs,
    value: editable ? value : '',
    maxLength,
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,

    style: { ...style, opacity: editable ? null : 0 },

    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown(event);
      if (onOriginKeyDown) {
        onOriginKeyDown(event);
      }
    },
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
      onMouseDown(event);
      if (onOriginMouseDown) {
        onOriginMouseDown(event);
      }
    },
    onChange: (event: React.ChangeEvent<HTMLElement>) => {
      onChange(event);
      if (onOriginChange) {
        onOriginChange(event);
      }
    },
    onCompositionStart(event: React.CompositionEvent<HTMLElement>) {
      onCompositionStart(event);
      if (onOriginCompositionStart) {
        onOriginCompositionStart(event);
      }
    },
    onCompositionEnd(event: React.CompositionEvent<HTMLElement>) {
      onCompositionEnd(event);
      if (onOriginCompositionEnd) {
        onOriginCompositionEnd(event);
      }
    },
    onPaste,
  });

  return inputNode;
};

const RefInput = React.forwardRef<InputRef, InputProps>(Input);
RefInput.displayName = 'Input';

export default RefInput;
