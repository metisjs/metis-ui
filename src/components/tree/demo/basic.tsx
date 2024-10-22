import React from 'react';
import { DocumentTextSolid, FolderCloseSolid, FolderOpenSolid } from '@metisjs/icons';
import type { TreeDataNode, TreeProps } from 'metis-ui';
import { Tree } from 'metis-ui';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'leaf', key: '0-0-1-0' }],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '1-0',
    children: [
      {
        title: 'parent 2-0',
        key: '1-0-0',
        children: [
          {
            title: 'leaf',
            key: '1-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '1-0-0-1',
          },
        ],
      },
      {
        title: 'parent 2-1',
        key: '1-0-1',
        children: [{ title: 'leaf', key: '1-0-1-0', disabled: true }],
      },
      {
        title: 'leaf',
        key: '1-0-2',
      },
    ],
  },
];

const App: React.FC = () => {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <Tree
      showIcon
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      defaultSelectedKeys={['0-0-0', '0-0-1']}
      onSelect={onSelect}
      treeData={treeData}
      icon={({ expanded, leaf }) => {
        if (leaf) {
          return <DocumentTextSolid className="text-slate-400" />;
        }

        return expanded ? (
          <FolderOpenSolid className="text-sky-500" />
        ) : (
          <FolderCloseSolid className="text-sky-500" />
        );
      }}
    />
  );
};

export default App;
