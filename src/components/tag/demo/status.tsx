import React from 'react';
import {
  ArrowPathOutline,
  CheckCircleOutline,
  ClockOutline,
  ExclamationCircleOutline,
  MinusCircleOutline,
  XCircleOutline,
} from '@metisjs/icons';
import { Divider, Space, Tag } from 'metis-ui';

const App: React.FC = () => (
  <>
    <Divider orientation="left">Without icon</Divider>
    <Space wrap>
      <Tag color="success">Success</Tag>
      <Tag color="processing">Processing</Tag>
      <Tag color="error">Error</Tag>
      <Tag color="warning">Warning</Tag>
      <Tag color="default">Default</Tag>
    </Space>
    <Divider orientation="left">With icon</Divider>
    <Space wrap>
      <Tag icon={<CheckCircleOutline />} color="success">
        Success
      </Tag>
      <Tag icon={<ArrowPathOutline className="animate-spin" />} color="processing">
        Processing
      </Tag>
      <Tag icon={<XCircleOutline />} color="error">
        Error
      </Tag>
      <Tag icon={<ExclamationCircleOutline />} color="warning">
        Warning
      </Tag>
      <Tag icon={<ClockOutline />} color="default">
        Waiting
      </Tag>
      <Tag icon={<MinusCircleOutline />} color="default">
        Stop
      </Tag>
    </Space>
    <Divider orientation="left">Closable</Divider>
    <Space wrap>
      <Tag color="success" closable>
        Success
      </Tag>
      <Tag color="processing" closable>
        Processing
      </Tag>
      <Tag color="error" closable>
        Error
      </Tag>
      <Tag color="warning" closable>
        Warning
      </Tag>
      <Tag color="default" closable>
        Default
      </Tag>
    </Space>
  </>
);

export default App;
