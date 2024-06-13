import { ScrollValues, Scrollbar } from 'metis-ui';
import React, { HTMLAttributes, useState } from 'react';
import { Lorem } from './vertical';

export default () => {
  const [top, setTop] = useState(0);

  const handleUpdate = (values: ScrollValues) => {
    const { top } = values;
    setTop(top);
  };

  const renderView = ({ style, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const viewStyle = {
      padding: 15,
      backgroundColor: `rgb(${Math.round(255 - top * 255)}, ${Math.round(top * 255)}, ${Math.round(
        255,
      )})`,
      color: `rgb(${Math.round(255 - top * 255)}, ${Math.round(255 - top * 255)}, ${Math.round(
        255 - top * 255,
      )})`,
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  const renderThumb = ({ style, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const thumbStyle = {
      backgroundColor: `rgb(${Math.round(255 - top * 255)}, ${Math.round(
        255 - top * 255,
      )}, ${Math.round(255 - top * 255)})`,
      borderRadius: 'inherit',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <Scrollbar
      className="h-[300px] max-w-[600px]"
      renderView={renderView}
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      onUpdate={handleUpdate}
    >
      <Lorem />
    </Scrollbar>
  );
};
