import React from 'react';
import { Button, Divider, InputNumber, notification, Space, Switch } from 'metis-ui';

const App: React.FC = () => {
  const [enabled, setEnabled] = React.useState(true);
  const [threshold, setThreshold] = React.useState(3);
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
        <Space className="w-full">
          <span>Enabled: </span>
          <Switch checked={enabled} onChange={(v) => setEnabled(v)} />
        </Space>
        <Space className="w-full">
          <span>Threshold: </span>
          <InputNumber
            disabled={!enabled}
            value={threshold}
            step={1}
            min={1}
            max={10}
            onChange={(v) => setThreshold(v || 0)}
          />
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
