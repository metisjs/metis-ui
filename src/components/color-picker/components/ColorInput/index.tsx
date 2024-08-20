import type { FC } from 'react';
import React, { useMemo } from 'react';
import { CheckOutline } from '@metisjs/icons';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { clsx } from '../../../_util/classNameUtils';
import Select from '../../../select';
import type { AggregationColor } from '../../color';
import type { ColorFormatType } from '../../interface';
import { ColorFormat } from '../../interface';
import AlphaInput from './AlphaInput';
import HexInput from './HexInput';
import HsbInput from './HsbInput';
import RgbInput from './RgbInput';

interface ColorInputProps {
  prefixCls: string;
  format?: ColorFormatType;
  onFormatChange?: (format: ColorFormatType) => void;
  disabledAlpha?: boolean;
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const selectOptions = [ColorFormat.hex, ColorFormat.hsb, ColorFormat.rgb].map((format) => ({
  value: format,
  label: format.toLocaleUpperCase(),
}));

const ColorInput: FC<ColorInputProps> = (props) => {
  const { prefixCls, format, value, disabledAlpha, onFormatChange, onChange } = props;
  const [colorFormat, setColorFormat] = useMergedState(ColorFormat.hex, {
    value: format,
    onChange: onFormatChange,
  });

  const colorInputPrefixCls = `${prefixCls}-input`;

  const handleFormatChange = (newFormat: ColorFormatType) => {
    setColorFormat(newFormat);
  };

  const steppersNode = useMemo<React.ReactNode>(() => {
    const inputProps = { value, prefixCls, onChange };
    switch (colorFormat) {
      case ColorFormat.hsb:
        return <HsbInput {...inputProps} />;
      case ColorFormat.rgb:
        return <RgbInput {...inputProps} />;
      // case ColorFormat.hex:
      default:
        return <HexInput {...inputProps} />;
    }
  }, [colorFormat, prefixCls, value, onChange]);

  return (
    <div className={clsx(`${colorInputPrefixCls}-container`, 'flex gap-1 items-start')}>
      <Select
        value={colorFormat}
        variant="borderless"
        getPopupContainer={(current) => current}
        popupMatchSelectWidth={76}
        placement="bottomRight"
        onChange={handleFormatChange}
        size="small"
        options={selectOptions}
        className={{
          root: `${prefixCls}-format-select`,
          selector: 'p-0 after:leading-3',
          selectorItem: 'text-xs pr-6',
          arrow: 'pr-1',
          option: 'text-xs pr-9',
        }}
        menuItemSelectedIcon={<CheckOutline className="h-4 w-4" />}
      />
      <div className={clsx(colorInputPrefixCls, 'flex-1')}>{steppersNode}</div>
      {!disabledAlpha && <AlphaInput prefixCls={prefixCls} value={value} onChange={onChange} />}
    </div>
  );
};

export default ColorInput;
