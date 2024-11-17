import React from 'react';
import { Radio } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'radio',
        children: [{ name: 'indicator' }, { name: 'label' }],
        args: [
          { name: 'checked', type: 'boolean' },
          { name: 'disabled', type: 'boolean' },
        ],
      },
    ]}
  >
    <Radio.Group
      options={[
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: true },
      ]}
      defaultValue={'Apple'}
    />
  </SemanticPreview>
);

export default App;
