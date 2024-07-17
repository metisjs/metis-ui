import type {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import { SemanticClassName } from '../_util/classNameUtils';
import { InputStatus } from '../_util/statusUtils';
import { LiteralUnion } from '../_util/type';
import { Variant } from '../config-provider';
import { SizeType } from '../config-provider/SizeContext';

type DataAttr = Record<`data-${string}`, string>;

export type ValueType = InputHTMLAttributes<HTMLInputElement>['value'] | bigint;

export interface CommonInputProps {
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  allowClear?: boolean | { clearIcon?: ReactNode };
}

export interface BaseInputProps extends CommonInputProps {
  value?: ValueType;
  prefixCls?: string;
  className?: SemanticClassName<
    'affixWrapper' | 'prefix' | 'suffix' | 'groupWrapper' | 'wrapper' | 'clear'
  >;
  style?: CSSProperties;
  disabled?: boolean;
  focused?: boolean;
  triggerFocus?: () => void;
  readOnly?: boolean;
  handleReset?: MouseEventHandler;
  onClear?: () => void;
  hidden?: boolean;
  dataAttrs?: {
    affixWrapper?: DataAttr;
  };
  components?: {
    affixWrapper?: 'span' | 'div';
    groupWrapper?: 'span' | 'div';
    wrapper?: 'span' | 'div';
    groupAddon?: 'span' | 'div';
  };
  children: ReactElement;
}

export type ShowCountFormatter = (args: {
  value: string;
  count: number;
  maxLength?: number;
}) => ReactNode;

export type ExceedFormatter = (value: string, config: { max: number }) => string;

export interface CountConfig {
  max?: number;
  strategy?: (value: string) => number;
  show?: boolean | ShowCountFormatter;
  /** Trigger when content larger than the `max` limitation */
  exceedFormatter?: ExceedFormatter;
}

export interface InputProps
  extends CommonInputProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'size' | 'prefix' | 'type' | 'value' | 'className'
    > {
  value?: ValueType;
  prefixCls?: string;
  className?: SemanticClassName<'input' | 'prefix' | 'suffix' | 'count'>;
  type?: LiteralUnion<
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
  >;
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
  showCount?:
    | boolean
    | {
        formatter: ShowCountFormatter;
      };
  autoComplete?: string;
  htmlSize?: number;
  count?: CountConfig;
  onClear?: () => void;
  size?: SizeType;
  disabled?: boolean;
  status?: InputStatus;
  variant?: Variant;
  [key: `data-${string}`]: string | undefined;
}

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}

export interface InputRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  setSelectionRange: (
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none',
  ) => void;
  select: () => void;
  input: HTMLInputElement | null;
  nativeElement: HTMLElement | null;
}

export interface ChangeEventInfo {
  source: 'compositionEnd' | 'change';
}
