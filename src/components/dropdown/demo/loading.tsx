import React, { useState } from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';

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
    <Space vertical>
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
