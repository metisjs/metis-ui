import React, { type FC } from 'react';
import { useSiteData } from 'dumi';
import './index.less';

const Footer: FC = () => {
  const { themeConfig } = useSiteData();

  if (!themeConfig.footer) return null;

  return (
    <div className="dumi-default-footer" dangerouslySetInnerHTML={{ __html: themeConfig.footer }} />
  );
};

export default Footer;
