import React from 'react';
import {
  ArrowDownTrayOutline,
  ChatBubbleLeftRightOutline,
  DevicePhoneMobileOutline,
  EllipsisHorizontalOutline,
  EnvelopeOutline,
  ExclamationTriangleOutline,
  HandThumbUpOutline,
  HeartOutline,
  ShareOutline,
  StarOutline,
} from '@metisjs/icons';
import { Button, Dropdown, Space, Tooltip } from 'metis-ui';

const App: React.FC = () => (
  <div>
    <Space.Compact block>
      <Tooltip title="Like">
        <Button icon={<HandThumbUpOutline />} />
      </Tooltip>
      <Tooltip title="Comment">
        <Button icon={<ChatBubbleLeftRightOutline />} />
      </Tooltip>
      <Tooltip title="Star">
        <Button icon={<StarOutline />} />
      </Tooltip>
      <Tooltip title="Heart">
        <Button icon={<HeartOutline />} />
      </Tooltip>
      <Tooltip title="Share">
        <Button icon={<ShareOutline />} />
      </Tooltip>
      <Tooltip title="Download">
        <Button icon={<ArrowDownTrayOutline />} />
      </Tooltip>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '1',
              label: 'Report',
              icon: <ExclamationTriangleOutline />,
            },
            {
              key: '2',
              label: 'Mail',
              icon: <EnvelopeOutline />,
            },
            {
              key: '3',
              label: 'Mobile',
              icon: <DevicePhoneMobileOutline />,
            },
          ],
        }}
        trigger={['click']}
      >
        <Button icon={<EllipsisHorizontalOutline />} />
      </Dropdown>
    </Space.Compact>
    <br />
    <Space.Compact block>
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
      <Button type="primary">Button 3</Button>
      <Button type="primary">Button 4</Button>
      <Tooltip title="Tooltip">
        <Button type="primary" icon={<ArrowDownTrayOutline />} disabled />
      </Tooltip>
      <Tooltip title="Tooltip">
        <Button type="primary" icon={<ArrowDownTrayOutline />} />
      </Tooltip>
    </Space.Compact>
    <br />
    <Space.Compact block>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Tooltip title="Tooltip">
        <Button icon={<ArrowDownTrayOutline />} disabled />
      </Tooltip>
      <Tooltip title="Tooltip">
        <Button icon={<ArrowDownTrayOutline />} />
      </Tooltip>
      <Button type="primary">Button 4</Button>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '1',
              label: '1st item',
            },
            {
              key: '2',
              label: '2nd item',
            },
            {
              key: '3',
              label: '3rd item',
            },
          ],
        }}
        trigger={['click']}
      >
        <Button type="primary" icon={<EllipsisHorizontalOutline />} />
      </Dropdown>
    </Space.Compact>
  </div>
);

export default App;
