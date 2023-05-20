import { createContext, useContext } from 'react';
import { NestingContextValues, State, TransitionContextValues } from './interface';

export const TransitionContext = createContext<TransitionContextValues | null>(null);

export function useTransitionContext() {
  const context = useContext(TransitionContext);

  if (context === null) {
    throw new Error(
      'A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.',
    );
  }

  return context;
}

export const NestingContext = createContext<NestingContextValues | null>(null);

export function useParentNesting() {
  const context = useContext(NestingContext);

  if (context === null) {
    throw new Error(
      'A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.',
    );
  }

  return context;
}
export const OpenClosedContext = createContext<State | null>(null);
