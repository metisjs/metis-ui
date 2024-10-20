import React, { useState } from 'react';
import type { InputNumberProps } from 'metis-ui';
import { Form, InputNumber } from 'metis-ui';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

const validatePrimeNumber = (
  number: number,
): {
  validateStatus: ValidateStatus;
  errorMsg: string | null;
} => {
  if (number === 11) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: 'The prime between 8 and 12 is 11!',
  };
};

const tips =
  'A prime is a natural number greater than 1 that has no positive divisors other than 1 and itself.';

const App: React.FC = () => {
  const [number, setNumber] = useState<{
    value: number;
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({ value: 11 });

  const onNumberChange: InputNumberProps['onChange'] = (value) => {
    setNumber({
      ...validatePrimeNumber(value as number),
      value: value as number,
    });
  };

  return (
    <Form className="max-w-[600px]">
      <Form.Item
        label="Prime between 8 & 12"
        validateStatus={number.validateStatus}
        help={number.errorMsg || tips}
      >
        <InputNumber min={8} max={12} value={number.value} onChange={onNumberChange} />
      </Form.Item>
    </Form>
  );
};

export default App;
