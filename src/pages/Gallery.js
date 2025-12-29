import React from 'react';
import UnderDevelopment from './UnderDevelopment';
import { useLanguage } from '../context';

const Gallery = () => {
  const { t } = useLanguage();
  return <UnderDevelopment pageName={t.pages.gallery} />;
};

export default Gallery;
