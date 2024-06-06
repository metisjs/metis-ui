/**
 * description: 可以通过 `placement` 手动指定弹出的位置。
 */
import { Segmented, Select } from 'metis-ui';
import { SelectCommonPlacement } from 'metis-ui/es/select/Select';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [placement, SetPlacement] = useState<SelectCommonPlacement>('topLeft');

  const placementChange = (value: string) => {
    SetPlacement(value as SelectCommonPlacement);
  };

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
        onChange={placementChange}
      />
      <br />
      <br />
      <Select
        defaultValue="HangZhou"
        style={{ width: 120 }}
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
