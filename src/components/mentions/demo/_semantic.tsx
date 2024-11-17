import React from 'react';
import { Mentions } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'textarea' },
      { name: 'clear' },
      { name: 'popup' },
      {
        name: 'option',
        children: [{ name: 'inner' }, { name: 'label' }],
        args: [{ name: 'disabled', type: 'boolean' }],
      },
    ]}
    rootArgs={[{ name: 'disabled', type: 'boolean' }]}
  >
    <Mentions
      className="w-[360px]"
      open
      allowClear
      defaultValue="@tom"
      options={[
        {
          value: 'tom',
          label: 'tom',
        },
        {
          value: 'jack',
          label: 'jack',
        },
        {
          value: 'minm',
          label: 'minm',
        },
      ]}
      getPopupContainer={(node) => node.parentElement!.parentElement!}
    />
  </SemanticPreview>
);

export default App;
