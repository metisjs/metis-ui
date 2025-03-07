import React from 'react';
import { AutoComplete } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'clear' },
      {
        name: 'selector',
        children: [
          {
            name: 'search',
          },
          {
            name: 'placeholder',
          },
          {
            name: 'input',
          },
        ],
      },
      { name: 'popup' },
      {
        name: 'option',
        children: [
          {
            name: 'label',
          },
        ],
        args: [
          {
            name: 'active',
            type: 'boolean',
          },
        ],
      },
    ]}
    rootArgs={[
      { name: 'open', type: 'boolean' },
      { name: 'disabled', type: 'boolean' },
    ]}
  >
    {(hover) => (
      <AutoComplete
        allowClear
        options={[{ value: '1' }, { value: '11' }, { value: '111' }]}
        className="w-72"
        placeholder="input here"
        value={hover?.path === 'selector_placeholder' ? undefined : '1'}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        open
      />
    )}
  </SemanticPreview>
);

export default App;
