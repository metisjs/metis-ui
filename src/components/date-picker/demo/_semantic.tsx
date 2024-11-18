import React from 'react';
import dayjs from 'dayjs';
import { clsx, DatePicker } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const now = dayjs();
  return (
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
            { name: 'presets', children: [{ name: 'item' }] },
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
            {
              name: 'time',
              children: [
                { name: 'header' },
                { name: 'body' },
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
          ],
        },
      ]}
      rootArgs={[
        { name: 'open', type: 'boolean' },
        { name: 'disabled', type: 'boolean' },
      ]}
    >
      {(hover) => {
        const multi = hover?.path === 'item';
        const value = multi ? [now, now.add(1, 'day')] : now;
        const showTime = hover?.path.startsWith('popup_time');

        return (
          <DatePicker
            presets={[
              { label: 'Yesterday', value: dayjs().add(-1, 'd') },
              { label: 'Last Week', value: dayjs().add(-7, 'd') },
              { label: 'Last Month', value: dayjs().add(-1, 'month') },
            ]}
            multiple={multi}
            showTime={showTime}
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
};

export default App;
