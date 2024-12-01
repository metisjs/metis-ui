import { useEffect } from 'react';
import { devUseWarning } from '@util/warning';
import type { FormProps } from '../Form';

const names: Record<string, number> = {};

export default function useFormWarning({ name, labelWidth = 'auto', labelWrap }: FormProps) {
  const warning = devUseWarning('Form');

  useEffect(() => {
    if (name) {
      names[name] = (names[name] || 0) + 1;

      warning(names[name] <= 1, 'usage', 'There exist multiple Form with same `name`.');

      return () => {
        names[name] -= 1;
      };
    }
  }, [name]);

  useEffect(() => {
    warning(
      !(labelWidth === 'auto' && labelWrap),
      'usage',
      '`labelWrap` is not support when label width is auto.',
    );
  }, [labelWidth, labelWrap]);
}
