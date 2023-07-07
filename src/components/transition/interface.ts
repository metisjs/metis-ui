export enum TransitionStatus {
  None = 'none',
  Enter = 'enter',
  Leave = 'leave',
}

export type TransitionPrepareEventHandler = (element: HTMLElement) => void;

export type TransitionEventHandler = (element: HTMLElement, event: TransitionEvent) => void;

export type TransitionStyleType = { className: string[]; style: React.CSSProperties };
export type TransitionStyle =
  | string
  | React.CSSProperties
  | { className: string; style: React.CSSProperties };
