import React from 'react';
import {
  AcademicCapOutline,
  BuildingOffice2Outline,
  DeviceTabletOutline,
  ShareOutline,
} from '@metisjs/icons';
import { Space, Tag } from 'metis-ui';

const App: React.FC = () => (
  <Space wrap>
    <Tag icon={<AcademicCapOutline />} color="#55acee">
      AcademicCap
    </Tag>
    <Tag icon={<BuildingOffice2Outline />} color="#cd201f">
      BuildingOffice
    </Tag>
    <Tag icon={<DeviceTabletOutline />} color="#3b5999">
      DeviceTablet
    </Tag>
    <Tag icon={<ShareOutline />} color="#55acee">
      Share
    </Tag>
  </Space>
);

export default App;
