import * as React from 'react';
import useMergedState from '@rc-component/util/es/hooks/useMergedState';

const uniquePrefix = Math.random().toFixed(5).toString().slice(2);

let internalId = 0;

export default function useUUID(id?: string) {
  const [uuid, setUUID] = useMergedState(id, {
    value: id,
  });

  React.useEffect(() => {
    internalId += 1;
    const newId = process.env.NODE_ENV === 'test' ? 'test' : `${uniquePrefix}-${internalId}`;
    setUUID(`metis-menu-uuid-${newId}`);
  }, []);

  return uuid;
}
