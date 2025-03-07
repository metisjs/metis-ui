import React from 'react';
import { ConfigProvider } from 'metis-ui';

export function rootContainer(container: React.ReactNode) {
  return React.createElement(ConfigProvider, null, container);
}
