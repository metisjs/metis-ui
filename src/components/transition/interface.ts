export enum TransitionStatus {
  None = 'none',
  Enter = 'enter',
  Leave = 'leave',
}

export type TransitionEventHandler = () => void;
export type TransitionBeforeEventHandler = () => Promise<any> | void;

export type TransitionStyleType = { className: string[]; style: React.CSSProperties };
export type TransitionStyle =
  | string
  | React.CSSProperties
  | { className: string; style: React.CSSProperties };
