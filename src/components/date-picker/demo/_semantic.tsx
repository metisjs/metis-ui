import React from 'react';
import dayjs from 'dayjs';
import { clsx, DatePicker } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'input' },
      { name: 'suffix' },
      { name: 'clear' },
      {
        name: 'item',
        desc: 'Only available in  multiple mode',
      },
      {
        name: 'popup',
        children: [
          { name: 'panel' },
          { name: 'header' },
          { name: 'body' },
          {
            name: 'cell',
            children: [{ name: 'inner' }],
            args: [
              { name: 'disabled', type: 'boolean' },
              { name: 'hover', type: 'boolean' },
              { name: 'inView', type: 'boolean' },
              { name: 'inRange', type: 'boolean' },
              { name: 'rangeStart', type: 'boolean' },
              { name: 'rangeEnd', type: 'boolean' },
              { name: 'selected', type: 'boolean' },
              { name: 'today', type: 'boolean' },
            ],
          },
          { name: 'footer' },
        ],
      },
    ]}
    rootArgs={[
      { name: 'open', type: 'boolean' },
      { name: 'disabled', type: 'boolean' },
    ]}
    height={800}
  >
    {(hover) => {
      const multi = hover?.path === 'item';
      const value = multi ? [dayjs(), dayjs().add(1, 'day')] : dayjs();

      return (
        <DatePicker
          multiple={multi}
          className={{
            root: 'w-72',
            clear: clsx({
              'opacity-100': hover?.path === 'clear',
            }),
          }}
          open
          value={value as any}
          getPopupContainer={(node) => node.parentElement!}
        />
      );
    }}
  </SemanticPreview>
);

export default App;
