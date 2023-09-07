/**
 * description: 当需要在 `Tag` 内嵌入 `Icon` 时，可以设置 `icon` 属性，或者直接在 `Tag` 内使用 `Icon` 组件。<br/>如果想控制 `Icon` 具体的位置，只能直接使用 `Icon` 组件，而非 `icon` 属性。
 */
import {
  AcademicCapOutline,
  BuildingOffice2Outline,
  DeviceTabletOutline,
  ShareOutline,
} from '@metaoa/icons';
import { Space, Tag } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size={[0, 8]} wrap>
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
