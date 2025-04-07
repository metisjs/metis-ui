import React, { useContext } from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { devUseWarning } from '@util/warning';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import useTheme from '../theme/useTheme';
import type { QRCodeProps, QRProps } from './interface';
import { QRCodeCanvas } from './QRCodeCanvas';
import QRCodeStatus from './QRCodeStatus';
import { QRCodeSVG } from './QRCodeSVG';

const QRCode: React.FC<QRCodeProps> = (props) => {
  const theme = useTheme();

  const {
    value,
    type = 'canvas',
    icon = '',
    size = 160,
    iconSize,
    color = theme.text,
    errorLevel = 'M',
    status = 'active',
    bordered = true,
    onRefresh,
    style,
    className,
    prefixCls: customizePrefixCls,
    bgColor = 'transparent',
    statusRender,
    ...rest
  } = props;
  const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('qr-code', customizePrefixCls);

  const imageSettings: QRProps['imageSettings'] = {
    src: icon,
    x: undefined,
    y: undefined,
    height: typeof iconSize === 'number' ? iconSize : (iconSize?.height ?? 40),
    width: typeof iconSize === 'number' ? iconSize : (iconSize?.width ?? 40),
    excavate: true,
    crossOrigin: 'anonymous',
  };

  const qrCodeProps = {
    value,
    size,
    level: errorLevel,
    bgColor,
    fgColor: color,
    style: { width: style?.width, height: style?.height },
    imageSettings: icon ? imageSettings : undefined,
  };

  const [locale] = useLocale('QRCode');

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('QRCode');

    warning(!!value, 'usage', 'need to receive `value` props');

    warning(
      !(icon && errorLevel === 'L'),
      'usage',
      'ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
    );
  }

  const semanticCls = useSemanticCls(className, 'qrCode');

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-borderless`]: !bordered,
    },
    'bg-container text-text outline-border-secondary relative flex items-center justify-center overflow-hidden rounded-lg p-2 text-sm outline-1',
    {
      'rounded-none p-0 outline-0': !bordered,
    },
    semanticCls.root,
  );

  const maskCls = clsx(
    `${prefixCls}-mask`,
    'bg-container absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center font-medium opacity-95',
    semanticCls.mask,
  );

  const canvasCls = clsx('min-w-0 flex-auto self-stretch');

  const mergedStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    ...style,
    width: style?.width ?? size,
    height: style?.height ?? size,
  };

  if (!value) {
    return null;
  }

  return (
    <div {...rest} className={rootCls} style={mergedStyle}>
      {status !== 'active' && (
        <div className={maskCls}>
          <QRCodeStatus
            prefixCls={prefixCls}
            locale={locale}
            status={status}
            onRefresh={onRefresh}
            statusRender={statusRender}
          />
        </div>
      )}
      {type === 'canvas' ? (
        <QRCodeCanvas {...qrCodeProps} className={canvasCls} />
      ) : (
        <QRCodeSVG {...qrCodeProps} />
      )}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  QRCode.displayName = 'QRCode';
}

export default QRCode;
