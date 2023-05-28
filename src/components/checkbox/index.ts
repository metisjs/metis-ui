import type * as React from 'react';
import type { CheckboxProps } from './Checkbox';
import InternalCheckbox from './Checkbox';
import Group from './Group';

export type { CheckboxChangeEvent, CheckboxProps, CheckboxRef } from './Checkbox';
export type { CheckboxGroupProps, CheckboxOptionType } from './Group';

type CompoundedComponent = React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof Group;
  /** @internal */
  __META_CHECKBOX: boolean;
};

const Checkbox = InternalCheckbox as CompoundedComponent;

Checkbox.Group = Group;
Checkbox.__META_CHECKBOX = true;

if (process.env.NODE_ENV !== 'production') {
  Checkbox.displayName = 'Checkbox';
}

export default Checkbox;
