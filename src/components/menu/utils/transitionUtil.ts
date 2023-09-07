import { TransitionProps } from '../../transition';

export function getTransition(
  mode: string,
  transition?: TransitionProps,
  defaultTransitions?: Record<string, TransitionProps>,
) {
  if (transition) {
    return transition;
  }

  if (defaultTransitions) {
    return defaultTransitions[mode] || defaultTransitions.other;
  }

  return undefined;
}
