import * as React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { useMergedState } from 'rc-util';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';

export type SwitchSize = 'small' | 'default';
export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps {
  prefixCls?: string;
  size?: SwitchSize;
  className?: SemanticClassName<{ handle?: string }>;
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
  /**
   * Alias for `checked`.
   */
  value?: boolean;
  /**
   * Alias for `defaultChecked`.
   */
  defaultValue?: boolean;
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
      value,
      defaultValue,
      onChange,
      onClick,
    },
    ref,
  ) => {
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('switch', customizePrefixCls);

    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked ?? value,
      defaultValue: defaultChecked ?? defaultValue,
    });

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = (customDisabled ?? disabled) || loading;

    const semanticCls = useSemanticCls(className, 'switch');

    const mergedSize = useSize(customizeSize) as SizeType;
    const isSmall = mergedSize === 'small' || mergedSize === 'mini';

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
      'relative inline-block h-6 w-fit min-w-[2.75rem] cursor-pointer select-none rounded-full bg-fill-secondary align-middle text-xs transition-colors duration-200 ease-in-out',
      'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary',
      'disabled:cursor-not-allowed disabled:opacity-disabled',
      {
        'bg-primary': innerChecked,
        'h-5 min-w-[2rem]': isSmall,
        'disabled:opacity-65': loading,
      },
      prefixCls,
      semanticCls.root,
    );

    const handleCls = clsx(
      'pointer-events-none absolute start-0.5 top-0.5 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-all duration-200 ease-in-out',
      {
        'start-[calc(100%-22px)]': innerChecked,
        'h-4 w-4': isSmall,
        'start-[calc(100%-18px)]': innerChecked && isSmall,
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
              className={clsx('h-4 w-4 animate-spin text-primary', isSmall && 'h-3 w-3')}
            />
          )}
        </div>
        <span
          className={clsx(
            'block h-full w-full overflow-hidden pe-[9px] ps-[26px] leading-6 transition-all duration-200 ease-in-out',
            isSmall && 'pe-[6px] ps-5 leading-5',
            innerChecked && 'pe-[26px] ps-[9px]',
            innerChecked && isSmall && 'pe-5 ps-[6px]',
            `${prefixCls}-inner`,
          )}
        >
          <span
            className={clsx(
              'pointer-events-none me-[calc(100%-24px+52px)] ms-[calc(-100%+24px-52px)] block text-white transition-all duration-200 ease-in-out',
              isSmall && 'me-[calc(100%-20px+40px)] ms-[calc(-100%+20px-40px)]',
              innerChecked && 'me-0 ms-0',
              `${prefixCls}-inner-checked`,
            )}
          >
            {checkedChildren}
          </span>
          <span
            className={clsx(
              'pointer-events-none -mt-6 me-0 ms-0 block text-text-tertiary transition-all duration-200 ease-in-out',
              isSmall && '-mt-5',
              innerChecked && 'me-[calc(-100%+24px-52px)] ms-[calc(100%-24px+52px)]',
              isSmall && innerChecked && 'me-[calc(-100%+20px-40px)] ms-[calc(100%-20px+40px)]',
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
