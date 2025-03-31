import React, { useState } from 'react';
import { Button, Checkbox, ConfigProvider, Radio, Select } from 'metis-ui';

const App: React.FC = () => {
  const [prefixCls, setPrefixCls] = useState('light');
  return (
    <>
      <Button
        style={{ marginBottom: 12 }}
        type="primary"
        onClick={() => setPrefixCls(prefixCls === 'light' ? 'dark' : 'light')}
      >
        toggle prefixCls
      </Button>
      <br />
      <ConfigProvider prefixCls={prefixCls}>
        <Select style={{ width: 120 }} />
        <Radio>test</Radio>
        <Checkbox>test</Checkbox>
      </ConfigProvider>
    </>
  );
};

export default App;
