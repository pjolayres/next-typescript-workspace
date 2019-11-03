import NextI18Next from 'next-i18next';

const localization = new NextI18Next({
  localeSubpaths: {
    ar: 'ar'
  },
  defaultLanguage: 'en',
  otherLanguages: ['ar'],
  localePath: 'src/static/locales'
});

export const { appWithTranslation, withTranslation, Link, Router } = localization;

export default localization;
