import * as React from 'react';
import type { SemanticRecord } from '@util/classNameUtils';
import type { HandleProps } from './Handles/Handle';
import type { Direction, SliderSemanticClassName } from './interface';

export interface SliderContextProps {
  min: number;
  max: number;
  includedStart: number;
  includedEnd: number;
  direction: Direction;
  disabled?: boolean;
  keyboard?: boolean;
  included?: boolean;
  step: number | null;
  range?: boolean;
  semanticCls: SemanticRecord<SliderSemanticClassName>;
}

const SliderContext = React.createContext<SliderContextProps>({
  min: 0,
  max: 0,
  direction: 'ltr',
  step: 1,
  includedStart: 0,
  includedEnd: 0,
  keyboard: true,
  semanticCls: {},
});

export default SliderContext;

export interface UnstableContextProps {
  onDragStart?: (info: {
    rawValues: number[];
    draggingIndex: number;
    draggingValue?: number;
  }) => void;
  onDragChange?: (info: {
    rawValues: number[];
    draggingIndex: number;
    draggingValue?: number;
  }) => void;
}

/** @private NOT PROMISE AVAILABLE. DO NOT USE IN PRODUCTION. */
export const UnstableContext = React.createContext<UnstableContextProps>({});

export interface SliderInternalContextProps {
  handleRender?: HandleProps['render'];
}
/** @private Internal context. Do not use in your production. */
export const SliderInternalContext = React.createContext<SliderInternalContextProps>({});
