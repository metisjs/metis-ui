import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary" shape="round" icon={<MagnifyingGlassOutline />} />
    <Button type="primary" icon={<MagnifyingGlassOutline />}>
      Search
    </Button>
    <Button type="primary" icon={<MagnifyingGlassOutline />} href="https://www.google.com" />
    <Button shape="round" icon={<MagnifyingGlassOutline />} />
    <Button icon={<MagnifyingGlassOutline />}>Search</Button>
    <Button icon={<MagnifyingGlassOutline />} href="https://www.google.com" />
  </Space>
);

export default App;
