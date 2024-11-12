import React, { useRef, useState } from 'react';
import { EllipsisHorizontalOutline } from '@metisjs/icons';
import type { TourProps } from 'metis-ui';
import { Button, Divider, Space, Tour } from 'metis-ui';

const App: React.FC = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const [open, setOpen] = useState<boolean>(false);

  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => ref1.current,
    },
    {
      title: 'Save',
      description: 'Save your changes.',
      target: () => ref2.current,
      className: {
        mask: 'fill-indigo-600/40 shadow-inner',
      },
    },
    {
      title: 'Other Actions',
      description: 'Click to see other actions.',
      target: () => ref3.current,
      mask: false,
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </Button>

      <Divider />

      <Space>
        <Button ref={ref1}> Upload</Button>
        <Button ref={ref2} type="primary">
          Save
        </Button>
        <Button ref={ref3} icon={<EllipsisHorizontalOutline />} />
      </Space>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        className={{ mask: 'fill-sky-600/40' }}
      />
    </>
  );
};

export default App;
