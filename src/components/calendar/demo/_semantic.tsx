import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useLocale } from 'dumi';
import type { CalendarProps } from 'metis-ui';
import { Button, Calendar } from 'metis-ui';
import type { SemanticItem } from '../../../../.dumi/components/SemanticPreview';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';
import { fakeFetchEvents } from './events';

const App: React.FC = () => {
  const { id } = useLocale();
  const isCN = id === 'zh-CN';

  const [mode, setMode] = useState<CalendarProps['mode']>('month');

  return (
    <SemanticPreview
      semantics={
        [
          { name: 'root' },
          {
            name: 'header',
            children: [
              { name: 'title' },
              { name: 'modeSwitcher' },
              { name: 'actions' },
              { name: 'extra' },
            ],
          },
          mode === 'year' && {
            name: 'yearPanel',
            children: [{ name: 'item' }, { name: 'title' }, { name: 'cell' }],
          },
          mode === 'month' && {
            name: 'monthPanel',
            children: [
              {
                name: 'cell',
                children: [
                  { name: 'dateRow' },
                  { name: 'date' },
                  isCN && { name: 'lunar' },
                  { name: 'eventMore' },
                ].filter(Boolean),
                args: [
                  { name: 'today', type: 'boolean' },
                  { name: 'inView', type: 'boolean' },
                ],
              },
              {
                name: 'allDayEvent',
                children: [{ name: 'icon' }, { name: 'title' }],
              },
              { name: 'timeEvent', children: [{ name: 'title' }, { name: 'time' }] },
            ],
          },
          mode === 'week' && {
            name: 'weekPanel',
            children: [
              { name: 'header' },
              {
                name: 'headerCell',
                children: [{ name: 'date' }, { name: 'weekDay' }, isCN && { name: 'lunar' }].filter(
                  Boolean,
                ),
                args: [{ name: 'today', type: 'boolean' }],
              },
              {
                name: 'body',
                children: [
                  { name: 'allDayRow' },
                  { name: 'timeColumn' },
                  { name: 'eventColumn' },
                  { name: 'eventCell' },
                  { name: 'timeCell' },
                  { name: 'nowTag' },
                  { name: 'nowLine' },
                  {
                    name: 'allDayEvent',
                    children: [{ name: 'icon' }, { name: 'title' }],
                  },
                  { name: 'timeEvent', children: [{ name: 'title' }, { name: 'time' }] },
                ],
              },
            ],
          },
          mode === 'day' && {
            name: 'dayPanel',
            children: [
              { name: 'header' },
              {
                name: 'headerCell',
                children: [{ name: 'date' }, { name: 'weekDay' }, isCN && { name: 'lunar' }].filter(
                  Boolean,
                ),
                args: [{ name: 'today', type: 'boolean' }],
              },
              { name: 'body' },
              {
                name: 'eventGrid',
                children: [
                  { name: 'allDayRow' },
                  { name: 'timeColumn' },
                  { name: 'eventColumn' },
                  { name: 'eventCell' },
                  { name: 'timeCell' },
                  { name: 'nowTag' },
                  { name: 'nowLine' },
                  {
                    name: 'allDayEvent',
                    children: [{ name: 'icon' }, { name: 'title' }],
                  },
                  { name: 'timeEvent', children: [{ name: 'title' }, { name: 'time' }] },
                ],
              },
              { name: 'calendar' },
            ],
          },
        ].filter(Boolean) as SemanticItem[]
      }
      compact
    >
      <Calendar
        mode={mode}
        events={fakeFetchEvents()}
        value={dayjs()}
        extra={<Button type="primary">Add Event</Button>}
        lunar={isCN}
        onModeChange={setMode}
        className="h-full"
      />
    </SemanticPreview>
  );
};

export default App;
