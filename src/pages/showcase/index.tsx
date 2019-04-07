import React from 'react';

import { withNamespaces } from '../../shared/localization';
import { LocalizedNextFunctionComponent } from '../../types';

import './style.scss';

export const Showcase: LocalizedNextFunctionComponent = props => {
  const { t } = props;

  return (
    <div className="showcase">
      <h1>{t('LocalizedText')}</h1>
    </div>
  );
};

Showcase.getInitialProps = () => ({
  namespacesRequired: ['common']
});

export default withNamespaces('common')(Showcase);
