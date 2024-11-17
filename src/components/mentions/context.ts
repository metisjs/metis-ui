import * as React from 'react';
import type { MentionOptionClassName, MentionsOptionProps } from './Mentions';

export interface MentionsContextProps {
  loading?: boolean;
  notFoundContent: React.ReactNode;
  activeIndex: number;
  optionClassName?: MentionOptionClassName;
  setActiveIndex: (index: number) => void;
  selectOption: (option: MentionsOptionProps) => void;
  onFocus: React.FocusEventHandler<HTMLElement>;
  onBlur: React.FocusEventHandler<HTMLElement>;
}

export const MentionsContext = React.createContext<MentionsContextProps>(null!);
