import type { FC } from 'react';
import React, { useContext, useMemo } from 'react';
import { useMergedState } from 'rc-util';
import { clsx } from '../../_util/classNameUtils';
import type { CollapseProps } from '../../collapse';
import Collapse from '../../collapse';
import { useLocale } from '../../locale';
import useTheme from '../../theme/useTheme';
import { Color, type AggregationColor } from '../color';
import { PanelPresetsContext } from '../context';
import type { PresetsItem } from '../interface';
import { generateColor } from '../util';
import ColorBlock from './ColorBlock';

interface InternalPresetsProps {
  prefixCls: string;
  presets: PresetsItem[];
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const genPresetColor = (list: PresetsItem[]) =>
  list.map((value) => {
    value.colors = value.colors.map(generateColor);
    return value;
  });

const isLight = (value: AggregationColor, bgColor: string) =>
  new Color(value.toRgbString()).onBackground(bgColor).isLight();

const genCollapsePanelKey = ({ label }: PresetsItem) => `panel-${label}`;

const InternalPresets: FC<InternalPresetsProps> = ({
  prefixCls,
  presets,
  value: color,
  onChange,
}) => {
  const [locale] = useLocale('ColorPicker');
  const [presetsValue] = useMergedState(genPresetColor(presets), {
    value: genPresetColor(presets),
    postState: genPresetColor,
  });
  const { elevated: bgColor } = useTheme();
  const colorPresetsPrefixCls = `${prefixCls}-presets`;

  const activeKeys = useMemo(
    () =>
      presetsValue.reduce<string[]>((acc, preset) => {
        const { defaultOpen = true } = preset;
        if (defaultOpen) acc.push(genCollapsePanelKey(preset));
        return acc;
      }, []),
    [presetsValue],
  );

  const handleClick = (colorValue: AggregationColor) => {
    onChange?.(colorValue);
  };

  const items: CollapseProps['items'] = presetsValue.map((preset) => ({
    key: genCollapsePanelKey(preset),
    label: <div className={`${colorPresetsPrefixCls}-label`}>{preset?.label}</div>,
    children: (
      <div className={`${colorPresetsPrefixCls}-items`}>
        {Array.isArray(preset?.colors) && preset.colors?.length > 0 ? (
          (preset.colors as AggregationColor[]).map((presetColor, index) => (
            <ColorBlock
              key={`preset-${index}-${presetColor.toHexString()}`}
              color={generateColor(presetColor).toRgbString()}
              prefixCls={prefixCls}
              className={clsx(`${colorPresetsPrefixCls}-color`, {
                [`${colorPresetsPrefixCls}-color-checked`]:
                  presetColor.toHexString() === color?.toHexString(),
                [`${colorPresetsPrefixCls}-color-light`]: isLight(presetColor, bgColor),
              })}
              onClick={() => handleClick(presetColor)}
            />
          ))
        ) : (
          <span className={`${colorPresetsPrefixCls}-empty`}>{locale.presetEmpty}</span>
        )}
      </div>
    ),
  }));

  return (
    <div className={colorPresetsPrefixCls}>
      <Collapse defaultActiveKey={activeKeys} ghost items={items} />
    </div>
  );
};

const Presets: FC = () => {
  const { prefixCls, value, presets, onChange } = useContext(PanelPresetsContext);
  return Array.isArray(presets) ? (
    <InternalPresets value={value} presets={presets} prefixCls={prefixCls} onChange={onChange} />
  ) : null;
};

export default Presets;
