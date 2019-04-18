import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps
    };
  }

  render() {
    const rtlLanguageCodes = ['ar', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'];
    const lang = (this.props && this.props.__NEXT_DATA__ && this.props.__NEXT_DATA__.props && this.props.__NEXT_DATA__.props.initialLanguage || 'en').trim();
    const dir = !!rtlLanguageCodes.find(culture => lang.startsWith(culture)) ? 'rtl' : 'ltr';

    return (
      <html lang={lang} dir={dir}>
        <Head />
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
