import React from 'react';
import { Slider } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'tracks' },
      { name: 'track' },
      { name: 'rail' },
      { name: 'handle' },
      {
        name: 'mark',
        desc: '`root` same as `label`',
        children: [{ name: 'dot' }, { name: 'label' }],
        args: [{ name: 'active', type: 'boolean' }],
      },
    ]}
    rootArgs={[{ name: 'disabled', type: 'boolean' }]}
  >
    <Slider
      defaultValue={30}
      marks={{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }}
      className="w-[360px]"
    />
  </SemanticPreview>
);

export default App;
