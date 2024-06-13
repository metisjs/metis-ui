import {
  ArrowPathOutline,
  CheckCircleOutline,
  ClockOutline,
  ExclamationCircleOutline,
  MinusCircleOutline,
  XCircleOutline,
} from '@metisjs/icons';
import { Divider, Space, Tag } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Divider orientation="left">Without icon</Divider>
    <Space size={[0, 8]} wrap>
      <Tag color="success">success</Tag>
      <Tag color="processing">processing</Tag>
      <Tag color="error">error</Tag>
      <Tag color="warning">warning</Tag>
      <Tag color="default">default</Tag>
    </Space>
    <Divider orientation="left">With icon</Divider>
    <Space size={[0, 8]} wrap>
      <Tag icon={<CheckCircleOutline />} color="success">
        success
      </Tag>
      <Tag icon={<ArrowPathOutline className="animate-spin" />} color="processing">
        processing
      </Tag>
      <Tag icon={<XCircleOutline />} color="error">
        error
      </Tag>
      <Tag icon={<ExclamationCircleOutline />} color="warning">
        warning
      </Tag>
      <Tag icon={<ClockOutline />} color="default">
        waiting
      </Tag>
      <Tag icon={<MinusCircleOutline />} color="default">
        stop
      </Tag>
    </Space>
  </>
);

export default App;
