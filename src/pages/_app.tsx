import React from 'react';
import App, { Container } from 'next/app';
import { Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';

import { appWithTranslation } from '../shared/localization';
import { ReduxState } from '../state/types';
import withRedux from '../components/with-redux';

interface ReduxAppProps {
  reduxStore: Store<ReduxState, AnyAction>;
}

export class MyApp extends App<ReduxAppProps> {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(appWithTranslation(MyApp));
