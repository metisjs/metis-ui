import React, { useRef, useState } from 'react';
import type { TourProps } from 'metis-ui';
import { Button, Descriptions, Slider, Tour } from 'metis-ui';

const App: React.FC = () => {
  const tourNodeRef = useRef(null);
  const [radius, setRadius] = useState(8);
  const [offsetX, setOffsetX] = useState(2);
  const [offsetY, setOffsetY] = useState(2);
  const [offset, setOffset] = useState(2);
  const [open, setOpen] = useState(false);
  const [offsetDirection, setOffsetDirection] = useState<'both' | 'individual'>('individual');

  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
          className="h-[118px] w-[480px]"
        />
      ),
      target: () => tourNodeRef.current,
    },
  ];

  const offsetGap =
    offsetDirection === 'both'
      ? { offset }
      : {
          offset: [offsetX, offsetY] as [number, number],
        };
  return (
    <div ref={tourNodeRef}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </Button>
      <Descriptions
        bordered
        size="small"
        column={1}
        className={{ root: 'mt-3', item: { label: 'w-36' } }}
        items={[
          {
            label: 'Radius',
            content: <Slider value={radius} onChange={(val) => val && setRadius(val)} />,
          },
          {
            label: 'Offset',
            content: (
              <Slider
                value={offset}
                max={50}
                onChange={(val) => val && setOffset(val)}
                onFocus={() => setOffsetDirection('both')}
              />
            ),
          },
          {
            label: 'Horizontal offset',
            content: (
              <Slider
                value={offsetX}
                max={50}
                onChange={(val) => val && setOffsetX(val)}
                onFocus={() => setOffsetDirection('individual')}
              />
            ),
          },
          {
            label: 'Vertical offset',
            content: (
              <Slider
                value={offsetY}
                max={50}
                onChange={(val) => val && setOffsetY(val)}
                onFocus={() => setOffsetDirection('individual')}
              />
            ),
          },
        ]}
      ></Descriptions>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        gap={{ ...offsetGap, radius }}
      />
    </div>
  );
};

export default App;
