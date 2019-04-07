import express from 'express';
import nextServer from 'next';

import logger from './shared/logger';
import headersConfig from './config/headers-config';
import parsersConfig from './config/parsers-config';
import contentConfig from './config/content-config';

logger.info(`Environment: ${process.env.NODE_ENV}`);
logger.info('☕️  Initializing server');

const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const server = nextServer({ dir: './src', dev });

server.prepare().then(() => {
  const app = express();

  app.get('/health', (_req, res) => {
    res.status(200).end();
  });

  app.get('/robots.txt', (_req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      res.end();
    } else {
      next();
    }
  });

  headersConfig(app);
  parsersConfig(app);
  contentConfig(app, server);

  app.listen(port, (err: any) => {
    if (err) {
      throw err;
    }

    logger.info(`📡  The server is ready (http://localhost:${port}/)`);
  });
});