import { useMemo } from 'react';
import type { ErrorCorrectionLevel, ImageSettings } from '../interface';
import { QRCode, QrSegment } from '../libs/qrcodegen';
import { ERROR_LEVEL_MAP, getImageSettings, getMarginSize } from '../utils';

export function useQRCode({
  value,
  level,
  minVersion,
  includeMargin,
  marginSize,
  imageSettings,
  size,
}: {
  value: string;
  level: ErrorCorrectionLevel;
  minVersion: number;
  includeMargin: boolean;
  marginSize?: number;
  imageSettings?: ImageSettings;
  size: number;
}) {
  const qrCode = useMemo(() => {
    const segments = QrSegment.makeSegments(value);
    return QRCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion);
  }, [value, level, minVersion]);

  const { cells, margin, numCells, calculatedImageSettings } = useMemo(() => {
    const cs = qrCode.getModules();

    const mg = getMarginSize(includeMargin, marginSize);
    const ncs = cs.length + mg * 2;
    const cis = getImageSettings(cs, size, mg, imageSettings);
    return {
      cells: cs,
      margin: mg,
      numCells: ncs,
      calculatedImageSettings: cis,
    };
  }, [qrCode, size, imageSettings, includeMargin, marginSize]);

  return {
    qrCode,
    margin,
    cells,
    numCells,
    calculatedImageSettings,
  };
}
