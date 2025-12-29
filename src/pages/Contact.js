import React from 'react';
import UnderDevelopment from './UnderDevelopment';
import { useLanguage } from '../context';

const Contact = () => {
  const { t } = useLanguage();
  return <UnderDevelopment pageName={t.nav.contact} />;
};

export default Contact;
