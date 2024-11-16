import React from 'react';
import { clsx, Select } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'arrow' },
      { name: 'clear' },
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
      { name: 'popup' },
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
          allowClear
          showSearch={showSearch}
          placeholder="Select a person"
          className={{
            root: 'w-72',
            clear: clsx({
              'opacity-100': hover?.path === 'clear',
            }),
          }}
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
