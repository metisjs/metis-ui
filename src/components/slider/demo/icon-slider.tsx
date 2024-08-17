import React, { useState } from 'react';
import { FaceFrownOutline, FaceSmileOutline } from '@metisjs/icons';
import { Slider } from 'metis-ui';
import { clsx } from 'metis-ui/es/_util/classNameUtils';

interface IconSliderProps {
  max: number;
  min: number;
}

const IconSlider: React.FC<IconSliderProps> = (props) => {
  const { max, min } = props;
  const [value, setValue] = useState(0);

  const mid = Number(((max - min) / 2).toFixed(5));
  const preColorCls = value >= mid ? '' : 'text-primary';
  const nextColorCls = value >= mid ? 'text-primary' : '';

  return (
    <div className="flex w-full items-center gap-4">
      <FaceFrownOutline className={clsx(preColorCls, 'h-5 w-5')} />
      <Slider {...props} onChange={setValue} value={value} className="flex-1" />
      <FaceSmileOutline className={clsx(nextColorCls, 'h-5 w-5')} />
    </div>
  );
};

const App: React.FC = () => <IconSlider min={0} max={20} />;

export default App;
