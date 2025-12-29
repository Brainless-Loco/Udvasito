import React from 'react';
import UnderDevelopment from './UnderDevelopment';
import { useLanguage } from '../context';

const SuccessStories = () => {
  const { t } = useLanguage();
  return <UnderDevelopment pageName={t.pages.successStories} />;
};

export default SuccessStories;
