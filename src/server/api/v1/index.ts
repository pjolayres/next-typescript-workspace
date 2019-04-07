import { Express } from 'express';

import tools from './tools';

export default (app: Express) => {
  const urlPrefix = '/api/v1';

  tools(app, urlPrefix);

  // Show 404 for unhandled api requests at this point
  app.get(`${urlPrefix}/*`, (_req, res) => {
    res.status(404).end();
  });
};
