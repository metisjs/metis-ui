import * as React from 'react';
import type { MentionsOptionProps } from './Mentions';

export interface MentionsContextProps {
  loading?: boolean;
  notFoundContent: React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  selectOption: (option: MentionsOptionProps) => void;
  onFocus: React.FocusEventHandler<HTMLElement>;
  onBlur: React.FocusEventHandler<HTMLElement>;
}

export const MentionsContext = React.createContext<MentionsContextProps>(null!);
