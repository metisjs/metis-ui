import type { CSSProperties } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import type { Locale } from '../locale';
import type { Ecc, QRCode } from './libs/qrcodegen';

export type Modules = ReturnType<QRCode['getModules']>;
export type Excavation = { x: number; y: number; w: number; h: number };
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type CrossOrigin = 'anonymous' | 'use-credentials' | '' | undefined;

export type ERROR_LEVEL_MAPPED_TYPE = {
  [index in ErrorCorrectionLevel]: Ecc;
};

export type ImageSettings = {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
  opacity?: number;
  crossOrigin?: CrossOrigin;
  className?: string;
};

export type QRProps = {
  value: string;
  size?: number;
  level?: ErrorCorrectionLevel;
  bgColor?: string;
  fgColor?: string;
  style?: CSSProperties;
  includeMargin?: boolean;
  marginSize?: number;
  imageSettings?: ImageSettings;
  title?: string;
  minVersion?: number;
};
export type QRPropsCanvas = QRProps & React.CanvasHTMLAttributes<HTMLCanvasElement>;
export type QRPropsSVG = QRProps & React.SVGAttributes<SVGSVGElement>;

export type QRStatus = 'active' | 'expired' | 'loading' | 'scanned';

export type StatusRenderInfo = {
  status: Exclude<QRStatus, 'active'>;
  locale: Locale['QRCode'];
  onRefresh?: () => void;
};

export interface QRCodeProps
  extends QRProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  type?: 'canvas' | 'svg';
  className?: SemanticClassName<{ mask?: string }>;
  prefixCls?: string;
  icon?: string;
  iconSize?: number | { width: number; height: number };
  bordered?: boolean;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
  status?: QRStatus;
  onRefresh?: () => void;
  statusRender?: (info: StatusRenderInfo) => React.ReactNode;
}
