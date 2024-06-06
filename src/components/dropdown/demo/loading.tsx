/**
 * description: 添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。
 */
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'meta-ui';
import { Dropdown, Space } from 'meta-ui';
import React, { useState } from 'react';

const items: MenuProps['items'] = [
  {
    label: 'Submit and continue',
    key: '1',
  },
];

const App: React.FC = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const enterLoading = (index: number) => {
    setLoadings((state) => {
      const newLoadings = [...state];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((state) => {
        const newLoadings = [...state];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <Space direction="vertical">
      <Dropdown.Button type="primary" loading menu={{ items }}>
        Submit
      </Dropdown.Button>
      <Dropdown.Button type="primary" size="small" loading menu={{ items }}>
        Submit
      </Dropdown.Button>
      <Dropdown.Button
        type="primary"
        loading={loadings[0]}
        menu={{ items }}
        onClick={() => enterLoading(0)}
      >
        Submit
      </Dropdown.Button>
      <Dropdown.Button
        icon={<ChevronDownOutline />}
        loading={loadings[1]}
        menu={{ items }}
        onClick={() => enterLoading(1)}
      >
        Submit
      </Dropdown.Button>
    </Space>
  );
};

export default App;
