import React from 'react';
import { useLocale } from 'dumi';
import { Pagination } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        {
          name: 'item',
          args: [
            { name: 'active', type: 'boolean' },
            { name: 'disabled', type: 'boolean' },
          ],
        },
        { name: 'prev' },
        { name: 'next' },
        { name: 'total' },
        {
          name: 'options',
          children: [
            { name: 'jumper', link: `/components/input${localeSuffix}#semantic-dom` },
            { name: 'sizeChanger', link: `/components/select${localeSuffix}#semantic-dom` },
          ],
        },
      ]}
    >
      <Pagination
        total={85}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
      />
    </SemanticPreview>
  );
};

export default App;
