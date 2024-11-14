import React from 'react';
import { clsx, Space, Splitter } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-base text-text-secondary">{props.text}</div>
  </Space>
);
const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'bar',
        children: [
          {
            name: 'dragger',
          },
          {
            name: 'collapseBar',
          },
        ],
      },
      { name: 'panel' },
    ]}
  >
    {(hover) => (
      <Splitter
        className={{
          bar: { collapseBar: clsx(hover?.name === 'collapseBar' && 'opacity-100') },
        }}
        style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      >
        <Splitter.Panel defaultSize="40%" min="20%" max="70%" collapsible>
          <Desc text="First" />
        </Splitter.Panel>
        <Splitter.Panel collapsible>
          <Desc text="Second" />
        </Splitter.Panel>
      </Splitter>
    )}
  </SemanticPreview>
);

export default App;
