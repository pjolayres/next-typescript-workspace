import React from 'react';
import renderer from 'react-test-renderer';

import { Home } from '.';

// jest.mock('found/lib/Link', () => 'link');

beforeAll(async () => {
  jest.setTimeout(30 * 1000); // 30-second timeout
});

it('renders correctly', () => {
  const t = jest.fn();
  const namespacesRequired = [ 'common' ];
  const tree = renderer.create(<Home t={t} lng="en" namespacesRequired={namespacesRequired} />).toJSON();

  expect(tree).toMatchSnapshot();
});
