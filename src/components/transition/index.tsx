import type { ForwardRefExoticComponent } from 'react';
import type { TransitionProps } from './Transition';
import Transition from './Transition';
import type { TransitionChildProps } from './TransitionChild';
import TransitionChild from './TransitionChild';

type CompoundedComponent = ForwardRefExoticComponent<
  TransitionProps & React.RefAttributes<HTMLElement>
> & {
  Child: typeof TransitionChild;
};

(Transition as CompoundedComponent).Child = TransitionChild;

export { TransitionProps, TransitionChildProps };

export default Transition;
