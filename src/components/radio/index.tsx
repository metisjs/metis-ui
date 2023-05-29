import type * as React from 'react';
import Group from './Group';
import InternalRadio from './Radio';
import type { RadioProps, RadioRef } from './interface';

export type {
  RadioChangeEvent,
  RadioChangeEventTarget,
  RadioGroupContextProps,
  RadioGroupProps,
  RadioProps,
  RadioRef,
} from './interface';
export { Group };

type CompoundedComponent = React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<RadioRef>
> & {
  Group: typeof Group;
  /** @internal */
  __META_RADIO: boolean;
};

const Radio = InternalRadio as CompoundedComponent;
Radio.Group = Group;
Radio.__META_RADIO = true;
export default Radio;
