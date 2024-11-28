import React from 'react';
import { clsx, TimePicker } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'input' },
      { name: 'suffix' },
      { name: 'clear' },
      { name: 'popup' },
      {
        name: 'panel',
        children: [
          { name: 'column' },
          {
            name: 'cell',
            children: [{ name: 'inner' }],
            args: [
              { name: 'disabled', type: 'boolean' },
              { name: 'selected', type: 'boolean' },
            ],
          },
        ],
      },
      { name: 'footer' },
    ]}
    rootArgs={[
      { name: 'open', type: 'boolean' },
      { name: 'disabled', type: 'boolean' },
    ]}
  >
    {(hover) => {
      return (
        <TimePicker
          className={{
            clear: clsx({
              'opacity-100': hover?.path === 'clear',
            }),
          }}
          open
          value="13:08:36"
          getPopupContainer={(node) => node.parentElement!}
        />
      );
    }}
  </SemanticPreview>
);

export default App;
