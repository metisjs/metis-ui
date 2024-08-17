import React from 'react';
import { QuestionMarkCircleOutline } from '@metisjs/icons';
import { Button, Popconfirm } from 'metis-ui';

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    icon={<QuestionMarkCircleOutline style={{ color: 'red' }} />}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
