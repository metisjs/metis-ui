import * as React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { useMergedState } from 'rc-util';
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
  className?: SemanticClassName<{ handle?: string }, { disabled?: boolean; checked?: boolean }>;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: SwitchChangeEventHandler;
  onClick?: SwitchClickEventHandler;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
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

    const semanticCls = useSemanticCls(className, 'switch', {
      disabled: mergedDisabled,
      checked: innerChecked,
    });

    const rootCls = clsx(
      'bg-fill-secondary relative inline-block h-6 w-fit min-w-[2.75rem] cursor-pointer rounded-full align-middle text-xs transition-colors duration-200 ease-in-out select-none',
      'focus:outline-primary focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:opacity-disabled disabled:cursor-not-allowed',
      {
        'bg-primary': innerChecked,
        'h-5 min-w-[2rem]': isSmall,
        'disabled:opacity-65': loading,
      },
      prefixCls,
      semanticCls.root,
    );

    const handleCls = clsx(
      'pointer-events-none absolute start-0.5 top-0.5 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out',
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
              className={clsx('text-primary h-4 w-4 animate-spin', isSmall && 'h-3 w-3')}
            />
          )}
        </div>
        <span
          className={clsx(
            'block h-full w-full overflow-hidden ps-[26px] pe-[9px] leading-6 transition-all duration-200 ease-in-out',
            isSmall && 'ps-5 pe-[6px] leading-5',
            innerChecked && 'ps-[9px] pe-[26px]',
            innerChecked && isSmall && 'ps-[6px] pe-5',
            `${prefixCls}-inner`,
          )}
        >
          <span
            className={clsx(
              'pointer-events-none ms-[calc(-100%+24px-52px)] me-[calc(100%-24px+52px)] block text-white transition-all duration-200 ease-in-out',
              isSmall && 'ms-[calc(-100%+20px-40px)] me-[calc(100%-20px+40px)]',
              innerChecked && 'ms-0 me-0',
              `${prefixCls}-inner-checked`,
            )}
          >
            {checkedChildren}
          </span>
          <span
            className={clsx(
              'text-text-tertiary pointer-events-none ms-0 me-0 -mt-6 block transition-all duration-200 ease-in-out',
              isSmall && '-mt-5',
              innerChecked && 'ms-[calc(100%-24px+52px)] me-[calc(-100%+24px-52px)]',
              isSmall && innerChecked && 'ms-[calc(100%-20px+40px)] me-[calc(-100%+20px-40px)]',
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
