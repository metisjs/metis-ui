import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { ValueDate } from '../../interface';

export type PresetPanelClassName = SemanticClassName<{ item?: string }>;
export interface PresetPanelProps<ValueType = any> {
  prefixCls: string;
  className?: PresetPanelClassName;
  presets: ValueDate<ValueType>[];
  onClick: (value: ValueType) => void;
  onHover: (value: ValueType | null) => void;
}

function executeValue<ValueType extends object>(value: ValueDate<ValueType>['value']): ValueType {
  return typeof value === 'function' ? value() : value;
}

export default function PresetPanel<DateType extends object = any>(
  props: PresetPanelProps<DateType>,
) {
  const { prefixCls, className, presets, onClick, onHover } = props;

  const semanticCls = useSemanticCls(className);

  if (!presets.length) {
    return null;
  }

  return (
    <ul
      className={clsx(
        `${prefixCls}-presets`,
        'border-border-secondary flex max-w-48 flex-1 flex-col gap-1 border-e p-2',
        semanticCls.root,
      )}
    >
      {presets.map(({ label, value }, index) => (
        <li
          key={index}
          className={clsx(
            'hover:bg-fill-quaternary cursor-pointer truncate rounded-sm px-2 py-1 transition-all',
            semanticCls.item,
          )}
          onClick={() => {
            onClick(executeValue(value));
          }}
          onMouseEnter={() => {
            onHover(executeValue(value));
          }}
          onMouseLeave={() => {
            onHover(null);
          }}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
