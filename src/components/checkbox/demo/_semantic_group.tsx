import React from 'react';
import { Checkbox } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'checkbox',
        children: [{ name: 'indicator' }, { name: 'label' }],
        args: [
          { name: 'checked', type: 'boolean' },
          { name: 'disabled', type: 'boolean' },
        ],
      },
    ]}
  >
    <Checkbox.Group
      options={[
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
      ]}
      defaultValue={['Pear']}
    />
  </SemanticPreview>
);

export default App;
