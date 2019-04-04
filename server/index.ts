import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import localization from './shared/localization';
import logger from './shared/logger';

logger.info('☕️  Initializing server');

const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();

server.prepare().then(() => {
  const app = express();

  app.get('/api/v1/data', (_req, res) =>
    res.json({
      status: 'Success',
      data: new Date().toISOString()
    })
  );

  app.get('/data/:id', (req, res) => server.render(req, res, '/data', { id: req.params.id }));

  nextI18NextMiddleware(localization, server, app);

  app.get('*', (req, res) => handle(req, res));

  app.listen(port, (err: any) => {
    if (err) {
      throw err;
    }

    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`📡  The server is initialized and ready at http://localhost:${port}/`);
  });
});
