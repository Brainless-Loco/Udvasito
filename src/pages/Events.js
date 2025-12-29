import React from 'react';
import UnderDevelopment from './UnderDevelopment';
import { useLanguage } from '../context';

const Events = () => {
  const { t } = useLanguage();
  return <UnderDevelopment pageName={t.pages.events} />;
};

export default Events;
