import React, { useState } from 'react';
import { Button, Checkbox, ConfigProvider, Radio, Select } from 'metis-ui';

const App: React.FC = () => {
  const [prefixCls, setPrefixCls] = useState('light');
  return (
    <>
      <Button
        className="mb-3"
        type="primary"
        onClick={() => setPrefixCls(prefixCls === 'light' ? 'dark' : 'light')}
      >
        toggle prefixCls
      </Button>
      <br />
      <ConfigProvider prefixCls={prefixCls}>
        <Select className="w-30" />
        <Radio>test</Radio>
        <Checkbox>test</Checkbox>
      </ConfigProvider>
    </>
  );
};

export default App;
