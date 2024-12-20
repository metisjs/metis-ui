import React, { useState } from 'react';
import { Input, Space } from 'metis-ui';

const { TextArea } = Input;

const App: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Space vertical className="flex">
      <TextArea placeholder="Autosize height based on content lines" autoSize />
      <TextArea
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
      <TextArea
        value={value}
        onChange={setValue}
        placeholder="Controlled autosize"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Space>
  );
};

export default App;
