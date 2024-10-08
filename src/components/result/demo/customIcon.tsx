import React from 'react';
import { FaceSmileSolid } from '@metisjs/icons';
import { Button, Result } from 'metis-ui';

const App: React.FC = () => (
  <Result
    icon={<FaceSmileSolid />}
    title="Great, we have done all the operations!"
    extra={<Button type="primary">Next</Button>}
  />
);

export default App;
