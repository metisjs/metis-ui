import React from 'react';
import { Divider } from 'metis-ui';

const App: React.FC = () => (
  <>
    <Divider className="border-2 border-lime-600" />
    <Divider className="border-lime-600" dashed />
    <Divider className="border-lime-600" dashed>
      Text
    </Divider>
    <Divider type="vertical" className="h-15 border-sky-600" />
    <Divider type="vertical" className="h-15 border-sky-600" dashed />

    <div className="flex h-12 flex-col">
      <Divider className="bg-sky-600/5" orientation="left">
        Text
      </Divider>
    </div>
  </>
);

export default App;
