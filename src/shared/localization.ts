import NextI18Next from 'next-i18next';

const localization = new NextI18Next({
  localeSubpaths: 'foreign',
  defaultLanguage: 'en',
  otherLanguages: ['ar'],
  localePath: 'src/static/locales'
});

export const { appWithTranslation, withNamespaces, Link, Router } = localization;

export default localization;
