import { createStore, applyMiddleware, compose, AnyAction, Store } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from './reducers';
import { ReduxState } from './types';

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

const middleware: any[] = [thunk];

if (process.env.NODE_ENV !== 'test') {
  const logger = createLogger();
  middleware.push(logger);
}

export default function configureStore(initialState?: ReduxState) {
  const store: Store<ReduxState, AnyAction> = createStore(reducers, initialState, compose(applyMiddleware(...middleware)));

  return store;
}
