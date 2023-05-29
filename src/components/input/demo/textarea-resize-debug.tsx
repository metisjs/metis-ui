/**
 * description: 用于多行输入。
 */
import { Button, Input, Space } from 'meta-ui';
import React, { useState } from 'react';

const { TextArea } = Input;

const defaultValue =
  'The autoSize property applies to textarea nodes, and only the height changes automatically. In addition, autoSize can be set to an object, specifying the minimum number of rows and the maximum number of rows. The autoSize property applies to textarea nodes, and only the height changes automatically. In addition, autoSize can be set to an object, specifying the minimum number of rows and the maximum number of rows.';

const App: React.FC = () => {
  const [autoResize, setAutoResize] = useState(false);

  return (
    <Space direction="vertical" className="flex">
      <Button onClick={() => setAutoResize(!autoResize)} style={{ marginBottom: 8 }}>
        Auto Resize: {String(autoResize)}
      </Button>
      <TextArea rows={4} autoSize={autoResize} defaultValue={defaultValue} />
      <TextArea allowClear style={{ width: 93 }} />
    </Space>
  );
};

export default App;
