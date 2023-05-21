/**
 * description: Transition 接受一个 show 属性来控制是否应该显示或隐藏孩子，以及一组生命周期属性（如 enterFrom 和 leaveTo），让您在转换的特定阶段添加 CSS 类。
 */
import { ArrowPathOutline } from '@metaoa/icons';
import { Button, Transition } from 'meta-ui';
import React, { Fragment, useState } from 'react';

export default () => {
  const [isShowing, setIsShowing] = useState(true);

  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-32 w-32">
        <Transition
          appear
          as={Fragment}
          show={isShowing}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 rotate-[-120deg] scale-50"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <div className="h-full w-full rounded-md bg-red-400 shadow-lg" />
        </Transition>
      </div>

      <Button
        icon={<ArrowPathOutline />}
        onClick={() => {
          setIsShowing(false);
          setTimeout(() => {
            setIsShowing(true);
          }, 500);
        }}
        className="mt-8"
      >
        Click to transition
      </Button>
    </div>
  );
};
