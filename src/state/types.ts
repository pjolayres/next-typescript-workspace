import { PersistedState } from 'redux-persist';

import reducer from './reducers';
import { UserDataActionTypes } from './user-data/types';
import { AppDataActionTypes } from './app-data/types';

export type ReduxState = ReturnType<typeof reducer> & PersistedState;

export type ActionTypes = UserDataActionTypes | AppDataActionTypes;
