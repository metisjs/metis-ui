import React from 'react';
import { ArrowPathOutline, CheckCircleSolid, XCircleSolid } from '@metisjs/icons';
import type { QRCodeProps } from 'metis-ui';
import { Button, QRCode, Space, Spin } from 'metis-ui';

const value = 'https://metis.github.io';

const customStatusRender: QRCodeProps['statusRender'] = (info) => {
  switch (info.status) {
    case 'expired':
      return (
        <div>
          <Space>
            <XCircleSolid className="h-4 w-4 text-error" />
            {info.locale?.expired}
          </Space>
          <p>
            <Button type="link" onClick={info.onRefresh}>
              <ArrowPathOutline /> {info.locale?.refresh}
            </Button>
          </p>
        </div>
      );
    case 'loading':
      return (
        <Space vertical justify="center">
          <Spin />
          <p>Loading...</p>
        </Space>
      );
    case 'scanned':
      return (
        <Space>
          <CheckCircleSolid className="h-4 w-4 text-green-600" />
          {info.locale?.scanned}
        </Space>
      );
    default:
      return null;
  }
};

const App: React.FC = () => (
  <Space block size="middle" wrap>
    <QRCode value={value} status="loading" statusRender={customStatusRender} />
    <QRCode
      value={value}
      status="expired"
      onRefresh={() => console.log('refresh')}
      statusRender={customStatusRender}
    />
    <QRCode value={value} status="scanned" statusRender={customStatusRender} />
  </Space>
);

export default App;
