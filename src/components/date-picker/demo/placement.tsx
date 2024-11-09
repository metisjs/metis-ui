import React, { useState } from 'react';
import type { DatePickerProps } from 'metis-ui';
import { DatePicker, Radio } from 'metis-ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [placement, setPlacement] = useState<DatePickerProps['placement']>('topLeft');

  return (
    <>
      <Radio.Group value={placement} onChange={setPlacement}>
        <Radio value="topLeft">topLeft</Radio>
        <Radio value="topRight">topRight</Radio>
        <Radio value="bottomLeft">bottomLeft</Radio>
        <Radio value="bottomRight">bottomRight</Radio>
      </Radio.Group>
      <br />
      <br />
      <DatePicker placement={placement} />
      <br />
      <br />
      <RangePicker placement={placement} />
    </>
  );
};

export default App;
