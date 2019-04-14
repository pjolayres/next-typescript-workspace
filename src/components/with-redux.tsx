/**
 * This page is based on Next.js guidelines for using Redux (https://github.com/zeit/next.js/tree/master/examples/with-redux)
 */

import React from 'react';
import { Store, AnyAction } from 'redux';
import { DefaultAppIProps, AppProps } from 'next/app';
import { Persistor } from 'redux-persist';

import configureStore, { StoreConfig } from '../state/configure-store';
import { ReduxState } from '../state/types';
import { AppWindow } from '../../types';
import { MyApp } from '../pages/_app';

const isServer = typeof window === 'undefined';
const storeKey = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState?: ReduxState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return configureStore(initialState) as StoreConfig;
  }

  // Create store if unavailable on the client and set it on the window object
  const appWindow = window as AppWindow;
  if (!appWindow[storeKey]) {
    appWindow[storeKey] = configureStore(initialState);
  }

  return appWindow[storeKey] as StoreConfig;
}

export default (App: typeof MyApp) => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext: any) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const { store, persistor } = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = store;
      appContext.ctx.reduxPersistor = persistor;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: store.getState()
      };
    }

    reduxStore: Store<ReduxState, AnyAction>;
    reduxPersistor: Persistor;

    constructor(props: any) {
      super(props);

      const { store, persistor } = getOrCreateStore();

      this.reduxStore = store;
      this.reduxPersistor = persistor;
    }

    render() {
      return <App {...this.props as DefaultAppIProps & AppProps} reduxStore={this.reduxStore} reduxPersistor={this.reduxPersistor} />;
    }
  };
};
