import React, { useState } from 'react';
import { MinusOutline, PlusOutline } from '@metisjs/icons';
import { Button, QRCode, Space } from 'metis-ui';

const MIN_SIZE = 48;
const MAX_SIZE = 300;

const App: React.FC = () => {
  const [size, setSize] = useState<number>(160);

  const increase = () => {
    setSize((prevSize) => {
      const newSize = prevSize + 10;
      if (newSize >= MAX_SIZE) {
        return MAX_SIZE;
      }
      return newSize;
    });
  };

  const decline = () => {
    setSize((prevSize) => {
      const newSize = prevSize - 10;
      if (newSize <= MIN_SIZE) {
        return MIN_SIZE;
      }
      return newSize;
    });
  };

  return (
    <>
      <Space.Compact className="mb-4">
        <Button onClick={decline} disabled={size <= MIN_SIZE} icon={<MinusOutline />}>
          Smaller
        </Button>
        <Button onClick={increase} disabled={size >= MAX_SIZE} icon={<PlusOutline />}>
          Larger
        </Button>
      </Space.Compact>
      <QRCode
        errorLevel="H"
        size={size}
        iconSize={size / 4}
        value="https://metisui.com/"
        icon="/logo.svg"
      />
    </>
  );
};

export default App;
