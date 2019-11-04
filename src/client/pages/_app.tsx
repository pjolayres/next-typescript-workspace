import React from 'react';
import App from 'next/app';
import { Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import { Persistor } from 'redux-persist';

import { appWithTranslation } from '../../shared/localization';
import { ReduxState } from '../state/types';
import withRedux from '../components/with-redux';

interface ReduxAppProps {
  reduxStore: Store<ReduxState, AnyAction>;
  reduxPersistor: Persistor;
}

export class MyApp extends App<ReduxAppProps> {
  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withRedux(appWithTranslation(MyApp));
