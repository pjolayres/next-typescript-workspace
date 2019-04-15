import { Express, Request, Response } from 'express';

import EventItem from '../../entities/event-item';
import { ApiListResponse, ListData } from '../../../../types';

import errorHandler from './error-handler';

export default (app: Express, urlPrefix: string) => {
  app.get(`${urlPrefix}/events`, (req: Request, res: Response) => {
    try {
      // TODO: Fetch data from repository
      const data: ListData<EventItem> = {
        items: [],
        skip: 0,
        take: 10,
        totalItems: 0
      };

      const result: ApiListResponse<EventItem> = {
        success: true,
        status: 'Success',
        data
      };

      res.json(result);
    } catch (ex) {
      errorHandler(req, res, ex, true);
    }

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
