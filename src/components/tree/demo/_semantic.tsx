import React from 'react';
import { DocumentTextSolid, FolderCloseSolid, FolderOpenSolid } from '@metisjs/icons';
import { useLocale } from 'dumi';
import type { TreeDataNode } from 'metis-ui';
import { Tree } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
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
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'view' },
        {
          name: 'node',
          children: [
            { name: 'switcher' },
            { name: 'indent' },
            { name: 'content' },
            { name: 'title' },
            { name: 'icon' },
            { name: 'checkbox', link: `/components/checkbox${localeSuffix}#semantic-dom` },
          ],
          args: [
            { name: 'selected', type: 'boolean' },
            { name: 'checked', type: 'boolean' },
            { name: 'halfChecked', type: 'boolean' },
            { name: 'leaf', type: 'boolean' },
            { name: 'expanded', type: 'boolean' },
          ],
        },
      ]}
    >
      <Tree
        showIcon
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
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
        className="w-[240px]"
      />
    </SemanticPreview>
  );
};

export default App;
