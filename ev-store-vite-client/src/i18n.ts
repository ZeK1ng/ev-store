import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector';

import kaAbout from '../public/locales/ka/about.json'
import enAbout from '../public/locales/en/about.json'
import ruAbout from '../public/locales/ru/about.json'

import kaHome from '../public/locales/ka/home.json'
import enHome from '../public/locales/en/home.json'
import ruHome from '../public/locales/ru/home.json'

import kaCommon from '../public/locales/ka/common.json'
import enCommon from '../public/locales/en/common.json'
import ruCommon from '../public/locales/ru/common.json'

import kaAuth from '../public/locales/ka/auth.json'
import enAuth from '../public/locales/en/auth.json'
import ruAuth from '../public/locales/ru/auth.json'

import kaCart from '../public/locales/ka/cart.json'
import enCart from '../public/locales/en/cart.json'
import ruCart from '../public/locales/ru/cart.json'

const stored = localStorage.getItem('ev-i18nextLng') || 'ka';

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ka: { common: kaCommon, about: kaAbout, home: kaHome, auth: kaAuth, cart: kaCart },
      en: { common: enCommon, about: enAbout, home: enHome, auth: enAuth, cart: enCart},
      ru: { common: ruCommon, about: ruAbout, home: ruHome, auth: ruAuth, cart: ruCart},
    },
    fallbackLng: 'ka',
    lng: stored,
    // detection: {
    //   order: ['localStorage', 'navigator'], 
    //   caches: ['localStorage'],
    // },
    ns: ['common', 'about', 'home', 'contact'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

export default i18n
