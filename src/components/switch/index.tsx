import { LoadingOutline } from '@metaoa/icons';
import { useMergedState } from 'rc-util';
import * as React from 'react';
import { ComplexClassName, clsx, getClassNames } from '../_util/classNameUtils';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';

export type SwitchSize = 'small' | 'default';
export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps {
  size?: SwitchSize;
  className?: ComplexClassName<'handle'>;
  rootClassName?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: SwitchChangeEventHandler;
  onClick?: SwitchClickEventHandler;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  title?: string;
  tabIndex?: number;
  id?: string;
}

type CompoundedComponent = React.ForwardRefExoticComponent<
  SwitchProps & React.RefAttributes<HTMLElement>
> & {
  /** @internal */
  __META_SWITCH: boolean;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      size: customizeSize,
      disabled: customDisabled,
      loading,
      className,
      checked,
      defaultChecked,
      checkedChildren,
      unCheckedChildren,
      onChange,
      onClick,
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    });

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = (customDisabled ?? disabled) || loading;

    const classNames = getClassNames(className);

    const mergedSize = useSize(customizeSize);

    function triggerChange(
      newChecked: boolean,
      event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    ) {
      let mergedChecked = innerChecked;

      if (!mergedDisabled) {
        mergedChecked = newChecked;
        setInnerChecked(mergedChecked);
        onChange?.(mergedChecked, event);
      }

      return mergedChecked;
    }

    function onInternalKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.key === 'ArrowLeft') {
        triggerChange(false, e);
      } else if (e.key === 'ArrowRight') {
        triggerChange(true, e);
      }
    }

    function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
      const ret = triggerChange(!innerChecked, e);
      // [Legacy] trigger onClick with value
      onClick?.(ret, e);
    }

    const rootCls = clsx(
      'relative inline-block h-6 min-w-[2.75rem] cursor-pointer rounded-full bg-neutral-fill-secondary text-xs transition-colors duration-200 ease-in-out',
      'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary',
      {
        'border-primary bg-primary': innerChecked,
        '123': mergedSize === 'small',
        '32': loading,
      },
      classNames.root,
    );

    const handleCls = clsx(
      'pointer-events-none absolute start-0.5 top-0.5 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-all duration-200 ease-in-out',
      { 'start-[calc(100%-1.25rem-0.125rem)]': innerChecked },
      classNames.handle,
    );

    return (
      <button
        type="button"
        role="switch"
        aria-checked={innerChecked}
        disabled={mergedDisabled}
        className={rootCls}
        ref={ref}
        onKeyDown={onInternalKeyDown}
        onClick={onInternalClick}
      >
        <div className={handleCls}>
          {loading && <LoadingOutline className="h-4 w-4 animate-spin text-primary" />}
        </div>
        <span
          className={clsx(
            'block overflow-hidden pe-2 ps-7 text-neutral-text-tertiary',
            innerChecked && 'pe-7 ps-2 text-white',
          )}
        >
          <span
            className={clsx(
              'me-[calc(100%-24px+48px)] ms-[calc(-100%+24px-48px)] empty:hidden',
              innerChecked && 'me-0 ms-0',
            )}
          >
            {checkedChildren}
          </span>
          <span
            className={clsx(
              'me-0 ms-0 empty:hidden',
              innerChecked && 'me-[calc(100%-24px+48px)] ms-[calc(-100%+24px-48px)]',
            )}
          >
            {unCheckedChildren}
          </span>
        </span>
      </button>
    );
  },
) as CompoundedComponent;

Switch.__META_SWITCH = true;
if (process.env.NODE_ENV !== 'production') {
  Switch.displayName = 'Switch';
}

export default Switch;
