import React, { useRef } from 'react';
import { Image } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  return (
    <SemanticPreview
      ref={previewRef}
      semantics={[
        { name: 'root' },
        { name: 'image', link: './#image-1' },
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
        <Image.PreviewGroup
          preview={{
            open: hover?.path.startsWith('preview') ?? false,
            getContainer: () => previewRef.current!,
          }}
        >
          <Image width={200} src="/logo.svg" />
          <Image
            width={200}
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </Image.PreviewGroup>
      )}
    </SemanticPreview>
  );
};

export default App;
