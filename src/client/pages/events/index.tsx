import React, { useState } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { connect } from 'react-redux';
import axios, { AxiosRequestConfig, CancelToken } from 'axios';

import { withTranslation } from '../../../shared/localization';
import { LocalizedNextPage, LocalizedProps, ListData } from '../../../types';
import { ReduxState } from '../../state/types';
import EventItem from '../../../server/entities/event-item';

import './style.scss';

interface Props extends LocalizedProps, ReduxStateProps, ActionProps {
  initialData?: ListData<EventItem>;
}

const fetchData = async (params: string, cancellationToken?: CancelToken) => {
  const options: AxiosRequestConfig = {};
  if (cancellationToken) {
    options.cancelToken = cancellationToken;
  }

  const result = await axios.get(`http://localhost:3000/api/v1/event-items${params}`, options);

  return result.data.data as ListData<EventItem>;
};

export const Events: LocalizedNextPage<Props> = (props: Props) => {
  const { initialData } = props;

  const [data, setData] = useState(initialData);

  const onNextPage = async () => {
    const result = await fetchData(`?skip=${data!.skip + data!.take}&take=5&sortAscending=StartDate`);

    setData(result);
  };

  return (
    <div className="events">
      <ul className="itemsContainer">
        {data &&
          data.items.map(item => (
            <li key={item.EventItemId} className="itemsContainer-items">
              <span>
                {item.EventItemId}: <strong>{item.Title}</strong>
              </span>
            </li>
          ))}
      </ul>
      <button onClick={onNextPage}>Next Page</button>
    </div>
  );
};

Events.getInitialProps = async () => {
  const initialData = await fetchData('?skip=0&take=5&sortAscending=StartDate');

  return {
    initialData,
    namespacesRequired: ['common']
  };
};

interface ReduxStateProps {
  name: string;
  rehydrated: boolean;
}

interface ActionProps {}

const mapStateToProps = (state: ReduxState): ReduxStateProps => ({
  name: state.userData.name,
  rehydrated: (state._persist && state._persist.rehydrated) || false
});

const mapDispatchToProps = (_dispatch: ThunkDispatch<ReduxState, {}, Action>): ActionProps => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('common')(Events));
