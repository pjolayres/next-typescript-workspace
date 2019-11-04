import NextI18Next from 'next-i18next';

const localization = new NextI18Next({
  localeSubpaths: {
    ar: 'ar'
  },
  defaultLanguage: 'en',
  otherLanguages: ['ar'],
  localePath: 'src/client/public/locales'
});

export const { appWithTranslation, withTranslation, Link, Router, i18n } = localization;

export default localization;
