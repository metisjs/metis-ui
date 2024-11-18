import React from 'react';
import { useLocale } from 'dumi';
import { Transfer } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const mockData = Array.from({ length: 4 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 2).map((item) => item.key);

const App: React.FC = () => {
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'list' },
        { name: 'header' },
        { name: 'title' },
        { name: 'body' },
        { name: 'search', link: `/components/input${localeSuffix}#semantic-dom` },
        { name: 'operation' },
        { name: 'item' },
        { name: 'footer' },
      ]}
      rootArgs={[{ name: 'disabled', type: 'boolean' }]}
    >
      <Transfer
        showSearch
        dataSource={mockData}
        targetKeys={initialTargetKeys}
        titles={['Source', 'Target']}
        render={(item) => item.title}
        footer={() => 'Footer'}
      />
    </SemanticPreview>
  );
};

export default App;
