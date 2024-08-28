import * as React from 'react';
import type { Components, GenerateConfig, Locale } from '../interface';

export interface PickerContextProps<DateType = any> {
  prefixCls: string;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;
  /** Customize button component */
  input?: Components['input'];
}

const PickerContext = React.createContext<PickerContextProps>(null!);

export default PickerContext;
