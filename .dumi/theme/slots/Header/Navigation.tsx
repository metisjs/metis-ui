import * as React from 'react';
import { useIntl, useLocation } from 'dumi';
import Link from '../../common/Link';
import * as utils from '../../utils';

export interface NavigationProps {}

const HeaderNavigation: React.FC<NavigationProps> = () => {
  const { formatMessage } = useIntl();
  const { pathname, search } = useLocation();
  const isZhCN = utils.isZhCN(pathname);

  const items = [
    {
      key: 'docs',
      label: formatMessage({ id: 'app.nav.docs' }),
      link: utils.getLocalizedPathname('/docs/introduce', isZhCN, search),
    },
    {
      key: 'components',
      label: formatMessage({ id: 'app.nav.components' }),
      link: utils.getLocalizedPathname('/components/button', isZhCN, search),
    },
  ];

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.key}
          to={item.link}
          className="text-text hidden text-sm/6 text-nowrap md:block"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default HeaderNavigation;
