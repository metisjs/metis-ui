import * as React from 'react';
import { useMergedState } from '@rc-component/util';
import omit from '@rc-component/util/es/omit';
import { composeRef } from '@rc-component/util/es/ref';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import MotionThumb from './MotionThumb';

interface SegmentedLabeledOptionWithoutIcon<T = SegmentedValue> {
  className?: string;
  disabled?: boolean;
  key?: React.Key;
  label: React.ReactNode;
  value: T;
  /**
   * html `title` property for label
   */
  title?: string;
}

interface SegmentedLabeledOptionWithIcon<T = SegmentedValue>
  extends Omit<SegmentedLabeledOptionWithoutIcon<T>, 'label'> {
  label?: SegmentedLabeledOptionWithoutIcon<T>['label'];
  /** Set icon for Segmented item */
  icon: React.ReactNode;
}

export type SegmentedValue = string | number;

export type SegmentedRawOption = SegmentedValue;

export type SegmentedLabeledOption<T = SegmentedValue> =
  | SegmentedLabeledOptionWithIcon<T>
  | SegmentedLabeledOptionWithoutIcon<T>;

export type SegmentedOptions<T = SegmentedRawOption> = (T | SegmentedLabeledOption<T>)[];

export interface SegmentedProps<ValueType = SegmentedValue>
  extends Omit<
    React.HTMLProps<HTMLDivElement>,
    'onChange' | 'size' | 'className' | 'value' | 'defaultValue'
  > {
  prefixCls?: string;
  defaultValue?: ValueType;
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  options: SegmentedOptions<ValueType>;
  disabled?: boolean;
  block?: boolean;
  size?: SizeType;
  className?: SemanticClassName<
    { motionThumb?: string; option?: SegmentedOptionProps['className'] },
    { disabled?: boolean }
  >;
}

export interface SegmentedOptionProps {
  prefixCls: string;
  className?: SemanticClassName<
    { content?: string; icon?: string; label?: string },
    { disabled?: boolean; checked?: boolean }
  >;
  disabled?: boolean;
  block?: boolean;
  size?: SizeType;
  checked: boolean;
  motionEnd: boolean;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  value: SegmentedRawOption;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: SegmentedRawOption) => void;
}

export function normalizeOptions(options: SegmentedOptions): SegmentedLabeledOption[] {
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

const InternalSegmentedOption: React.FC<SegmentedOptionProps> = ({
  prefixCls,
  className,
  size,
  block,
  disabled,
  checked,
  motionEnd,
  label,
  icon,
  title,
  value,
  onChange,
}) => {
  const optionPrefixCls = `${prefixCls}-item`;

  const semanticCls = useSemanticCls(className, { disabled, checked: checked && motionEnd });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event, value);
  };

  const clsString = clsx(
    optionPrefixCls,
    'text-text-secondary relative flex cursor-pointer justify-center rounded-md text-sm',
    disabled ? 'text-text-quaternary cursor-not-allowed' : 'hover:text-text',
    {
      'rounded-sm px-2 py-0.5': size === 'mini',
      'px-2.5 py-1': size === 'small',
      'px-3 py-1.5': size === 'middle',
      'px-3 py-2': size === 'large',
    },
    {
      'min-w-0 flex-1': block,
      'bg-container text-primary hover:text-primary shadow-sm': checked && motionEnd,
    },
    semanticCls.root,
  );

  return (
    <label className={clsString}>
      <input
        className={clsx(
          `${optionPrefixCls}-input`,
          'pointer-events-none absolute inset-0 h-0 w-0 opacity-0',
        )}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div
        className={clsx(`${optionPrefixCls}-content`, 'flex gap-1', semanticCls.content)}
        title={title}
      >
        {icon && (
          <span className={clsx('flex items-center text-xl/[1.25rem]', semanticCls.icon)}>
            {icon}
          </span>
        )}
        {label && <span className={clsx('truncate', semanticCls.label)}>{label}</span>}
      </div>
    </label>
  );
};

const InternalSegmented = React.forwardRef<HTMLDivElement, SegmentedProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    block,
    options = [],
    size: customSize,
    disabled,
    defaultValue,
    value,
    onChange,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('segmented', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'segmented', { disabled });

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
  const mergedSize = useSize(customSize);

  // ======================= Change ========================
  const [thumbShow, setThumbShow] = React.useState(false);

  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, val: SegmentedRawOption) => {
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
      className={clsx(
        prefixCls,
        'bg-fill-quaternary text-text relative inline-flex w-fit items-stretch justify-start gap-x-0.5 rounded-md p-0.5 transition-all duration-300',
        { 'flex w-full': block },
        {
          rounded: mergedSize === 'mini',
        },
        semanticCls.root,
      )}
      ref={mergedRef}
    >
      <MotionThumb
        prefixCls={prefixCls}
        value={rawValue}
        containerRef={containerRef}
        getValueIndex={(val) => segmentedOptions.findIndex((n) => n.value === val)}
        onMotionStart={() => {
          setThumbShow(true);
        }}
        onMotionEnd={() => {
          setThumbShow(false);
        }}
        className={semanticCls.motionThumb}
      />
      {segmentedOptions.map((segmentedOption) => (
        <InternalSegmentedOption
          prefixCls={prefixCls}
          className={mergeSemanticCls(semanticCls.option, segmentedOption.className)}
          checked={segmentedOption.value === rawValue}
          motionEnd={!thumbShow}
          onChange={handleChange}
          {...segmentedOption}
          key={segmentedOption.key ?? segmentedOption.value}
          disabled={!!disabled || !!segmentedOption.disabled}
          size={mergedSize}
          block={block}
        />
      ))}
    </div>
  );
});

const Segmented = InternalSegmented as (<ValueType>(
  props: SegmentedProps<ValueType> & React.RefAttributes<HTMLDivElement>,
) => ReturnType<typeof InternalSegmented>) &
  Pick<React.FC, 'displayName'>;

if (process.env.NODE_ENV !== 'production') {
  Segmented.displayName = 'Segmented';
}
export default Segmented;
