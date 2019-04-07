import { Express, Request, Response } from 'express';

import errorHandler from './error-handler';

export default (app: Express, urlPrefix: string) => {
  app.get(`${urlPrefix}/tools/test`, (_req: Request, res: Response) => {
    res.json({
      success: true,
      status: 'Success',
      data: new Date().toISOString()
    });

    res.end();
  });

  app.get(`${urlPrefix}/tools/error`, (req: Request, res: Response) => {
    try {
      throw new Error('This is a sample error');
    } catch (ex) {
      errorHandler(req, res, ex, true);
    }

    res.end();
  });
};
