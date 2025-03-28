import React from 'react';
import { ArrowPathOutline, QuestionMarkCircleOutline } from '@metisjs/icons';
import { FloatButton } from 'metis-ui';

const App: React.FC = () => (
  <>
    <FloatButton.Group shape="circle" className="end-6">
      <FloatButton icon={<QuestionMarkCircleOutline />} />
      <FloatButton />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
    <FloatButton.Group shape="square" className="end-24">
      <FloatButton icon={<QuestionMarkCircleOutline />} />
      <FloatButton />
      <FloatButton icon={<ArrowPathOutline />} />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
  </>
);

export default App;
