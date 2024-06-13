import range from 'lodash/range';
import { Button, Checkbox, Space, Transition } from 'metis-ui';
import { clsx } from 'metis-ui/es/_util/classNameUtils';
import { CheckboxValueType } from 'metis-ui/es/checkbox/Group';
import React, { useState } from 'react';

const keys = range(10).map((key) => key);
const defaultKeyList = keys.map((key) => {
  if (key === 3) {
    return { key, background: 'orange' };
  }
  return key;
});

export default () => {
  const [checkedKeys, setCheckedKeys] = useState<CheckboxValueType[]>(keys);
  const [keyList, setKeyList] =
    useState<(number | { key: number; background: string })[]>(defaultKeyList);

  const onFlush = () => {
    setKeyList(() =>
      checkedKeys.map((key: number) => {
        if (key === 3) {
          return { key, background: 'orange' };
        }
        return key;
      }),
    );
  };

  return (
    <Space direction="vertical">
      <Button onClick={onFlush}>Flush</Button>
      <Checkbox.Group options={keys} value={checkedKeys} onChange={setCheckedKeys} />
      <div>key 3 is a different component with others.</div>
      <Transition.List
        className="flex space-x-2"
        keys={keyList}
        enter="transition-all duration-[500ms]"
        enterFrom="w-0"
        enterTo="w-20"
        leave="transition-all duration-[500ms] ease-in-out"
        leaveFrom="w-20"
        leaveTo="w-0"
        onVisibleChanged={(changedVisible, info) => {
          console.log('Visible Changed >>>', changedVisible, info);
        }}
      >
        {({ key, background, className, style }, ref) => (
          <div
            ref={ref}
            className={clsx(`relative flex h-20 w-20 overflow-hidden bg-red-400`, className)}
            style={{
              background,
              ...style,
            }}
          >
            <span className="absolute left-[40px] top-1/2 -translate-x-1/2 -translate-y-1/2">
              {key}
            </span>
          </div>
        )}
      </Transition.List>
    </Space>
  );
};
