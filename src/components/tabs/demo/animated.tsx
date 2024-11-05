import React from 'react';
import { Space, Switch, Tabs } from 'metis-ui';

const App: React.FC = () => {
  const [indicator, setIndicator] = React.useState(true);
  const [tabPane, setTabPane] = React.useState(true);

  return (
    <>
      <Space>
        <Switch
          checkedChildren="indicator"
          unCheckedChildren="indicator"
          checked={indicator}
          onChange={() => setIndicator(!indicator)}
        />
        <Switch
          checkedChildren="tabPane"
          unCheckedChildren="tabPane"
          checked={tabPane}
          onChange={() => setTabPane(!tabPane)}
        />
      </Space>

      <Tabs
        animated={{ indicator, tabPane }}
        items={[
          {
            label: 'Bamboo',
            key: '1',
            content: 'Hello Bamboo!',
            style: {
              height: 200,
              boxShadow: '0 0 3px rgba(255, 0, 0, 0.5)',
            },
          },
          {
            label: 'Little',
            key: '2',
            content: 'Hi Little!',
            style: {
              height: 300,
              boxShadow: '0 0 3px rgba(0, 255, 0, 0.5)',
            },
          },
          {
            label: 'Light',
            key: '3',
            content: 'Welcome Light!',
            style: {
              height: 100,
              boxShadow: '0 0 3px rgba(0, 0, 255, 0.5)',
            },
          },
        ]}
      />
    </>
  );
};

export default App;
