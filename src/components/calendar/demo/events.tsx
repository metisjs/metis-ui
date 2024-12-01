import React from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { CalendarProps, GetProp } from 'metis-ui';
import { Button, Calendar } from 'metis-ui';

type EventsType = GetProp<CalendarProps<Dayjs>, 'events'>;

export function fakeFetchEvents(): EventsType {
  const now = dayjs();

  return [
    {
      key: 1,
      title: 'Daily Event',
      start: now,
      end: now,
      allDay: true,
    },
    {
      key: 2,
      title: 'Event',
      start: now.add(-5, 'day').set('hour', 9).set('minute', 30),
      end: now.add(3, 'day').set('hour', 22).set('minute', 30),
    },
    {
      key: 3,
      title: 'Long Event',
      start: now.add(-2, 'day'),
      end: now.add(6, 'day'),
      allDay: true,
    },
    {
      key: 4,
      title: 'Event',
      start: now.add(-1, 'day').set('hour', 7).set('minute', 15),
      end: now.add(2, 'day').set('hour', 20).set('minute', 45),
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
