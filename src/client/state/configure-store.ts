import { createStore, applyMiddleware, compose, AnyAction, Store } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer, PersistConfig, Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers';
import { ReduxState, RawState } from './types';

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

const middleware: any[] = [thunk];
const isServer = typeof window === 'undefined';

if (!isServer && process.env.NODE_ENV !== 'test') {
  const logger = createLogger();
  middleware.push(logger);
}

const persistConfig: PersistConfig<RawState> = {
  key: 'app-state-v1',
  storage,
  whitelist: ['userData']
};

const persistedReducer = persistReducer<RawState>(persistConfig, reducers);

export interface StoreConfig {
  store: Store<ReduxState, AnyAction>;
  persistor: Persistor;
}

export default function configureStore(initialState?: ReduxState) {
  const store: Store<ReduxState, AnyAction> = createStore(persistedReducer, initialState, compose(applyMiddleware(...middleware)));
  const persistor: Persistor = persistStore(store);

  return {
    store,
    persistor
  } as StoreConfig;
}
