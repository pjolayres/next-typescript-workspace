import { Express } from 'express';

export default (app: Express) => {
  const urlPrefix = '/api/v1';

  app.get(`${urlPrefix}/test`, (_req, res) =>
    res.json({
      status: 'Success',
      data: new Date().toISOString()
    })
  );

  // Show 404 for unhandled api requests at this point
  app.get(`${urlPrefix}/*`, (_req, res) => {
    res.status(404).end();
  });
};
