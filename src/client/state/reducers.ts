import { combineReducers } from 'redux';

import userData from './user-data/reducers';
import appData from './app-data/reducers';
import { RawState } from './types';

const reducer = combineReducers<RawState>({
  userData,
  appData
});

export default reducer;
