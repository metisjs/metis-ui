import React from 'react';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';
import TextArea from '../TextArea';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'textarea' }, { name: 'count' }, { name: 'clear' }]}
  >
    <TextArea value="Hello World" showCount maxLength={1000} allowClear className="w-480px" />
  </SemanticPreview>
);

export default App;
