import React from 'react';
import useLocale from '../../hooks/useLocale';

const locales = {
  cn: {},
  en: {},
};

const Homepage: React.FC = () => {
  const [locale] = useLocale(locales);

  return <section>Placeholder</section>;
};

export default Homepage;
