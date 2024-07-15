import * as React from 'react';

const noop = () => {};

export interface DrawerContextProps {
  pushDistance?: number | string;
  push: VoidFunction;
  pull: VoidFunction;
}

const DrawerContext = React.createContext<DrawerContextProps>({ pull: noop, push: noop });

export default DrawerContext;
