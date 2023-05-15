/**
 * description: 当需要在 `Button` 内嵌入 `Icon` 时，可以设置 `icon` 属性，或者直接在 `Button` 内使用 `Icon` 组件。<br />如果想控制 `Icon` 具体的位置，只能直接使用 `Icon` 组件，而非 `icon` 属性。
 */
import { MagnifyingGlassOutline } from '@metaoa/icons';
import { Button, Space } from 'meta-ui';
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
