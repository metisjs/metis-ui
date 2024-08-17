import type { TransitionProps } from '../transition';

const collapseTransition: TransitionProps = {
  enter: 'transition-all ease-in overflow-hidden',
  enterFrom: 'opacity-0 h-0',
  enterTo: (node) => ({ className: 'opacity-100', style: { height: node?.scrollHeight } }),
  leave: 'transition-all ease-in overflow-hidden',
  leaveFrom: (node) => ({ className: 'opacity-100', style: { height: node?.scrollHeight } }),
  leaveTo: 'opacity-0 h-0',
  deadline: 500,
};

export { collapseTransition };
