import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import type { PresetColorType } from '@util/colors';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { LiteralUnion } from '@util/type';
import { ConfigContext } from '../config-provider';

type RibbonPlacement = 'start' | 'end';

export interface RibbonProps {
  className?: SemanticClassName<{ wrapper?: string }>;
  prefixCls?: string;
  color?: LiteralUnion<PresetColorType>;
  text?: React.ReactNode;
  children?: React.ReactNode;
  placement?: RibbonPlacement;
}

const Ribbon: React.FC<RibbonProps> = (props) => {
  const {
    className,
    prefixCls: customizePrefixCls,
    children,
    color,
    text,
    placement = 'end',
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('ribbon', customizePrefixCls);
  const semanticCls = useSemanticCls(className);

  const colorInPreset = isPresetColor(color);

  const wrapperCls = clsx(`${prefixCls}-wrapper`, 'relative', semanticCls.wrapper);
  const ribbonCls = clsx(
    prefixCls,
    `${prefixCls}-placement-${placement}`,
    {
      [`${prefixCls}-color-${color}`]: colorInPreset,
    },
    'bg-primary absolute top-2 rounded-sm px-2 text-sm leading-[1.375rem] whitespace-nowrap text-white',
    {
      '-start-2 rounded-bl-none': placement === 'start',
      '-end-2 rounded-br-none': placement === 'end',
    },
    colorInPreset && getPresetColorCls(color, { rawBackground: true }),
    semanticCls.root,
  );
  const cornerCls = clsx(
    `${prefixCls}-corner`,
    'text-primary absolute top-full h-2 w-2 origin-top scale-y-75 border-4 border-solid border-current brightness-75',
    {
      'start-0 border-b-transparent border-l-transparent': placement === 'start',
      'end-0 border-r-transparent border-b-transparent': placement === 'end',
    },
    colorInPreset && getPresetColorCls(color, { text: true }),
  );

  const colorStyle: React.CSSProperties = {};
  const cornerColorStyle: React.CSSProperties = {};
  if (color && !colorInPreset) {
    colorStyle.backgroundColor = color;
    cornerColorStyle.color = color;
  }

  return (
    <div className={wrapperCls}>
      {children}
      <div className={ribbonCls} style={colorStyle}>
        <span className={`${prefixCls}-text`}>{text}</span>
        <div className={cornerCls} style={cornerColorStyle} />
      </div>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Ribbon.displayName = 'Ribbon';
}

export default Ribbon;
