import { Button, Divider, notification, Space, Switch } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const [enabled, setEnabled] = React.useState(true);
  const [threshold] = React.useState(3);
  const [api, contextHolder] = notification.useNotification({
    stack: enabled
      ? {
          threshold,
        }
      : false,
  });

  const openNotification = () => {
    api.open({
      message: 'Notification Title',
      description: `${Array(Math.round(Math.random() * 5) + 1)
        .fill('This is the content of the notification.')
        .join('\n')}`,
      duration: null,
    });
  };

  return (
    <div>
      {contextHolder}
      <Space size="large">
        <Space style={{ width: '100%' }}>
          <span>Enabled: </span>
          <Switch checked={enabled} onChange={(v) => setEnabled(v)} />
        </Space>
        <Space style={{ width: '100%' }}>
          <span>Threshold: </span>
          {/* TODO: 组件待开发 */}
          {/* <InputNumber
              disabled={!enabled}
              value={threshold}
              step={1}
              min={1}
              max={10}
              onChange={(v) => setThreshold(v || 0)}
            /> */}
        </Space>
      </Space>
      <Divider />
      <Button type="primary" onClick={openNotification}>
        Open the notification box
      </Button>
    </div>
  );
};

export default App;
