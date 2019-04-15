import { Express, Request, Response } from 'express';

import EventItem from '../../entities/event-item';
import { ApiListResponse, ListData } from '../../../../types';
import Repository from '../../repositories/repository';

import errorHandler from './error-handler';

export default (app: Express, urlPrefix: string) => {
  app.get(`${urlPrefix}/event-items`, async (req: Request, res: Response) => {
    try {
      const repository = new Repository<EventItem, string>(EventItem);
      const data = await repository.getItems({
        skip: 0,
        take: 5,
        order: {
          StartDate: 'ASC'
        },
        searchText: '%maxime%',
        searchFields: ['Title']
      });

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
};
