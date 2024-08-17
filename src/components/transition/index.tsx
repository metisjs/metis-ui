import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { TransitionEventHandler } from './interface';
import type { TransitionProps } from './Transition';
import InternalTransition from './Transition';
import type { TransitionListProps } from './TransitionList';
import TransitionList from './TransitionList';

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
