import { Express } from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';

import EventItemsResolver from './resolvers/event-items-resolver';
import EventRegistrationsResolver from './resolvers/event-registraions-resolver';
import DataLoaderMiddleware from './shared/data-loader-middleware';

export default async (app: Express) => {
  const urlPrefix = '/graphql';

  const schema = await buildSchema({
    globalMiddlewares: [DataLoaderMiddleware],
    resolvers: [EventItemsResolver, EventRegistrationsResolver]
  });

  const context = {};

  const server = new ApolloServer({
    schema,
    context
  });

  server.applyMiddleware({ app, path: urlPrefix });
};
