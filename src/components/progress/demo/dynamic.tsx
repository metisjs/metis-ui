import React, { useState } from 'react';
import { MinusOutline, PlusOutline } from '@metisjs/icons';
import { Button, Progress, Space } from 'metis-ui';

const App: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);

  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 10;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };

  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 10;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
  };

  return (
    <Space vertical size="small" block>
      <Space vertical size="small" block>
        <Progress percent={percent} type="line" />
        <Progress percent={percent} type="circle" />
      </Space>
      <Space.Compact>
        <Button onClick={decline} icon={<MinusOutline />} />
        <Button onClick={increase} icon={<PlusOutline />} />
      </Space.Compact>
    </Space>
  );
};

export default App;
