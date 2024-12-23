import React, { useState } from 'react';
import { Button, Radio, Slider, Space } from 'metis-ui';
import type { ConfigProviderProps } from 'metis-ui';

type SizeType = ConfigProviderProps['componentSize'];

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType | [SizeType, SizeType] | 'customize'>('small');
  const [customSize, setCustomSize] = React.useState<number>(0);
  return (
    <>
      <Radio.Group
        value={size}
        options={[
          { label: 'small', value: 'small' },
          { label: 'middle', value: 'middle' },
          { label: 'large', value: 'large' },
          { label: 'customize', value: 'customize' },
        ]}
        onChange={setSize}
      ></Radio.Group>
      <br />
      <br />
      {size === 'customize' && (
        <>
          <Slider value={customSize} onChange={setCustomSize} />
          <br />
        </>
      )}
      <Space size={size !== 'customize' ? size : customSize}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="text">Dashed</Button>
        <Button type="link">Link</Button>
      </Space>
    </>
  );
};

export default App;
