import type { TabsProps } from '..';
import type { AnimatedConfig } from '../interface';

export default function useAnimateConfig(
  animated: TabsProps['animated'] = {
    indicator: true,
    tabPane: false,
  },
): AnimatedConfig {
  let mergedAnimated: AnimatedConfig;

  if (animated === false) {
    mergedAnimated = {
      indicator: false,
      tabPane: false,
    };
  } else if (animated === true) {
    mergedAnimated = {
      indicator: true,
      tabPane: true,
    };
  } else {
    mergedAnimated = {
      indicator: true,
      ...(typeof animated === 'object' ? animated : {}),
    };
  }

  if (mergedAnimated.tabPane) {
    mergedAnimated.tabPaneTransition = {
      appear: false,
      enter: 'transition-opacity duration-300',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'absolute inset-0 transition-opacity duration-300',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0',
    };
  }

  return mergedAnimated;
}
