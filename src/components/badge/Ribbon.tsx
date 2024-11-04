import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import type { PresetColorType } from '../_util/colors';
import { getPresetColorCls, isPresetColor } from '../_util/colors';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { LiteralUnion } from '../_util/type';
import { ConfigContext } from '../config-provider';

type RibbonPlacement = 'start' | 'end';

export interface RibbonProps {
  className?: SemanticClassName<{ corner?: string; text?: string }>;
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

  const wrapperCls = clsx(`${prefixCls}-wrapper`, 'relative');
  const ribbonCls = clsx(
    prefixCls,
    `${prefixCls}-placement-${placement}`,
    {
      [`${prefixCls}-color-${color}`]: colorInPreset,
    },
    'absolute top-2 whitespace-nowrap rounded bg-primary px-2 text-sm leading-[1.375rem]',
    {
      '-start-2 rounded-bl-none': placement === 'start',
      '-end-2 rounded-br-none': placement === 'end',
    },
    colorInPreset && getPresetColorCls(color, { rawBackground: true }),
    semanticCls.root,
  );
  const cornerCls = clsx(
    `${prefixCls}-corner`,
    'absolute top-full h-2 w-2 origin-top scale-y-75 border-4 border-solid border-current text-primary brightness-75',
    {
      'start-0 border-b-transparent border-l-transparent': placement === 'start',
      'end-0 border-b-transparent border-r-transparent': placement === 'end',
    },
    colorInPreset && getPresetColorCls(color, { text: true }),
    semanticCls.corner,
  );

  const colorStyle: React.CSSProperties = {};
  const cornerColorStyle: React.CSSProperties = {};
  if (color && !colorInPreset) {
    colorStyle.color = color;
    cornerColorStyle.color = color;
  }

  return (
    <div className={clsx(wrapperCls)}>
      {children}
      <div className={clsx(ribbonCls)} style={colorStyle}>
        <span className={clsx(`${prefixCls}-text`, 'text-white', semanticCls.text)}>{text}</span>
        <div className={cornerCls} style={cornerColorStyle} />
      </div>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Ribbon.displayName = 'Ribbon';
}

export default Ribbon;
