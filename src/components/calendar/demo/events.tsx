import React from 'react';
import { GiftOutline } from '@metisjs/icons';
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
      title: 'Event 0',
      start: now.subtract(15, 'day'),
      end: now.subtract(2, 'day'),
      allDay: true,
    },
    {
      key: 2,
      title: 'Event 1',
      start: now.subtract(5, 'day'),
      end: now.add(3, 'day'),
      allDay: true,
    },
    {
      key: 3,
      title: 'Event 2',
      start: now,
      end: now.add(3, 'day'),
      allDay: true,
    },
    {
      key: 4,
      title: 'Event 3',
      start: now.add(10, 'day'),
      end: now.add(14, 'day'),
      allDay: true,
    },
    {
      key: 5,
      title: 'Event 4',
      start: now.subtract(3, 'day'),
      end: now.subtract(1, 'day'),
      allDay: true,
    },
    {
      key: 6,
      title: "Tom's birthday",
      start: now,
      end: now,
      color: 'blue',
      icon: <GiftOutline />,
      allDay: true,
    },
    {
      key: 9,
      title: 'Time Event 0',
      start: now.add(2, 'day'),
      end: now.add(2, 'day').add(3, 'hour'),
    },
    {
      key: 10,
      title: 'Time Event 1',
      start: now.subtract(4, 'day').hour(9).minute(0),
      end: now.subtract(4, 'day').hour(13).minute(10),
    },
    {
      key: 11,
      title: 'Time Event 2',
      start: now.subtract(4, 'day').hour(9).minute(0),
      end: now.subtract(4, 'day').hour(17).minute(30),
      color: 'pink',
    },
    {
      key: 12,
      title: 'Time Event 3',
      start: now.subtract(8, 'day').hour(13).minute(0),
      end: now.subtract(8, 'day').hour(20).minute(15),
      color: 'green',
    },
    {
      key: 17,
      title: 'Time Event 4',
      start: now.hour(13).minute(0),
      end: now.hour(14).minute(50),
    },
    {
      key: 18,
      title: 'Time Event 5',
      start: now.hour(13).minute(0),
      end: now.hour(14).minute(40),
    },
    {
      key: 19,
      title: 'Time Event 6',
      start: now.hour(13).minute(0),
      end: now.hour(17).minute(35),
    },
    {
      key: 20,
      title: 'Time Event 7',
      start: now.hour(14).minute(55),
      end: now.hour(18).minute(30),
    },
    {
      key: 21,
      title: 'Time Event 8',
      start: now.hour(14).minute(5),
      end: now.hour(17).minute(30),
    },
    {
      key: 22,
      title: 'Time Event 9',
      start: now.hour(14).minute(55),
      end: now.hour(16).minute(30),
    },
    {
      key: 23,
      title: 'Time Event 10',
      start: now.hour(14).minute(55),
      end: now.hour(16).minute(30),
    },
    {
      key: 24,
      title: 'Time Event 11',
      start: now.hour(14).minute(55),
      end: now.hour(16).minute(30),
    },
    {
      key: 25,
      title: 'Time Event 12',
      start: now.hour(15).minute(30),
      end: now.hour(16).minute(30),
    },
    {
      key: 26,
      title: 'Time Event 13',
      start: now.hour(20).minute(0),
      end: now.hour(21).minute(30),
    },
    {
      key: 27,
      title: 'Time Event 14',
      start: now.hour(16).minute(35),
      end: now.hour(18).minute(30),
    },
    {
      key: 28,
      title: 'Time Event 15',
      start: now.hour(15).minute(55),
      end: now.hour(17).minute(30),
    },
    {
      key: 29,
      title: 'Time Event 16',
      start: now.hour(15).minute(55),
      end: now.hour(17).minute(40),
    },
    {
      key: 30,
      title: 'Time Event 17',
      start: now.hour(15).minute(30),
      end: now.hour(19).minute(20),
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
