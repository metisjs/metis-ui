import * as React from 'react';
import { clsx } from '../../../_util/classNameUtils';
import type { ValueDate } from '../../interface';

export interface PresetPanelProps<ValueType = any> {
  prefixCls: string;
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
  const { prefixCls, presets, onClick, onHover } = props;

  if (!presets.length) {
    return null;
  }

  return (
    <div className={clsx(`${prefixCls}-presets`, 'flex max-w-48 flex-col')}>
      <ul className="flex flex-1 flex-col gap-1 border-e border-border-secondary p-2">
        {presets.map(({ label, value }, index) => (
          <li
            key={index}
            className="cursor-pointer truncate rounded px-2 py-1 transition-all hover:bg-fill-quaternary"
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
    </div>
  );
}
