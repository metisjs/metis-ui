import { BaseInputProps, InputFocusOptions, InputProps } from './interface';

export function hasAddon(props: BaseInputProps | InputProps) {
  return !!(props.addonBefore || props.addonAfter);
}
export function hasPrefixSuffix(props: BaseInputProps | InputProps) {
  return !!(props.prefix || props.suffix || props.allowClear);
}

function cloneEvent<
  EventType extends React.SyntheticEvent<any, any>,
  Element extends HTMLInputElement | HTMLTextAreaElement,
>(event: EventType, target: Element, value: any): EventType {
  const currentTarget = target.cloneNode(true) as Element;

  // click clear icon
  const newEvent = Object.create(event, {
    target: { value: currentTarget },
    currentTarget: { value: currentTarget },
  });

  // Fill data
  currentTarget.value = value;

  if (typeof target.selectionStart === 'number' && typeof target.selectionEnd === 'number') {
    currentTarget.selectionStart = target.selectionStart;
    currentTarget.selectionEnd = target.selectionEnd;
  }

  currentTarget.setSelectionRange = (...args) => {
    target.setSelectionRange(...args);
  };

  return newEvent;
}

export function resolveOnChange<E extends HTMLInputElement | HTMLTextAreaElement>(
  target: E,
  e:
    | React.ChangeEvent<E>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.CompositionEvent<HTMLElement>,
  onChange: undefined | ((event: React.ChangeEvent<E>) => void),
  targetValue?: string,
) {
  if (!onChange) {
    return;
  }
  let event = e;

  if (e.type === 'click') {
    event = cloneEvent(e, target, '');

    onChange(event as React.ChangeEvent<E>);
    return;
  }

  if (target.type !== 'file' && targetValue !== undefined) {
    event = cloneEvent(e, target, targetValue);
    onChange(event as React.ChangeEvent<E>);
    return;
  }
  onChange(event as React.ChangeEvent<E>);
}

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
