import React, { useState } from 'react';
import { Divider, Radio, Skeleton, Space, Switch } from 'metis-ui';

type SizeType = 'middle' | 'small' | 'large';
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';
type AvatarShapeType = 'circle' | 'square';

const App: React.FC = () => {
  const [active, setActive] = useState(false);
  const [size, setSize] = useState<SizeType>('middle');
  const [buttonShape, setButtonShape] = useState<ButtonShapeType>('default');
  const [avatarShape, setAvatarShape] = useState<AvatarShapeType>('circle');

  return (
    <>
      <Space align="center">
        <Skeleton.Avatar active={active} size={size} shape={avatarShape} />
        <Skeleton.Button active={active} size={size} shape={buttonShape} />
        <Skeleton.Input active={active} size={size} />
      </Space>
      <br />
      <Skeleton.Button active={active} size={size} shape={buttonShape} />
      <br />
      <Skeleton.Input active={active} size={size} />
      <br />
      <Space>
        <Skeleton.Image active={active} />
      </Space>
      <Divider />
      <div className="my-4">
        <Space size={24} wrap>
          <Space>
            <label>Active:</label>
            <Switch checked={active} onChange={setActive} />
          </Space>
          <Space>
            <label>Size:</label>
            <Radio.Group value={size} onChange={setSize}>
              <Radio value="middle">Default</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="small">Small</Radio>
            </Radio.Group>
          </Space>
          <Space>
            <label>Button Shape:</label>
            <Radio.Group value={buttonShape} onChange={setButtonShape}>
              <Radio value="default">Default</Radio>
              <Radio value="round">Round</Radio>
              <Radio value="circle">Circle</Radio>
            </Radio.Group>
          </Space>
          <Space>
            <label>Avatar Shape:</label>
            <Radio.Group value={avatarShape} onChange={setAvatarShape}>
              <Radio value="square">Square</Radio>
              <Radio value="circle">Circle</Radio>
            </Radio.Group>
          </Space>
        </Space>
      </div>
    </>
  );
};

export default App;
