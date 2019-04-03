import NextI18Next, { InitConfig } from 'next-i18next';

const options: InitConfig = {
  localeSubpaths: 'all',
  defaultLanguage: 'en',
  otherLanguages: ['ar']
};

export default new NextI18Next(options);
