import type {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import type { InputStatus } from '@util/statusUtils';
import type { LiteralUnion } from '@util/type';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';

type DataAttr = Record<`data-${string}`, string>;

export type ValueType = InputHTMLAttributes<HTMLInputElement>['value'] | bigint;

export interface CommonInputProps {
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  allowClear?: boolean | { clearIcon?: ReactNode };
}

export type SemanticStructure =
  | 'affixWrapper'
  | 'prefix'
  | 'suffix'
  | 'groupWrapper'
  | 'wrapper'
  | 'clear'
  | 'addonBefore'
  | 'addonAfter';

export interface BaseInputProps extends CommonInputProps {
  value?: ValueType;
  prefixCls?: string;
  className?: SemanticClassName<{ [K in SemanticStructure]?: string }>;
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
      'size' | 'prefix' | 'type' | 'value' | 'className' | 'onChange'
    > {
  value?: ValueType;
  prefixCls?: string;
  className?: SemanticClassName<{
    input?: string;
    prefix?: string;
    suffix?: string;
    count?: string;
    clear?: string;
    addonBefore?: string;
    addonAfter?: string;
  }>;
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
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
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

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

// To compatible with origin usage. We have to wrap this
export interface ResizableTextAreaRef {
  textArea: HTMLTextAreaElement;
}

export type HTMLTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type TextAreaProps = Omit<
  HTMLTextareaProps,
  'onResize' | 'value' | 'className' | 'onChange'
> & {
  value?: HTMLTextareaProps['value'] | bigint;
  prefixCls?: string;
  className?: SemanticClassName<{ textarea?: string; count?: string; clear?: string }>;
  style?: React.CSSProperties;
  autoSize?: boolean | AutoSizeType;
  onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onResize?: (size: { width: number; height: number }) => void;
  onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  size?: SizeType;
  status?: InputStatus;
  variant?: Variant;
} & Pick<BaseInputProps, 'allowClear'> &
  Pick<InputProps, 'showCount' | 'count' | 'onClear'>;

export type TextAreaRef = {
  resizableTextArea: ResizableTextAreaRef;
  focus: () => void;
  blur: () => void;
  nativeElement: HTMLElement;
};
