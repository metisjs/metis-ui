import React from 'react';
import { QuestionMarkCircleOutline } from '@metisjs/icons';
import { FloatButton } from 'metis-ui';

const App: React.FC = () => (
  <>
    <FloatButton icon={<QuestionMarkCircleOutline />} type="primary" className="end-6" />
    <FloatButton icon={<QuestionMarkCircleOutline />} type="default" className="end-24" />
  </>
);

export default App;
