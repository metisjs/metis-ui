import React, { useState } from 'react';
import { Rate, Space } from 'metis-ui';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const App: React.FC = () => {
  const [value, setValue] = useState(3);
  return (
    <Space size="middle" vertical block>
      <Rate tooltips={desc} onChange={setValue} value={value} />
      {value ? <span>{desc[value - 1]}</span> : null}
    </Space>
  );
};

export default App;
