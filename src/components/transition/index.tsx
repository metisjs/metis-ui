import { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { TransitionProps } from './Transition';
import InternalTransition from './Transition';
import type { TransitionListProps } from './TransitionList';
import TransitionList from './TransitionList';
import type { TransitionEventHandler } from './interface';
export { TransitionList };
export type { TransitionEventHandler, TransitionListProps, TransitionProps };

type CompoundedComponent = ForwardRefExoticComponent<
  TransitionProps & RefAttributes<HTMLSpanElement>
> & {
  List: typeof TransitionList;
};

const Transition = InternalTransition as CompoundedComponent;

Transition.List = TransitionList;

export default Transition;
