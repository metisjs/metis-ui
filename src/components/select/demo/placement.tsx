import React, { useState } from 'react';
import { Segmented, Select } from 'metis-ui';
import type { SelectCommonPlacement } from '../interface';

const App: React.FC = () => {
  const [placement, setPlacement] = useState<SelectCommonPlacement>('topLeft');

  return (
    <>
      <Segmented
        value={placement}
        options={[
          { label: 'topLeft', value: 'topLeft' },
          { label: 'topRight', value: 'topRight' },
          { label: 'bottomLeft', value: 'bottomLeft' },
          { label: 'bottomRight', value: 'bottomRight' },
        ]}
        onChange={setPlacement}
      />
      <br />
      <br />
      <Select
        defaultValue="HangZhou"
        className="w-56"
        popupMatchSelectWidth={false}
        placement={placement}
        options={[
          {
            value: 'HangZhou',
            label: 'HangZhou #310000',
          },
          {
            value: 'NingBo',
            label: 'NingBo #315000',
          },
          {
            value: 'WenZhou',
            label: 'WenZhou #325000',
          },
        ]}
      />
    </>
  );
};

export default App;
