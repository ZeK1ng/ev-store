import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enAbout from '../public/locales/en/about.json'
import kaAbout from '../public/locales/ka/about.json'

import enCommon from '../public/locales/en/common.json'
import kaCommon from '../public/locales/ka/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, about: enAbout },
      ka: { common: kaCommon, about: kaAbout },
    },
    fallbackLng: 'ka',
    lng: 'ka',
    ns: ['common', 'about', 'home', 'contact'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

export default i18n
