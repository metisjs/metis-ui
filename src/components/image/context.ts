import * as React from 'react';
import type { ImageProps, OnGroupPreview, RegisterImage } from './interface';

export interface PreviewGroupContextProps {
  register: RegisterImage;
  onPreview: OnGroupPreview;
  imageClassName: ImageProps['className'];
}

export const PreviewGroupContext = React.createContext<PreviewGroupContextProps | null>(null);
