/**
 * description: Transition 接受一个 show 属性来控制是否应该显示或隐藏孩子，以及一组生命周期属性（如 enterFrom 和 leaveTo），让您在转换的特定阶段添加 CSS 类。
 */
import { ArrowPathOutline } from '@metaoa/icons';
import { Button, Transition } from 'meta-ui';
import { clsx } from 'meta-ui/es/_util/classNameUtils';
import React, { useState } from 'react';

export default () => {
  const [isShowing, setIsShowing] = useState(true);

  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-32 w-32">
        <Transition
          // appear
          visible={isShowing}
          enter="transform transition duration-[2000ms]"
          enterFrom="opacity-0 rotate-[-120deg] scale-50"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transform duration-[2000ms] transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95"
          beforeEnter={() => console.log('beforeEnter')}
          afterEnter={() => console.log('afterEnter')}
          beforeLeave={() => console.log('beforeLeave')}
          afterLeave={() => console.log('afterLeave')}
        >
          {({ className, style }) => (
            <div
              className={clsx('h-full w-full rounded-md bg-red-400 shadow-lg', className)}
              style={style}
            />
          )}
        </Transition>
      </div>

      <Button
        icon={<ArrowPathOutline />}
        onClick={() => {
          setIsShowing(false);
          setTimeout(() => {
            setIsShowing(true);
          }, 2000);
        }}
        className="mt-8"
      >
        Click to transition
      </Button>
    </div>
  );
};
