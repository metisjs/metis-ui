import React from 'react';
import { FaceFrownOutline, FaceSmileOutline } from '@metisjs/icons';
import { Rate, Space } from 'metis-ui';

const customIcons: Record<number, React.ReactNode> = {
  1: <FaceFrownOutline />,
  2: <FaceFrownOutline />,
  3: <FaceSmileOutline />,
  4: <FaceSmileOutline />,
  5: <FaceSmileOutline />,
};

const App: React.FC = () => (
  <Space size="middle" vertical block>
    <Rate defaultValue={2} character={({ index = 0 }) => index + 1} />
    <Rate defaultValue={3} character={({ index = 0 }) => customIcons[index + 1]} />
  </Space>
);

export default App;
