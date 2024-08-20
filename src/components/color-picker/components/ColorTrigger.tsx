import type { CSSProperties, MouseEventHandler } from 'react';
import React, { forwardRef, useMemo } from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import type { SemanticClassName } from '../../_util/classNameUtils';
import { clsx, getSemanticCls } from '../../_util/classNameUtils';
import { useLocale } from '../../locale';
import type { AggregationColor } from '../color';
import type { ColorFormatType, ColorPickerProps } from '../interface';
import { getColorAlpha } from '../util';
import ColorBlock from './ColorBlock';
import ColorClear from './ColorClear';

export interface ColorTriggerProps {
  prefixCls: string;
  disabled?: boolean;
  format?: ColorFormatType;
  color: AggregationColor;
  open?: boolean;
  showText?: ColorPickerProps['showText'];
  className?: SemanticClassName<'colorBlock' | 'text'>;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  activeIndex: number;
}

const ColorTrigger = forwardRef<HTMLDivElement, ColorTriggerProps>((props, ref) => {
  const { color, prefixCls, open, disabled, format, className, showText, activeIndex, ...rest } =
    props;
  const semanticCls = getSemanticCls(className);

  const colorTriggerPrefixCls = `${prefixCls}-trigger`;
  const colorTextPrefixCls = `${colorTriggerPrefixCls}-text`;
  const colorTextCellPrefixCls = `${colorTextPrefixCls}-cell`;

  const [locale] = useLocale('ColorPicker');

  // ============================== Text ==============================
  const desc: React.ReactNode = React.useMemo(() => {
    if (!showText) {
      return '';
    }

    if (typeof showText === 'function') {
      return showText(color);
    }

    if (color.cleared) {
      return locale.transparent;
    }

    if (color.isGradient()) {
      return color.getColors().map((c, index) => {
        const inactive = activeIndex !== -1 && activeIndex !== index;

        return (
          <span
            key={index}
            className={clsx(
              colorTextCellPrefixCls,
              inactive && `${colorTextCellPrefixCls}-inactive`,
              'after:content-[",_"] last:after:content-[""]',
            )}
          >
            {c.color.toRgbString()} {c.percent}%
          </span>
        );
      });
    }

    const hexString = color.toHexString().toUpperCase();
    const alpha = getColorAlpha(color);
    switch (format) {
      case 'rgb':
        return color.toRgbString();
      case 'hsb':
        return color.toHsbString();
      // case 'hex':
      default:
        return alpha < 100 ? `${hexString.slice(0, 7)},${alpha}%` : hexString;
    }
  }, [color, format, showText, activeIndex]);

  // ============================= Style =============================
  const rootCls = clsx(
    colorTriggerPrefixCls,

    {
      [`${colorTriggerPrefixCls}-active`]: open,
      [`${colorTriggerPrefixCls}-disabled`]: disabled,
    },
    'w-fit inline-flex p-1 ring-1 ring-inset ring-border rounded-md items-start justify-center gap-2 bg-elevated transition-all duration-200 cursor-pointer text-sm text-text',
    { 'ring-2 ring-primary': open },
    disabled && 'cursor-not-allowed text-text-tertiary bg-fill-quaternary',
    semanticCls.root,
  );
  const textCls = clsx(colorTextPrefixCls, 'mr-1.5 self-center flex-1', semanticCls.text);
  const blockCls = clsx('w-7 h-7', semanticCls.colorBlock);

  // ============================= Render =============================
  const containerNode = useMemo<React.ReactNode>(
    () =>
      color.cleared ? (
        <ColorClear prefixCls={prefixCls} className={blockCls} />
      ) : (
        <ColorBlock prefixCls={prefixCls} color={color.toCssString()} className={blockCls} />
      ),
    [color, prefixCls],
  );

  return (
    <div ref={ref} className={rootCls} {...pickAttrs(rest)}>
      {containerNode}
      {showText && <div className={textCls}>{desc}</div>}
    </div>
  );
});

export default ColorTrigger;
