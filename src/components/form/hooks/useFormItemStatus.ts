import { useContext } from 'react';
import { devUseWarning } from '@util/warning';
import { FormItemInputContext } from '../context';
import type { ValidateStatus } from '../FormItem';

type UseFormItemStatus = () => {
  status?: ValidateStatus;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
};

const useFormItemStatus: UseFormItemStatus = () => {
  const { status, errors = [], warnings = [] } = useContext(FormItemInputContext);

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Form.Item');

    warning(
      status !== undefined,
      'usage',
      'Form.Item.useStatus should be used under Form.Item component. For more information: https://u.ant.design/form-item-usestatus',
    );
  }

  return { status, errors, warnings };
};

// Only used for compatible package. Not promise this will work on future version.
(useFormItemStatus as any).Context = FormItemInputContext;

export default useFormItemStatus;
