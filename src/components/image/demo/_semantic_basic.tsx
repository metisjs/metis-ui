import React, { useRef } from 'react';
import { clsx, Image } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  return (
    <SemanticPreview
      ref={previewRef}
      semantics={[
        { name: 'root' },
        { name: 'img' },
        { name: 'mask' },
        {
          name: 'preview',
          children: [
            { name: 'body' },
            { name: 'mask' },
            { name: 'image' },
            {
              name: 'operations',
              children: [{ name: 'operation' }, { name: 'close' }],
              args: [{ name: 'current', type: 'number' }],
            },
          ],
        },
      ]}
      transform
    >
      {(hover) => (
        <Image
          className={{ mask: clsx(hover?.name === 'mask' && 'opacity-100') }}
          width={200}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          preview={{
            open: hover?.path.startsWith('preview') ?? false,
            getContainer: () => previewRef.current!,
          }}
        />
      )}
    </SemanticPreview>
  );
};

export default App;
