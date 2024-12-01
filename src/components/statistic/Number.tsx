import * as React from 'react';
import { type SemanticClassName } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { FormatConfig, valueType } from './utils';

export interface StatisticNumberProps extends FormatConfig {
  value: valueType;
  className?: SemanticClassName<{ int?: string; decimal?: string }>;
}

const StatisticNumber: React.FC<StatisticNumberProps> = (props) => {
  const { value, formatter, precision, decimalSeparator, groupSeparator = '', className } = props;

  const semanticCls = useSemanticCls(className);

  let valueNode: React.ReactNode;

  if (typeof formatter === 'function') {
    // Customize formatter
    valueNode = formatter(value);
  } else {
    // Internal formatter
    const val: string = String(value);
    const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);

    // Process if illegal number
    if (!cells || val === '-') {
      valueNode = val;
    } else {
      const negative = cells[1];
      let int = cells[2] || '0';
      let decimal = cells[4] || '';

      int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

      if (typeof precision === 'number') {
        decimal = decimal.padEnd(precision, '0').slice(0, precision > 0 ? precision : 0);
      }

      if (decimal) {
        decimal = `${decimalSeparator}${decimal}`;
      }

      valueNode = [
        <span key="int" className={semanticCls.int}>
          {negative}
          {int}
        </span>,
        decimal && (
          <span key="decimal" className={semanticCls.decimal}>
            {decimal}
          </span>
        ),
      ];
    }
  }

  return <span className={semanticCls.root}>{valueNode}</span>;
};

export default StatisticNumber;
