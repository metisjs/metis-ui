import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import cva from '../_util/cva';
import { ConfigContext } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import MotionThumb from './MotionThumb';

interface SegmentedLabeledOptionWithoutIcon {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: SegmentedRawOption;
  /**
   * html `title` property for label
   */
  title?: string;
}

interface SegmentedLabeledOptionWithIcon extends Omit<SegmentedLabeledOptionWithoutIcon, 'label'> {
  label?: SegmentedLabeledOptionWithoutIcon['label'];
  /** Set icon for Segmented item */
  icon: React.ReactNode;
}

export type SegmentedValue = string | number;

export type SegmentedRawOption = SegmentedValue;

export type SegmentedLabeledOption =
  | SegmentedLabeledOptionWithIcon
  | SegmentedLabeledOptionWithoutIcon;

export type SegmentedOptions = (SegmentedRawOption | SegmentedLabeledOption)[];

export interface SegmentedProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange' | 'size'> {
  options: SegmentedOptions;
  defaultValue?: SegmentedValue;
  value?: SegmentedValue;
  onChange?: (value: SegmentedValue) => void;
  disabled?: boolean;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
  block?: boolean;
  size?: SizeType;
}

function normalizeOptions(options: SegmentedOptions): SegmentedLabeledOption[] {
  return options.map((option) => {
    if (typeof option === 'object' && option !== null) {
      return option;
    }

    return {
      label: option?.toString(),
      value: option,
    };
  });
}

const optionVariantStyles = cva(
  'segmented-item relative flex cursor-pointer justify-center rounded-md text-sm text-neutral-text-secondary',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-neutral-text-quaternary',
        false: 'hover:text-neutral-text',
      },
      selected: {
        true: 'bg-neutral-bg-container text-primary shadow hover:text-primary',
      },
      block: { true: 'min-w-0 flex-1' },
      size: {
        small: 'px-2.5 py-1.5',
        middle: 'px-3 py-2',
        large: 'px-4 py-2.5',
      },
    },
    defaultVariants: {
      size: 'middle',
      disabled: false,
    },
  },
);

const InternalSegmentedOption: React.FC<{
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  value: SegmentedRawOption;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: SegmentedRawOption) => void;
}> = ({ className, disabled, checked, label, icon, title, value, onChange }) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('segmented-item');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event, value);
  };

  return (
    <label className={clsx(className, prefixCls)}>
      <input
        className={clsx(
          'pointer-events-none absolute inset-0 h-0 w-0 opacity-0',
          `${prefixCls}-input`,
        )}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div
        className={clsx('flex w-full justify-center gap-x-2', `${prefixCls}-label`)}
        title={title}
      >
        {icon && <span className={classNames('text-xl/[1.25rem]')}>{icon}</span>}
        {label && <span className="truncate">{label}</span>}
      </div>
    </label>
  );
};

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>((props, ref) => {
  const {
    className,
    block,
    options = [],
    size: customSize = 'middle',
    disabled,
    defaultValue,
    value,
    onChange,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('segmented');

  const containerRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = React.useMemo(
    () => composeRef<HTMLDivElement>(containerRef, ref),
    [containerRef, ref],
  );

  const segmentedOptions = React.useMemo(() => {
    return normalizeOptions(options);
  }, [options]);

  const [rawValue, setRawValue] = useMergedState(segmentedOptions[0]?.value, {
    value,
    defaultValue,
  });

  // ===================== Size =====================
  const size = React.useContext(SizeContext);
  const mergedSize = customSize || size;

  // ======================= Change ========================
  const [thumbShow, setThumbShow] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, val: SegmentedRawOption) => {
    if (disabled) {
      return;
    }

    setRawValue(val);

    onChange?.(val);
  };

  const divProps = omit(restProps, ['children']);

  return (
    <div
      {...divProps}
      className={classNames(
        'inline-block rounded-lg bg-neutral-bg-layout p-0.5 text-neutral-text transition-all duration-300',
        { 'block-segmented flex': block },
        prefixCls,
        className,
      )}
      ref={mergedRef}
    >
      <div
        className={`relative flex w-full items-stretch justify-start gap-x-0.5 ${prefixCls}-group`}
      >
        <MotionThumb
          value={rawValue}
          containerRef={containerRef}
          getValueIndex={(val) => segmentedOptions.findIndex((n) => n.value === val)}
          onMotionStart={() => {
            setThumbShow(true);
          }}
          onMotionEnd={() => {
            setThumbShow(false);
          }}
        />
        {segmentedOptions.map((segmentedOption) => (
          <InternalSegmentedOption
            key={segmentedOption.value}
            className={optionVariantStyles(
              {
                selected: segmentedOption.value === rawValue && !thumbShow,
                block,
                size: mergedSize,
                disabled: !!disabled || !!segmentedOption.disabled,
              },
              [segmentedOption.className],
            )}
            checked={segmentedOption.value === rawValue}
            onChange={handleChange}
            {...segmentedOption}
            disabled={!!disabled || !!segmentedOption.disabled}
          />
        ))}
      </div>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Segmented.displayName = 'Segmented';
}

export default Segmented;
