import React from 'react';
import type { Dayjs } from 'dayjs';
import type { CalendarProps, GetProp } from 'metis-ui';
import { Button, Calendar } from 'metis-ui';

type EventsType = GetProp<CalendarProps<Dayjs>, 'events'>;

export function fakeFetchEvents(): EventsType {
  // const now = dayjs();

  return [
    // {
    //   key: 1,
    //   title: 'All-day Event 1',
    //   start: now,
    //   end: now,
    //   allDay: true,
    // },
    // {
    //   key: 2,
    //   title: 'Event',
    //   start: now.add(-5, 'day').set('hour', 9).set('minute', 30),
    //   end: now.add(3, 'day').set('hour', 22).set('minute', 30),
    // },
    // {
    //   key: 3,
    //   title: 'All-day Event 2',
    //   start: now.add(-2, 'day'),
    //   end: now.add(6, 'day'),
    //   allDay: true,
    // },
    // {
    //   key: 4,
    //   title: 'Event',
    //   start: now.add(-1, 'day').set('hour', 7).set('minute', 15),
    //   end: now.add(2, 'day').set('hour', 20).set('minute', 45),
    // },
    {
      key: 1,
      title: 'All-day Event 0',
      start: '2024-12-05',
      end: '2024-12-12',
      allDay: true,
    },
    {
      key: 4,
      title: 'All-day Event 2',
      start: '2024-12-09',
      end: '2024-12-11',
      allDay: true,
    },
    {
      key: 2,
      title: 'All-day Event 1',
      start: '2024-12-11',
      end: '2024-12-13',
      allDay: true,
    },
    {
      key: 3,
      title: 'All-day Event 1',
      start: '2024-12-12',
      end: '2024-12-14',
      allDay: true,
    },
    {
      key: 5,
      title: 'All-day Event 3',
      start: '2024-12-09',
      end: '2024-12-12',
      allDay: true,
    },
    {
      key: 6,
      title: 'All-day Event 2',
      start: '2024-12-13',
      end: '2024-12-14',
      allDay: true,
    },
    {
      key: 7,
      title: 'All-day Event 2',
      start: '2024-12-15',
      end: '2024-12-16',
      allDay: true,
    },
    {
      key: 8,
      title: 'All-day Event 2',
      start: '2024-12-21',
      end: '2024-12-21',
      allDay: true,
    },
  ];
}

const App: React.FC = () => (
  <Calendar
    events={fakeFetchEvents()}
    extra={<Button type="primary">Add Event</Button>}
    className="h-[768px]"
  />
);

export default App;
