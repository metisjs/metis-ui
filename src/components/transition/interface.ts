export const STATUS_NONE = 'none' as const;
export const STATUS_APPEAR = 'appear' as const;
export const STATUS_ENTER = 'enter' as const;
export const STATUS_LEAVE = 'leave' as const;

export type TransitionStatus =
  | typeof STATUS_NONE
  | typeof STATUS_APPEAR
  | typeof STATUS_ENTER
  | typeof STATUS_LEAVE;

export const STEP_NONE = 'none' as const;
export const STEP_PREPARE = 'prepare' as const;
export const STEP_START = 'start' as const;
export const STEP_ACTIVE = 'active' as const;
export const STEP_ACTIVATED = 'end' as const;

export type StepStatus =
  | typeof STEP_NONE
  | typeof STEP_PREPARE
  | typeof STEP_START
  | typeof STEP_ACTIVE
  | typeof STEP_ACTIVATED;

export type TransitionPrepareEventHandler = (element: HTMLElement) => void;

export type TransitionEventHandler = (
  element: HTMLElement,
  event: TransitionEvent | AnimationEvent,
) => void;

export type TransitionStyle =
  | string
  | React.CSSProperties
  | { className: string; style: React.CSSProperties };
