/**
 * description: 添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。
 */
import { PowerOutline } from '@metisjs/icons';
import { Button, Space } from 'meta-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" loading>
          Loading
        </Button>
        <Button type="primary" size="small" loading>
          Loading
        </Button>
        <Button type="primary" icon={<PowerOutline />} loading />
      </Space>
      <Space>
        <Button type="primary" loading={loadings[0]} onClick={() => enterLoading(0)}>
          Click me!
        </Button>
        <Button
          type="primary"
          icon={<PowerOutline />}
          loading={loadings[1]}
          onClick={() => enterLoading(1)}
        >
          Click me!
        </Button>
        <Button
          type="primary"
          icon={<PowerOutline />}
          loading={loadings[2]}
          onClick={() => enterLoading(2)}
        />
      </Space>
    </Space>
  );
};

export default App;
