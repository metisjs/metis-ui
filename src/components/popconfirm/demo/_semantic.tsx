import React from 'react';
import { useLocale } from 'dumi';
import { Button, Popconfirm } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'popover', link: `/components/popover${localeSuffix}#semantic-dom` },
        { name: 'icon' },
        { name: 'title' },
        { name: 'description' },
        { name: 'actions' },
      ]}
      rootArgs={[{ name: 'open', type: 'boolean' }]}
    >
      <Popconfirm
        open
        title="Delete the task"
        description="Are you sure to delete this task?"
        getPopupContainer={(node) => node.parentElement!}
      >
        <Button danger>Delete</Button>
      </Popconfirm>
    </SemanticPreview>
  );
};

export default App;
