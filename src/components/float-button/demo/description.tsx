import React from 'react';
import { QuestionMarkCircleOutline } from '@metisjs/icons';
import { FloatButton } from 'metis-ui';

const App: React.FC = () => (
  <>
    <FloatButton
      icon={<QuestionMarkCircleOutline />}
      description="HELP INFO"
      shape="square"
      className="end-6"
    />
    <FloatButton description="HELP INFO" shape="square" className="end-24" />
    <FloatButton
      icon={<QuestionMarkCircleOutline />}
      description="HELP"
      shape="square"
      className="end-44"
    />
  </>
);

export default App;
