import { useEffect, useRef } from 'react';
import { TransitionEvents } from '../interface';

function noop() {}
let eventNames = ['beforeEnter', 'afterEnter', 'beforeLeave', 'afterLeave'] as const;
function ensureEventHooksExist(events: TransitionEvents) {
  let result = {} as Record<keyof typeof events, () => void>;
  for (let name of eventNames) {
    result[name] = events[name] ?? noop;
  }
  return result;
}

export default function useEvents(events: TransitionEvents) {
  let eventsRef = useRef(ensureEventHooksExist(events));

  useEffect(() => {
    eventsRef.current = ensureEventHooksExist(events);
  }, [events]);

  return eventsRef;
}
