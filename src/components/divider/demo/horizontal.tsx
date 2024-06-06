/**
 * description: 默认为水平分割线，可在中间加入文字。
 */
import { Divider } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <p className="text-sm">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider />
    <p className="text-sm">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider dashed />
    <p className="text-sm">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </>
);

export default App;
