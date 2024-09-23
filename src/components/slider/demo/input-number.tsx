import React, { useState } from 'react';
import type { InputNumberProps } from 'metis-ui';
import { InputNumber, Slider, Space } from 'metis-ui';

const IntegerStep: React.FC = () => {
  const [inputValue, setInputValue] = useState(1);

  const onChange: InputNumberProps['onChange'] = (newValue) => {
    setInputValue(newValue as number);
  };

  return (
    <div className="flex gap-4">
      <Slider
        min={1}
        max={20}
        onChange={onChange}
        value={typeof inputValue === 'number' ? inputValue : 0}
        className="flex-auto"
      />
      <InputNumber min={1} max={20} value={inputValue} onChange={onChange} />
    </div>
  );
};

const DecimalStep: React.FC = () => {
  const [inputValue, setInputValue] = useState(0);

  const onChange: InputNumberProps['onChange'] = (value) => {
    if (isNaN(value as number)) {
      return;
    }
    setInputValue(value as number);
  };

  return (
    <div className="flex gap-4">
      <Slider
        min={0}
        max={1}
        onChange={onChange}
        value={typeof inputValue === 'number' ? inputValue : 0}
        step={0.01}
        className="flex-auto"
      />
      <InputNumber min={0} max={1} step={0.01} value={inputValue} onChange={onChange} />
    </div>
  );
};

const App: React.FC = () => (
  <Space vertical block>
    <IntegerStep />
    <DecimalStep />
  </Space>
);

export default App;
