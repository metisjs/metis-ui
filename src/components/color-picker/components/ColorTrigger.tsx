import type { CSSProperties, MouseEventHandler } from 'react';
import React, { forwardRef, useMemo } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import pickAttrs from 'rc-util/lib/pickAttrs';
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
  className?: SemanticClassName<{ colorBlock?: string; text?: string }>;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  activeIndex: number;
}

const ColorTrigger = forwardRef<HTMLDivElement, ColorTriggerProps>((props, ref) => {
  const { color, prefixCls, open, disabled, format, className, showText, activeIndex, ...rest } =
    props;
  const semanticCls = useSemanticCls(className);

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
    'inline-flex w-fit cursor-pointer items-start justify-center gap-2 rounded-md bg-elevated p-1 text-sm text-text ring-1 ring-inset ring-border transition-all duration-200',
    { 'ring-2 ring-primary': open },
    disabled && 'cursor-not-allowed bg-fill-quaternary text-text-tertiary',
    semanticCls.root,
  );
  const textCls = clsx(colorTextPrefixCls, 'mr-1.5 flex-1 self-center', semanticCls.text);
  const blockCls = clsx('h-7 w-7', semanticCls.colorBlock);

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
