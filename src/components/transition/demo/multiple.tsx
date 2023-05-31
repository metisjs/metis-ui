/**
 * description: 有时您需要使用不同的动画来转换多个元素，但所有元素都基于相同的状态。例如，假设用户单击一个按钮以打开一个在屏幕上滑动的侧边栏，同时您还需要淡入背景叠加层。
 */
import { Button, Space, Transition } from 'meta-ui';
import React, { useState } from 'react';

export default () => {
  const [isShowing, setIsShowing] = useState(true);
  return (
    <Space direction="vertical">
      <Button onClick={() => setIsShowing((isShowing) => !isShowing)}>Toggle</Button>
      <Transition show={isShowing}>
        <Space>
          {/* Background overlay */}
          <Transition.Child
            unmount
            enter="transition-opacity ease-linear duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="h-32 w-32 rounded-md bg-red-400 shadow-lg" />
          </Transition.Child>

          {/* Sliding sidebar */}
          {/* <Transition.Child
            unmount={false}
            enter="transition ease-in-out duration-500 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-500 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="h-32 w-32 rounded-md bg-indigo-400 shadow-lg" />
          </Transition.Child> */}
        </Space>
      </Transition>
    </Space>
  );
};
