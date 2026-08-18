import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en_common from './locales/en/common';
import fr_common from './locales/fr/common';
import en_checkout from './locales/en/checkout';
import fr_checkout from './locales/fr/checkout';
import en_admin from './locales/en/admin';
import fr_admin from './locales/fr/admin';
import en_auth from './locales/en/auth';
import fr_auth from './locales/fr/auth';
import en_account from './locales/en/account';
import fr_account from './locales/fr/account';

import en_navigation from './locales/en/navigation';
import fr_navigation from './locales/fr/navigation';
import en_home from './locales/en/home';
import en_products from './locales/en/products';
import fr_home from './locales/fr/home';
import fr_products from './locales/fr/products';

export const resources = {
  en: {
    common: en_common,
    checkout: en_checkout,
    admin: en_admin,
    auth: en_auth,
    account: en_account,

    navigation: en_navigation,
    home: en_home,
    products: en_products,
  },
  fr: {
    common: fr_common,
    checkout: fr_checkout,
    admin: fr_admin,
    auth: fr_auth,
    account: fr_account,

    navigation: fr_navigation,
    home: fr_home,
    products: fr_products,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['path', 'localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;
