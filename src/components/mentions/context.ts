import * as React from 'react';
import type { OptionProps } from './Mentions';

export interface MentionsContextProps {
  notFoundContent: React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  selectOption: (option: OptionProps) => void;
  onFocus: React.FocusEventHandler<HTMLElement>;
  onBlur: React.FocusEventHandler<HTMLElement>;
}

export const MentionsContext = React.createContext<MentionsContextProps>(null!);
