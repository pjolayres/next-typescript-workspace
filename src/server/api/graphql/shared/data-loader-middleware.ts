import { MiddlewareFn } from 'type-graphql';

import { Context } from '../../../../types';

import DataLoaderFactory from './data-loader-factory';

const DataLoaderMiddleware: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.dataLoaderFactory) {
    context.dataLoaderFactory = new DataLoaderFactory();
  }
  return next();
};

export default DataLoaderMiddleware;
