import React, { useState, useEffect } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

import { withNamespaces } from '../../shared/localization';
import { LocalizedNextFunctionComponent, LocalizedProps } from '../../types';
import { ReduxState } from '../../state/types';
import { setName, logout } from '../../state/user-data/actions';
import { setVersion } from '../../state/app-data/actions';

import './style.scss';

interface Props extends LocalizedProps, ReduxStateProps, ActionProps {
  data: User;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

export const Showcase: LocalizedNextFunctionComponent<Props> = props => {
  const { t, version, name, data, rehydrated } = props;

  const [count, setCount] = useState(1);
  const [user, setUser] = useState<User | null>(() => data); // Data is based on prefetched data from the server

  useEffect(() => {
    const useEfectAsync = async () => {
      // Fetch another user to overwrite the prefetched data from the server
      const result = await fetchData(2);

      setUser(result);
    };

    useEfectAsync();
  }, []);

  return (
    <div className="showcase">
      {!rehydrated && <h1>Loading...</h1>}
      <h1>{t('LocalizedText')}</h1>
      <h2>Version: {version}</h2>
      <button onClick={() => props.setVersion('1.0.1')}>Change version</button>
      <h2>Name: {name}</h2>
      <button onClick={() => props.setName('Name')}>Change name</button>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
      {user && <h2>User: {user.first_name}</h2>}
    </div>
  );
};

const fetchData = async (id: number) => {
  const result = await axios.get(`https://reqres.in/api/users/${id}`);

  if (result && result.data && result.data.data) {
    return result.data.data as User;
  }

  return null;
};

Showcase.getInitialProps = async ({ query }) => {
  const id = parseInt(query.id || 1, 10);

  // Fetch user data before rendering in the server
  const result = await fetchData(id);

  return {
    data: result,
    namespacesRequired: ['common']
  };
};

interface ReduxStateProps {
  version: string;
  name: string;
  rehydrated: boolean;
}

interface ActionProps {
  setName: typeof setName;
  setVersion: typeof setVersion;
  logout: () => void;
}

const mapStateToProps = (state: ReduxState): ReduxStateProps => ({
  version: state.appData.version,
  name: state.userData.name,
  rehydrated: (state._persist && state._persist.rehydrated) || false
});

const mapDispatchToProps = (dispatch: ThunkDispatch<ReduxState, {}, Action>): ActionProps => {
  return {
    setName: (name: string) => dispatch(setName(name)),
    setVersion: (version: string) => dispatch(setVersion(version)),
    logout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces('common')(Showcase));
