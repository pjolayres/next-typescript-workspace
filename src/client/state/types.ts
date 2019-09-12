import { PersistedState } from 'redux-persist';

import { UserDataActionTypes, UserDataState } from './user-data/types';
import { AppDataActionTypes, AppDataState } from './app-data/types';

export interface RawState {
  userData: UserDataState;
  appData: AppDataState;
}

export type ReduxState = RawState & PersistedState;

export type ActionTypes = UserDataActionTypes | AppDataActionTypes;
