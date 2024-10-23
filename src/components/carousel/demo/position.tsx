import React, { useState } from 'react';
import type { CarouselProps, GetProp } from 'metis-ui';
import { Carousel, Segmented } from 'metis-ui';

type IndicatorPosition = GetProp<CarouselProps, 'indicatorPosition'>;

const contentCls = 'h-40 bg-indigo-800 text-center text-white text-lg leading-[160px]';

const App: React.FC = () => {
  const [indicatorPosition, setIndicatorPosition] = useState<IndicatorPosition>('top');

  const handlePositionChange = (value: IndicatorPosition) => {
    setIndicatorPosition(value);
  };

  return (
    <>
      <Segmented
        options={[
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Outer', value: 'outer' },
        ]}
        value={indicatorPosition}
        onChange={handlePositionChange}
        className="mb-2"
      />
      <Carousel indicatorPosition={indicatorPosition}>
        <div className={contentCls}>1</div>
        <div className={contentCls}>2</div>
        <div className={contentCls}>3</div>
        <div className={contentCls}>4</div>
      </Carousel>
    </>
  );
};

export default App;
