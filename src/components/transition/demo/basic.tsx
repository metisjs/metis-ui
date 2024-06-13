import { ArrowPathOutline } from '@metisjs/icons';
import { Button, Transition } from 'metis-ui';
import React, { useState } from 'react';

export default () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-32 w-32">
        <Transition
          appear
          visible={visible}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 rotate-[-120deg] scale-50"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transform duration-[400ms] transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
          beforeEnter={() => console.log('beforeEnter')}
          afterEnter={() => console.log('afterEnter')}
          beforeLeave={() => console.log('beforeLeave')}
          afterLeave={() => console.log('afterLeave')}
        >
          {({ className, style }, ref) => (
            <div
              ref={ref}
              className={`${className} h-full w-full rounded-md bg-red-400 shadow-lg`}
              style={style}
            />
          )}
        </Transition>
      </div>
      <Button
        icon={<ArrowPathOutline />}
        onClick={() => {
          setVisible(false);
          setTimeout(() => {
            setVisible(true);
          }, 500);
        }}
        className="mt-8"
      >
        Click to transition
      </Button>
    </div>
  );
};
