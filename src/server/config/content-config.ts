import onHeaders from 'on-headers';
import uuid from 'uuid/v4';
import { Express } from 'express';
import nextI18NextMiddleware from 'next-i18next/middleware';
import Server from 'next-server/dist/server/next-server';

import localization from '../../shared/localization';
import apiv1 from '../api/v1';
import graphql from '../api/graphql';
import redirects from '../redirects';
import ServerUtilities from '../shared/server-utilities';

const contentConfig = async (app: Express, server: Server) => {
  // Setup redirects
  redirects(app);

  // Log the request-response duration for benchmarking purposes
  if (process.env.LOG_LEVEL === 'debug') {
    app.use((req, res, next) => {
      const requestId = `[${uuid()} - ${req.method.toUpperCase()}] ${req.originalUrl}`;
      const timer = ServerUtilities.startTimer(requestId);

      onHeaders(res, () => {
        ServerUtilities.stopTimer(timer);
      });

      next();
    });
  }

  // Setup REST API
  apiv1(app);

  // Setup GraphQL API
  await graphql(app);

  // Serve content
  const handle = server.getRequestHandler();

  app.get('/data/:id', (req, res) => server.render(req, res, '/data', { id: req.params.id }));

  app.use(nextI18NextMiddleware(localization));

  // nextI18NextMiddleware(localization, server, app);

  app.get('*', (req, res) => handle(req, res));
};

export default contentConfig;
