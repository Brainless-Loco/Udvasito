import React from 'react';
import UnderDevelopment from './UnderDevelopment';
import { useLanguage } from '../context';

const Testimonials = () => {
  const { t } = useLanguage();
  return <UnderDevelopment pageName={t.pages.testimonials} />;
};

export default Testimonials;
