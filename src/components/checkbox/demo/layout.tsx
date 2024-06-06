/**
 * description: Checkbox.Group 内嵌 Checkbox，可以实现灵活的布局。
 */
import { Checkbox } from 'metis-ui';
import type { CheckboxValueType } from 'metis-ui/es/checkbox/Group';
import React from 'react';

const onChange = (checkedValues: CheckboxValueType[]) => {
  console.log('checked = ', checkedValues);
};

const App: React.FC = () => (
  <Checkbox.Group className="flex" onChange={onChange}>
    <div className="flex w-full flex-wrap">
      <div className="basis-1/3">
        <Checkbox value="A">A</Checkbox>
      </div>
      <div className="basis-1/3">
        <Checkbox value="B">B</Checkbox>
      </div>
      <div className="basis-1/3">
        <Checkbox value="C">C</Checkbox>
      </div>
      <div className="basis-1/3">
        <Checkbox value="D">D</Checkbox>
      </div>
      <div className="basis-1/3">
        <Checkbox value="E">E</Checkbox>
      </div>
    </div>
  </Checkbox.Group>
);

export default App;
