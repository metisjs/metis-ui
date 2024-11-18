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
      {
        name: 'popup',
        children: [{ name: 'panel' }, { name: 'footer' }],
      },
    ]}
    rootArgs={[
      { name: 'open', type: 'boolean' },
      { name: 'disabled', type: 'boolean' },
    ]}
    height={800}
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
