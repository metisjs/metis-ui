import React, { useRef, useState } from 'react';
import { Button } from 'metis-ui';
import Preview from 'metis-ui/es/image/Preview';

const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Preview in container
      </Button>
      <div
        ref={containerRef}
        className="relative mt-4 h-96 w-full translate-0 overflow-hidden rounded-lg bg-gray-950/5"
      >
        <Preview
          prefixCls="metis-image-preview"
          src={src}
          open={open}
          getContainer={false}
          getEventTarget={() => containerRef.current!}
          zIndex={1000}
          maskClosable={false}
          onClose={() => setOpen(false)}
        />
      </div>
    </>
  );
};

export default App;
