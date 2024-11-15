import type { FC } from 'react';
import React, { useContext, useMemo } from 'react';
import { useMergedState } from 'rc-util';
import type { SemanticClassName } from '../../_util/classNameUtils';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import type { CollapseProps } from '../../collapse';
import Collapse from '../../collapse';
import useTheme from '../../theme/useTheme';
import { Color, type AggregationColor } from '../color';
import { PanelPickerContext, PanelPresetsContext } from '../context';
import type { PresetsItem } from '../interface';
import { generateColor } from '../util';
import ColorBlock from './ColorBlock';

export interface InternalPresetsProps {
  prefixCls: string;
  className?: SemanticClassName<{ header?: string; content?: string; block?: string }>;
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
  className,
  presets,
  value: color,
  onChange,
}) => {
  const [presetsValue] = useMergedState(genPresetColor(presets), {
    value: genPresetColor(presets),
    postState: genPresetColor,
  });
  const { elevated: bgColor } = useTheme();
  const colorPresetsPrefixCls = `${prefixCls}-presets`;

  const semanticCls = useSemanticCls(className);

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

  const items: CollapseProps['items'] = presetsValue
    .filter((preset) => Array.isArray(preset?.colors) && preset.colors?.length > 0)
    .map((preset) => ({
      key: genCollapsePanelKey(preset),
      label: preset?.label,
      children: (
        <>
          {(preset.colors as AggregationColor[]).map((presetColor, index) => (
            <ColorBlock
              key={`preset-${index}-${presetColor.toHexString()}`}
              color={generateColor(presetColor).toRgbString()}
              prefixCls={prefixCls}
              className={clsx(
                `${colorPresetsPrefixCls}-color`,
                {
                  [`${colorPresetsPrefixCls}-color-checked`]:
                    presetColor.toHexString() === color?.toHexString(),
                  [`${colorPresetsPrefixCls}-color-light`]: isLight(presetColor, bgColor),
                },
                'h-6 w-6',
                semanticCls.block,
              )}
              onClick={() => handleClick(presetColor)}
            />
          ))}
        </>
      ),
    }));

  return (
    <Collapse
      prefixCls={colorPresetsPrefixCls}
      defaultActiveKey={activeKeys}
      ghost
      items={items}
      className={{
        root: semanticCls.root,
        panel: {
          icon: 'text-text-tertiary',
          header: clsx('gap-0.5 p-0 text-xs text-text', semanticCls.header),
          content: clsx('flex flex-wrap gap-1.5 px-0 py-2', semanticCls.content),
        },
      }}
    />
  );
};

const Presets: FC = () => {
  const { semanticCls } = useContext(PanelPickerContext);
  const { prefixCls, value, presets, onChange } = useContext(PanelPresetsContext);
  return Array.isArray(presets) ? (
    <InternalPresets
      value={value}
      presets={presets}
      prefixCls={prefixCls}
      onChange={onChange}
      className={semanticCls?.presets}
    />
  ) : null;
};

export default Presets;
