import * as React from 'react';
import * as MetisIcons from '@metisjs/icons';
import { clsx, Transition } from 'metis-ui';

const allIcons: {
  [key: string]: any;
} = MetisIcons;

export interface CopyableIconProps {
  name: string;
}

const CopyableIcon: React.FC<CopyableIconProps> = ({ name }) => {
  const [state, setState] = React.useState('idle');

  const copy = () => {
    if (state === 'copied') return;

    navigator.clipboard.writeText(`<${name} />`).then(() => {
      setState('copied');
    });
  };

  const activate = () => {
    if (state === 'idle') {
      setState('active');
    }
  };

  const deactivate = () => {
    if (state === 'active') {
      setState('idle');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }
    if (state === 'active' && e.key === 'Escape') {
      setState('idle');
    } else if (state === 'idle' && ['Enter', ' ', 'ArrowDown'].includes(e.key)) {
      setState('active');
    } else if (state === 'active' && ['Enter', ' '].includes(e.key)) {
      copy();
    }
  };

  React.useEffect(() => {
    if (state === 'copied') {
      let handle = window.setTimeout(() => {
        setState('idle');
      }, 1000);
      return () => {
        window.clearTimeout(handle);
      };
    }
  }, [state]);

  return (
    <div onMouseEnter={activate} onMouseLeave={deactivate}>
      <div className="relative h-[8.5rem]">
        <button
          type="button"
          onKeyDown={onKeyDown}
          onBlur={() => {
            window.setTimeout(() => {
              deactivate();
            }, 0);
          }}
          id={`${name}-btn`}
          aria-label={name}
          aria-haspopup="true"
          aria-controls={name}
          aria-expanded={state === 'active'}
          className="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl text-text  ring-1 ring-inset ring-border hover:text-primary"
          onClick={copy}
        >
          <span
            className={clsx(
              'text-2xl transition-transform',
              state === 'copied'
                ? '-translate-y-3 duration-200 ease-out'
                : 'duration-500 ease-in-out',
            )}
          >
            {React.createElement(allIcons[name])}
          </span>
        </button>
        <Transition
          visible={state === 'copied'}
          enter="transition-opacity duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {({ className, style }, ref) => (
            <p
              className={clsx(
                'absolute inset-x-0 bottom-10 text-center text-[0.8125rem] font-semibold leading-6 text-violet-500',
                className,
              )}
              style={style}
              ref={ref}
            >
              Copied!
            </p>
          )}
        </Transition>
      </div>
      <div className="mt-3 truncate text-center text-[0.8125rem] leading-6 text-text" title={name}>
        {name.replace(/(Outline|Solid)$/, '')}
      </div>
    </div>
  );
};

export default CopyableIcon;
