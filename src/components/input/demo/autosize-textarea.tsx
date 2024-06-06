/**
 * description: `autoSize` 属性适用于 `textarea` 节点，并且只有高度会自动变化。另外 `autoSize` 可以设定为一个对象，指定最小行数和最大行数。
 */
import { Input, Space } from 'metis-ui';
import React, { useState } from 'react';

const { TextArea } = Input;

const App: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Space direction="vertical" className="flex">
      <TextArea placeholder="Autosize height based on content lines" autoSize />
      <TextArea
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Controlled autosize"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Space>
  );
};

export default App;
