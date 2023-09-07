export enum TransitionStatus {
  None = 'none',
  Enter = 'enter',
  Leave = 'leave',
}

export enum TransitionStep {
  None = 'none',
  Prepare = 'prepare',
  Start = 'start',
  Active = 'active',
}

export type TransitionEventHandler = () => void;
export type TransitionBeforeEventHandler = () => Promise<any> | void;

export type TransitionStyleType = { className: string[]; style: React.CSSProperties };
export type TransitionBaseStyle =
  | string
  | React.CSSProperties
  | { className: string; style: React.CSSProperties };
export type TransitionStyleFn = (node: HTMLElement | null) => TransitionStyle;
export type TransitionStyle = TransitionBaseStyle | TransitionStyleFn;
