import React from 'react';
import { GiftOutline } from '@metisjs/icons';
import type { Dayjs } from 'dayjs';
import type { CalendarProps, GetProp } from 'metis-ui';
import { Button, Calendar } from 'metis-ui';

type EventsType = GetProp<CalendarProps<Dayjs>, 'events'>;

// function generateRandomEvents(count: number): EventType<Dayjs>[] {
//   const events: EventType<Dayjs>[] = [];

//   for (let i = 1; i <= count; i++) {
//     // Random day between 1 and 31
//     const day = Math.floor(Math.random() * 31) + 1;

//     // Random month between 1 (January) and 12 (December)
//     const month = Math.floor(Math.random() * 12);

//     // Random start time
//     const startHour = Math.floor(Math.random() * 24);
//     const startMinute = Math.floor(Math.random() * 60);

//     // Start datetime object
//     const start = new Date(2024, month, day, startHour, startMinute);

//     // Random duration between 1 and 240 minutes (1 to 4 hours)
//     const duration = Math.floor(Math.random() * 240) + 1;

//     // End datetime object
//     const end = new Date(start.getTime() + duration * 60000); // Add duration in milliseconds

//     // Format dates to "YYYY-MM-DD HH:mm"
//     const formatDate = (date: Date): string => {
//       const pad = (num: number): string => num.toString().padStart(2, '0');
//       return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
//         date.getHours(),
//       )}:${pad(date.getMinutes())}`;
//     };

//     // Add event to list
//     events.push({
//       key: i,
//       title: `Time Event ${i}`,
//       start: formatDate(start),
//       end: formatDate(end),
//     });
//   }

//   return events;
// }

// const fakeEvents = generateRandomEvents(2000);

export function fakeFetchEvents(): EventsType {
  // const now = dayjs();

  return [
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
      end: '2024-12-12',
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
      start: '2024-12-08',
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
      title: "Tom's birthday",
      start: '2024-12-21',
      end: '2024-12-21',
      color: 'blue',
      icon: <GiftOutline />,
      allDay: true,
    },
    {
      key: 9,
      title: 'Time Event',
      start: '2024-12-13 09:00',
      end: '2024-12-21 18:30',
    },
    {
      key: 10,
      title: 'Time Event',
      start: '2024-12-13 07:00',
      end: '2024-12-13 18:30',
    },
    {
      key: 11,
      title: 'Time Event',
      start: '2024-12-15 09:00',
      end: '2024-12-18 18:30',
      color: 'pink',
    },
    {
      key: 12,
      title: 'Time Event',
      start: '2024-12-13 13:00',
      end: '2024-12-13 13:25',
      color: 'pink',
    },
    {
      key: 13,
      title: 'Time Event',
      start: '2024-12-10 08:00',
      end: '2024-12-10 17:30',
      color: 'green',
    },
    {
      key: 14,
      title: 'Time Event',
      start: '2024-12-05 03:00',
      end: '2024-12-05 05:45',
    },
    {
      key: 15,
      title: 'Time Event',
      start: '2024-12-05 03:00',
      end: '2024-12-05 04:30',
    },
    {
      key: 16,
      title: 'Time Event',
      start: '2024-12-05 04:45',
      end: '2024-12-05 06:00',
    },
    {
      key: 17,
      title: 'Time Event 17',
      start: '2024-12-25 13:00',
      end: '2024-12-25 14:30',
    },
    {
      key: 18,
      title: 'Time Event 18',
      start: '2024-12-25 13:00',
      end: '2024-12-25 14:10',
    },
    {
      key: 19,
      title: 'Time Event 19',
      start: '2024-12-25 13:00',
      end: '2024-12-25 17:35',
    },
    {
      key: 20,
      title: 'Time Event 20',
      start: '2024-12-25 14:55',
      end: '2024-12-25 18:30',
    },
    {
      key: 21,
      title: 'Time Event 21',
      start: '2024-12-25 14:05',
      end: '2024-12-25 17:30',
    },
    // {
    //   key: 22,
    //   title: 'Time Event 22',
    //   start: '2024-12-25 14:55',
    //   end: '2024-12-25 16:30',
    // },
    // {
    //   key: 23,
    //   title: 'Time Event 23',
    //   start: '2024-12-25 14:55',
    //   end: '2024-12-25 16:30',
    // },
    // {
    //   key: 24,
    //   title: 'Time Event 24',
    //   start: '2024-12-25 14:55',
    //   end: '2024-12-25 16:30',
    // },
    {
      key: 25,
      title: 'Time Event 25',
      start: '2024-12-25 15:55',
      end: '2024-12-25 18:30',
    },
    {
      key: 26,
      title: 'Time Event 26',
      start: '2024-12-25 16:05',
      end: '2024-12-25 18:30',
    },
    {
      key: 27,
      title: 'Time Event 27',
      start: '2024-12-25 16:05',
      end: '2024-12-25 18:30',
    },
    {
      key: 28,
      title: 'Time Event 28',
      start: '2024-12-25 16:05',
      end: '2024-12-25 18:30',
    },
    {
      key: 29,
      title: 'Time Event 29',
      start: '2024-12-25 16:35',
      end: '2024-12-25 18:30',
    },
    {
      key: 30,
      title: 'Time Event 30',
      start: '2024-12-25 15:05',
      end: '2024-12-25 18:30',
    },
  ];
}

const App: React.FC = () => (
  <Calendar
    events={fakeFetchEvents()}
    extra={<Button type="primary">Add Event</Button>}
    // mode="day"
    // value={dayjs('2024-12-25')}
    className="h-screen"
  />
);

export default App;
