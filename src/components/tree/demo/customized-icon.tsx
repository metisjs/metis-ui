import React from 'react';
import {
  ChevronDownOutline,
  FaceFrownOutline,
  FaceFrownSolid,
  FaceSmileOutline,
} from '@metisjs/icons';
import { Tree } from 'metis-ui';
import type { TreeDataNode } from 'metis-ui';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <FaceSmileOutline />,
    children: [
      {
        title: 'leaf',
        key: '0-0-0',
        icon: <FaceFrownOutline />,
      },
      {
        title: 'leaf',
        key: '0-0-1',
        icon: ({ selected }) => (selected ? <FaceFrownSolid /> : <FaceFrownOutline />),
      },
    ],
  },
];

const App: React.FC = () => (
  <Tree
    showIcon
    defaultExpandAll
    defaultSelectedKeys={['0-0-0']}
    switcherIcon={<ChevronDownOutline />}
    treeData={treeData}
  />
);

export default App;
