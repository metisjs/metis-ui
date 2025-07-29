import React from 'react';

export const OverflowContext = React.createContext<{
  prefixCls: string;
  responsive: boolean;
  order: number;
  registerSize: (key: React.Key, width: number | null) => void;
  display: boolean;

  invalidate: boolean;

  // Item Usage
  item?: any;
  itemKey?: React.Key;

  // Rest Usage
  className?: string;
}>(null!);
