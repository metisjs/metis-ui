import { MutableRefObject } from 'react';

export type ContainerElement = MutableRefObject<HTMLElement | null>;

export type TransitionDirection = 'enter' | 'leave' | 'idle';

export enum TreeStates {
  Visible = 'visible',
  Hidden = 'hidden',
}

export enum RenderStrategy {
  Unmount,
  Hidden,
}

export enum State {
  Open = 1 << 0,
  Closed = 1 << 1,
  Closing = 1 << 2,
  Opening = 1 << 3,
}

export interface TransitionContextValues {
  show: boolean;
  appear: boolean;
  initial: boolean;
}

export interface NestingContextValues {
  children: MutableRefObject<{ el: ContainerElement; state: TreeStates }[]>;
  register: (el: ContainerElement) => () => void;
  unregister: (el: ContainerElement, strategy?: RenderStrategy) => void;
  onStart: (el: ContainerElement, direction: TransitionDirection, cb: () => void) => void;
  onStop: (el: ContainerElement, direction: TransitionDirection, cb: () => void) => void;
  chains: MutableRefObject<
    Record<TransitionDirection, [container: ContainerElement, promise: Promise<void>][]>
  >;
  wait: MutableRefObject<Promise<void>>;
}

export interface TransitionEvents {
  beforeEnter?: () => void;
  afterEnter?: () => void;
  beforeLeave?: () => void;
  afterLeave?: () => void;
}
