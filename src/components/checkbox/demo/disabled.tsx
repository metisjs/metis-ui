import React from 'react';
import { Checkbox } from 'metis-ui';

const App: React.FC = () => (
  <>
    <Checkbox defaultChecked={false} disabled>
      Checkbox
    </Checkbox>
    <br />
    <Checkbox indeterminate disabled>
      Checkbox
    </Checkbox>
    <br />
    <Checkbox defaultChecked disabled>
      Checkbox
    </Checkbox>
  </>
);

export default App;
