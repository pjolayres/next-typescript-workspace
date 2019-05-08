import { Express, Request, Response } from 'express';

import EventItem from '../../entities/event-item';
import { ApiListResponse } from '../../../types';
import Repository from '../../repositories/repository';
import Utilities from '../../../shared/utilities';
import { NotImplementedError, MiscellaneousErrorCodes } from '../../../shared/errors';
import ServerUtilities from '../../shared/server-utilities';

import errorHandler from './error-handler';

export default (app: Express, urlPrefix: string) => {
  app.get(`${urlPrefix}/event-items`, async (req: Request, res: Response) => {
    try {
      const options = Utilities.parsePaginatedFetchListOptions<EventItem>(req.query);

      const repository = new Repository<EventItem, string>(EventItem);
      const data = await repository.getPaginatedItems(options);

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

  app.get(`${urlPrefix}/event-items/:id`, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const repository = new Repository<EventItem, string>(EventItem);
      const data = await repository.getById(id);

      if (!data) {
        throw new NotImplementedError('The item does not exist.', MiscellaneousErrorCodes.ItemNotFound);
      }

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

  app.post(`${urlPrefix}/event-items`, async (req: Request, res: Response) => {
    try {
      const item = ServerUtilities.createEntity(EventItem, req.body);

      const repository = new Repository<EventItem, string>(EventItem);
      const data = await repository.add(item);

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

  app.put(`${urlPrefix}/event-items/:id`, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const item = ServerUtilities.createEntity(EventItem, req.body);
      item.EventItemId = id;

      const repository = new Repository<EventItem, string>(EventItem);
      const data = await repository.update(item);

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

  app.delete(`${urlPrefix}/event-items/:id`, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const repository = new Repository<EventItem, string>(EventItem);
      await repository.deleteById(id);

      const result: ApiListResponse<EventItem> = {
        success: true,
        status: 'Success'
      };

      res.json(result);
    } catch (ex) {
      errorHandler(req, res, ex, true);
    }

    res.end();
  });
};
