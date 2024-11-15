import React from 'react';
import { Select } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'popup' },
      { name: 'arrow' },
      {
        name: 'selector',
        children: [
          {
            name: 'search',
          },
          {
            name: 'item',
          },
          {
            name: 'placeholder',
          },
          {
            name: 'input',
          },
        ],
      },
      {
        name: 'option',
        children: [
          {
            name: 'label',
          },
          {
            name: 'state',
          },
        ],
        args: [
          {
            name: 'group',
            type: 'boolean',
          },
          {
            name: 'grouped',
            type: 'boolean',
          },
          {
            name: 'selected',
            type: 'boolean',
          },
          {
            name: 'active',
            type: 'boolean',
          },
          {
            name: 'disabled',
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
    {(hover) => {
      const multi = hover?.path === 'selector_item';
      const showSearch = hover?.path === 'selector_search';
      const value = multi
        ? ['jack', 'lucy']
        : hover?.path === 'selector_placeholder'
          ? undefined
          : 'jack';

      return (
        <Select
          open
          showSearch={showSearch}
          placeholder="Select a person"
          style={{ width: 280 }}
          mode={multi ? 'multiple' : undefined}
          value={value as any}
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'yiminghe', label: 'Yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
          ]}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        />
      );
    }}
  </SemanticPreview>
);

export default App;
