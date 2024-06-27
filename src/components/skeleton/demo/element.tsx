import type { RadioChangeEvent } from 'metis-ui';
import { Divider, Radio, Skeleton, Space, Switch } from 'metis-ui';
import React, { useState } from 'react';

type SizeType = 'default' | 'small' | 'large';
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';
type AvatarShapeType = 'circle' | 'square';

const App: React.FC = () => {
  const [active, setActive] = useState(false);
  const [block, setBlock] = useState(false);
  const [size, setSize] = useState<SizeType>('default');
  const [buttonShape, setButtonShape] = useState<ButtonShapeType>('default');
  const [avatarShape, setAvatarShape] = useState<AvatarShapeType>('circle');

  const handleActiveChange = (checked: boolean) => {
    setActive(checked);
  };

  const handleBlockChange = (checked: boolean) => {
    setBlock(checked);
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const handleShapeButton = (e: RadioChangeEvent) => {
    setButtonShape(e.target.value);
  };

  const handleAvatarShape = (e: RadioChangeEvent) => {
    setAvatarShape(e.target.value);
  };

  return (
    <>
      <Space>
        <Skeleton.Button active={active} size={size} shape={buttonShape} block={block} />
        <Skeleton.Avatar active={active} size={size} shape={avatarShape} />
        <Skeleton.Input active={active} size={size} />
      </Space>
      <br />
      <br />
      <Skeleton.Button active={active} size={size} shape={buttonShape} block={block} />
      <br />
      <br />
      <Skeleton.Input active={active} size={size} block={block} />
      <br />
      <br />
      <Space>
        <Skeleton.Image active={active} />
      </Space>
      <Divider />
      <div className="my-4">
        <Space size={24} wrap>
          <Space>
            <label>Active:</label>
            <Switch checked={active} onChange={handleActiveChange} />
          </Space>
          <Space>
            <label>Button and Input Block:</label>
            <Switch checked={block} onChange={handleBlockChange} />
          </Space>
          <Space>
            <label>Size:</label>
            <Radio.Group value={size} onChange={handleSizeChange}>
              <Radio value="default">Default</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="small">Small</Radio>
            </Radio.Group>
          </Space>
          <Space>
            <label>Button Shape:</label>
            <Radio.Group value={buttonShape} onChange={handleShapeButton}>
              <Radio value="default">Default</Radio>
              <Radio value="square">Square</Radio>
              <Radio value="round">Round</Radio>
              <Radio value="circle">Circle</Radio>
            </Radio.Group>
          </Space>
          <Space>
            <label>Avatar Shape:</label>
            <Radio.Group value={avatarShape} onChange={handleAvatarShape}>
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
