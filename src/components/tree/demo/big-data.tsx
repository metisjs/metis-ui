import React from 'react';
import { Tree } from 'metis-ui';
import type { TreeDataNode } from 'metis-ui';

const treeData: TreeDataNode[] = [];

for (let i = 0; i < 100; i += 1) {
  const children: TreeDataNode[] = [];

  for (let j = 0; j < 100; j += 1) {
    children.push({
      title: `child ${i}-${j}`,
      key: `l-${i}-${j}`,
    });
  }

  treeData.push({
    title: `parent ${i}`,
    key: `l-${i}`,
    children,
  });
}

const App: React.FC = () => (
  <Tree virtual defaultExpandAll treeData={treeData} className="h-[400px]" />
);

export default App;
