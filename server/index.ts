import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import localization from './shared/localization';

const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

console.log(`> Initializing`); // tslint:disable-line: no-console

app.prepare().then(() => {
  const server = express();

  server.get('/api/v1/data', (_req, res) => res.json({
    status: 'Success',
    data: new Date().toISOString()
  }));

  server.get('/data/:id', (req, res) => app.render(req, res, '/data', { id: req.params.id }));

  nextI18NextMiddleware(localization, app, server);

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err: any) => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://localhost:${port}`); // tslint:disable-line: no-console
  });
});
