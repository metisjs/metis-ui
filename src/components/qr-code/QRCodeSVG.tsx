import React from 'react';
import { useQRCode } from './hooks/useQRCode';
import type { QRPropsSVG } from './interface';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FRONT_COLOR,
  DEFAULT_LEVEL,
  DEFAULT_MINVERSION,
  DEFAULT_NEED_MARGIN,
  DEFAULT_SIZE,
  excavateModules,
  generatePath,
} from './utils';

const QRCodeSVG = React.forwardRef<SVGSVGElement, QRPropsSVG>(
  function QRCodeSVG(props, forwardedRef) {
    const {
      value,
      size = DEFAULT_SIZE,
      level = DEFAULT_LEVEL,
      bgColor = DEFAULT_BACKGROUND_COLOR,
      fgColor = DEFAULT_FRONT_COLOR,
      includeMargin = DEFAULT_NEED_MARGIN,
      minVersion = DEFAULT_MINVERSION,
      title,
      marginSize,
      imageSettings,
      ...otherProps
    } = props;

    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
      value,
      level,
      minVersion,
      includeMargin,
      marginSize,
      imageSettings,
      size,
    });

    let cellsToDraw = cells;
    let image = null;
    if (imageSettings && calculatedImageSettings) {
      if (calculatedImageSettings.excavation) {
        cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
      }

      image = (
        <image
          href={imageSettings.src}
          height={calculatedImageSettings.h}
          width={calculatedImageSettings.w}
          x={calculatedImageSettings.x + margin}
          y={calculatedImageSettings.y + margin}
          preserveAspectRatio="none"
          opacity={calculatedImageSettings.opacity}
          // when crossOrigin is not set, the image will be tainted
          // and the canvas cannot be exported to an image
          crossOrigin={calculatedImageSettings.crossOrigin}
        />
      );
    }

    const fgPath = generatePath(cellsToDraw, margin);

    return (
      <svg
        height={size}
        width={size}
        viewBox={`0 0 ${numCells} ${numCells}`}
        ref={forwardedRef}
        role="img"
        {...otherProps}
      >
        {!!title && <title>{title}</title>}
        <path fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`} shapeRendering="crispEdges" />
        <path fill={fgColor} d={fgPath} shapeRendering="crispEdges" />
        {image}
      </svg>
    );
  },
);
QRCodeSVG.displayName = 'QRCodeSVG';

export { QRCodeSVG };
