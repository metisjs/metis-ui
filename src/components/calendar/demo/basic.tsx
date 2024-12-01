import React from 'react';
import { Button, Calendar } from 'metis-ui';

const App: React.FC = () => {
  return <Calendar extra={<Button type="primary">Add Event</Button>} className="h-[768px]" />;
};

export default App;
