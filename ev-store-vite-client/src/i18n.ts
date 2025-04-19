import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import kaAbout from '../public/locales/ka/about.json'
import enAbout from '../public/locales/en/about.json'
import ruAbout from '../public/locales/ru/about.json'

import kaCommon from '../public/locales/ka/common.json'
import enCommon from '../public/locales/en/common.json'
import ruCommon from '../public/locales/ru/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ka: { common: kaCommon, about: kaAbout },
      en: { common: enCommon, about: enAbout },
      ru: { common: ruCommon, about: ruAbout },
    },
    fallbackLng: 'ka',
    lng: 'ka',
    ns: ['common', 'about', 'home', 'contact'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

export default i18n
