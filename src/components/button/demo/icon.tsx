import { CheckCircleIcon, MagnifyingGlassIcon } from '@matejs/icons/dist';
import { Button, Space } from 'meta-ui';
import React from 'react';

console.log(MagnifyingGlassIcon);

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary" shape="round" icon={<MagnifyingGlassIcon />} />
    <Button type="primary" icon={<CheckCircleIcon />}>
      Search
    </Button>
    <Button type="primary" icon={<MagnifyingGlassIcon />} href="https://www.google.com" />
    <Button shape="round" icon={<MagnifyingGlassIcon />} />
    <Button icon={<MagnifyingGlassIcon />}>Search</Button>
    <Button icon={<MagnifyingGlassIcon />} href="https://www.google.com" />
  </Space>
);

export default App;
