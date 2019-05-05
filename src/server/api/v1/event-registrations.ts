import { Express, Request, Response } from 'express';

import EventRegistration from '../../entities/event-registration';
import { ApiListResponse } from '../../../../types';
import Repository from '../../repositories/repository';
import Utilities from '../../../shared/utilities';
import { NotImplementedError, MiscellaneousErrorCodes } from '../../../shared/errors';
import ServerUtilities from '../../shared/server-utilities';

import errorHandler from './error-handler';

export default (app: Express, urlPrefix: string) => {
  app.get(`${urlPrefix}/event-registrations`, async (req: Request, res: Response) => {
    try {
      const options = Utilities.parsePaginatedFetchListOptions<EventRegistration>(req.query);

      const repository = new Repository<EventRegistration, string>(EventRegistration);
      const data = await repository.getPaginatedItems(options);

      const result: ApiListResponse<EventRegistration> = {
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

  app.get(`${urlPrefix}/event-registrations/:id`, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const repository = new Repository<EventRegistration, string>(EventRegistration);
      const data = await repository.getById(id);

      if (!data) {
        throw new NotImplementedError('The item does not exist.', MiscellaneousErrorCodes.ItemNotFound);
      }

      const result: ApiListResponse<EventRegistration> = {
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

  app.post(`${urlPrefix}/event-registrations`, async (req: Request, res: Response) => {
    try {
      const item = ServerUtilities.createEntity(EventRegistration, req.body);

      const repository = new Repository<EventRegistration, string>(EventRegistration);
      const data = await repository.add(item);

      const result: ApiListResponse<EventRegistration> = {
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

  app.put(`${urlPrefix}/event-registrations/:id`, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const item = ServerUtilities.createEntity(EventRegistration, req.body);
      item.EventRegistrationId = id;

      const repository = new Repository<EventRegistration, string>(EventRegistration);
      const data = await repository.update(item);

      const result: ApiListResponse<EventRegistration> = {
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

  app.delete(`${urlPrefix}/event-registrations/:id`, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const repository = new Repository<EventRegistration, string>(EventRegistration);
      await repository.deleteById(id);

      const result: ApiListResponse<EventRegistration> = {
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
