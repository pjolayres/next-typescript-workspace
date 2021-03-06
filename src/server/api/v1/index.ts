import { Express } from 'express';

import tools from './tools';
import eventItems from './event-items';
import eventRegistrations from './event-registrations';

export default (app: Express) => {
  const urlPrefix = '/api/v1';

  tools(app, urlPrefix);
  eventItems(app, urlPrefix);
  eventRegistrations(app, urlPrefix);

  // Show 404 for unhandled api requests at this point
  app.get(`${urlPrefix}/*`, (_req, res) => {
    res.status(404).end();
  });
};
