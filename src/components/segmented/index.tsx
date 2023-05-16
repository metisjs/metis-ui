import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';
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

function getValidTitle(option: SegmentedLabeledOption) {
  if (typeof option.title !== 'undefined') {
    return option.title;
  }

  // read `label` when title is `undefined`
  if (typeof option.label !== 'object') {
    return option.label?.toString();
  }
}

function normalizeOptions(options: SegmentedOptions): SegmentedLabeledOption[] {
  return options.map((option) => {
    if (typeof option === 'object' && option !== null) {
      const validTitle = getValidTitle(option);

      return {
        ...option,
        title: validTitle,
      };
    }

    return {
      label: option?.toString(),
      title: option?.toString(),
      value: option,
    };
  });
}

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event, value);
  };

  return (
    <label
      className={classNames(
        'relative flex cursor-pointer justify-center truncate rounded-md text-sm text-neutral-text-secondary transition-colors ',
        {
          '': disabled,
        },
        className,
      )}
    >
      <input
        className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div className="flex gap-x-1" title={title}>
        {icon && <span>{icon}</span>}
        {label && <span>{label}</span>}
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
    motionName = 'segmented-thumb-motion',
    onChange,
    ...restProps
  } = props;

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
        'inline-block rounded-md bg-neutral-bg-layout p-1 text-neutral-text',
        { 'block-segmented flex': block },
        className,
      )}
      ref={mergedRef}
    >
      <div className={`relative flex w-full items-stretch justify-start gap-x-1`}>
        <MotionThumb
          value={rawValue}
          containerRef={containerRef}
          motionName={motionName}
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
            className={classNames(
              `segmented-item`,
              {
                'bg-neutral-bg-container text-neutral-text':
                  segmentedOption.value === rawValue && !thumbShow,
                'min-w-0 flex-1': block,
                'px-4 py-2.5': mergedSize === 'large',
                'px-3 py-2': mergedSize === 'middle',
                'px-2.5 py-1.5': mergedSize === 'small',
              },
              segmentedOption.className,
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
