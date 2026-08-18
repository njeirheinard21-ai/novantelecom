import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SITE_URL } from '../constants/seo';
import { useLocation } from 'react-router';

export function I18nHelmet() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language?.split('-')[0] || 'en';
  
  // Construct paths for alternates
  const currentPath = location.pathname;
  let pathWithoutLang = currentPath;
  if (currentPath.startsWith('/en/')) {
    pathWithoutLang = currentPath.substring(3);
  } else if (currentPath.startsWith('/fr/')) {
    pathWithoutLang = currentPath.substring(3);
  } else if (currentPath === '/en' || currentPath === '/fr') {
    pathWithoutLang = '/';
  }

  const enUrl = `${SITE_URL}/en${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const frUrl = `${SITE_URL}/fr${pathWithoutLang === '/' ? '' : pathWithoutLang}`;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="fr" href={frUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />
    </Helmet>
  );
}
