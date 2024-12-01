import type * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import type { AbstractCheckboxProps, CheckboxChangeEvent, CheckboxRef } from '../checkbox/Checkbox';
import type { AbstractCheckboxGroupProps } from '../checkbox/Group';
import type { DisabledType } from '../config-provider/DisabledContext';

export type RadioRef = CheckboxRef;

export interface RadioGroupProps extends Omit<AbstractCheckboxGroupProps, 'className'> {
  className?: SemanticClassName<{ radio?: RadioProps['className'] }>;
  defaultValue?: any;
  value?: any;
  onChange?: (value: any, e: RadioChangeEvent) => void;
  disabled?: DisabledType;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  name?: string;
  children?: React.ReactNode;
  id?: string;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

export interface RadioGroupContextProps {
  onChange: (e: RadioChangeEvent) => void;
  value: any;
  disabled?: boolean;
  name?: string;
}

export type RadioProps = Omit<AbstractCheckboxProps<RadioChangeEvent>, 'skipGroup'>;

export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean;
}

export type RadioChangeEvent = CheckboxChangeEvent;
