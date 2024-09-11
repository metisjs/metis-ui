import * as React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { useMergedState } from 'rc-util';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';

export type SwitchSize = 'small' | 'default';
export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps {
  prefixCls?: string;
  size?: SwitchSize;
  className?: SemanticClassName<'handle'>;
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
  __METIS_SWITCH: boolean;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      prefixCls: customizePrefixCls,
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
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('switch', customizePrefixCls);

    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    });

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = (customDisabled ?? disabled) || loading;

    const semanticCls = getSemanticCls(className);

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
      'relative inline-block h-6 min-w-[2.75rem] cursor-pointer select-none rounded-full bg-fill-secondary align-middle text-xs transition-colors duration-200 ease-in-out',
      'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary',
      'disabled:cursor-not-allowed disabled:opacity-disabled',
      {
        'bg-primary': innerChecked,
        'h-5 min-w-[2rem]': mergedSize === 'small',
        'disabled:opacity-65': loading,
      },
      prefixCls,
      semanticCls.root,
    );

    const handleCls = clsx(
      'pointer-events-none absolute start-0.5 top-0.5 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-all duration-200 ease-in-out',
      {
        'start-[calc(100%-22px)]': innerChecked,
        'h-4 w-4': mergedSize === 'small',
        'start-[calc(100%-18px)]': innerChecked && mergedSize === 'small',
      },
      `${prefixCls}-handle`,
      semanticCls.handle,
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
          {loading && (
            <LoadingOutline
              className={clsx(
                'h-4 w-4 animate-spin text-primary',
                mergedSize === 'small' && 'h-3 w-3',
              )}
            />
          )}
        </div>
        <span
          className={clsx(
            'block h-full w-full overflow-hidden pe-[9px] ps-[26px] leading-6 transition-all duration-200 ease-in-out',
            mergedSize === 'small' && 'pe-[6px] ps-5 leading-5',
            innerChecked && 'pe-[26px] ps-[9px]',
            innerChecked && mergedSize === 'small' && 'pe-5 ps-[6px]',
            `${prefixCls}-inner`,
          )}
        >
          <span
            className={clsx(
              'pointer-events-none me-[calc(100%-24px+52px)] ms-[calc(-100%+24px-52px)] block text-white transition-all duration-200 ease-in-out',
              mergedSize === 'small' && 'me-[calc(100%-20px+40px)] ms-[calc(-100%+20px-40px)]',
              innerChecked && 'me-0 ms-0',
              `${prefixCls}-inner-checked`,
            )}
          >
            {checkedChildren}
          </span>
          <span
            className={clsx(
              'pointer-events-none -mt-6 me-0 ms-0 block text-text-tertiary transition-all duration-200 ease-in-out',
              mergedSize === 'small' && '-mt-5',
              innerChecked && 'me-[calc(-100%+24px-52px)] ms-[calc(100%-24px+52px)]',
              mergedSize === 'small' &&
                innerChecked &&
                'me-[calc(-100%+20px-40px)] ms-[calc(100%-20px+40px)]',
              `${prefixCls}-inner-unchecked`,
            )}
          >
            {unCheckedChildren}
          </span>
        </span>
      </button>
    );
  },
) as CompoundedComponent;

Switch.__METIS_SWITCH = true;
if (process.env.NODE_ENV !== 'production') {
  Switch.displayName = 'Switch';
}

export default Switch;
