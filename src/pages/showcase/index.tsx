import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { connect } from 'react-redux';

import { withNamespaces } from '../../shared/localization';
import { LocalizedNextFunctionComponent, LocalizedProps } from '../../types';
import { ReduxState } from '../../state/types';
import { setName, logout } from '../../state/user-data/actions';
import { setVersion } from '../../state/app-data/actions';

import './style.scss';

interface Props extends LocalizedProps, ReduxStateProps, ActionProps {}

export const Showcase: LocalizedNextFunctionComponent<Props> = props => {
  const { t, version, name, setVersion, setName } = props;

  return (
    <div className="showcase">
      <h1>{t('LocalizedText')}</h1>
      <h2>Version: {version}</h2>
      <h2>Name: {name}</h2>
      <button onClick={() => setVersion('1.0.1')}>Change version</button>
      <button onClick={() => setName('Name')}>Change name</button>
    </div>
  );
};

Showcase.getInitialProps = () => ({
  namespacesRequired: ['common']
});

interface ReduxStateProps {
  version: string;
  name: string;
}

interface ActionProps {
  setName: (name: string) => void;
  setVersion: (version: string) => void;
  logout: () => void;
}

const mapStateToProps = (state: ReduxState): ReduxStateProps => ({
  version: state.appData.version,
  name: state.userData.name
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
