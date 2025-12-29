import React from 'react';
import UnderDevelopment from './UnderDevelopment';
import { useLanguage } from '../context';

const FAQ = () => {
  const { t } = useLanguage();
  return <UnderDevelopment pageName={t.pages.faq} />;
};

export default FAQ;
